import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Indicator from '@/components/Indicator'
import ModuleItemDropdown from '@/components/Modules/ModuleItemDropdown'
import * as models from '@/config/objects'
import { ModelReturnTypeBasic, ModelType } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import { getObjectActionText } from '@/utils/dynamicObject'

import { useModulesGetListModuleObjects } from '@/api/fetchers'
import { ModuleObjectActionFull, OwnerType } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import useAuth from '@/hooks/useAuth'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import useObjectTableStore from '@/store/objectTableStore'
import { parseUtc } from '@/utils/parseUtc'
import {
    Button,
    FieldInput,
    FieldSelect,
    formatDate,
    Table,
    TableProps,
    Text,
} from '@pzh-ui/components'
import { ListCheck, MagnifyingGlass } from '@pzh-ui/icons'

type FilterOption = {
    label?: string
    value?: string
}

interface ObjectsTableProps {
    isLocked: boolean
    isClosed: boolean
    owners?: OwnerType
}

interface ObjectsTableFiltersProps {
    moduleId: number
    isLocked: boolean
    isClosed: boolean
    typeOptions: FilterOption[]
    actionOptions: FilterOption[]
    onFilterChange: () => void
    owners?: OwnerType
}

const ObjectsTableFilters = ({
    moduleId,
    isLocked,
    isClosed,
    typeOptions,
    actionOptions,
    onFilterChange,
    owners,
}: ObjectsTableFiltersProps) => {
    const { canEditModule } = usePermissions()
    const { isModuleManager } = useModule()

    const tableStateId = `${moduleId}-${owners}`

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const store = useObjectTableStore()
    const filters = store.getFilters(tableStateId)

    const [title, setTitle] = useState(filters.Title)

    const activeTypeFilters = filters.Object_Type.filter(filter =>
        typeOptions.some(option => option.value === filter.value)
    ).length

    const activeActionFilters = filters.Action.filter(filter =>
        actionOptions.some(option => option.value === filter.value)
    ).length

    const handleFilterChange = (
        key: keyof typeof filters,
        value: string | FilterOption[]
    ) => {
        onFilterChange()
        store.setFilter(tableStateId, key, value)
    }

    const applyTitleFilter = () => {
        onFilterChange()
        store.setFilter(tableStateId, 'Title', title.trim())
    }

    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex-2">
                <FieldInput
                    name="Title"
                    placeholder="Zoek op titel van een onderdeel"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            applyTitleFilter()
                        }
                    }}
                    inlineButton={
                        <Button
                            className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center p-0"
                            aria-label="Zoeken"
                            icon={MagnifyingGlass}
                            iconSize={14}
                            onPress={applyTitleFilter}
                        />
                    }
                    variant="small"
                />
            </div>

            <div className="relative flex-1">
                {!!activeTypeFilters && (
                    <Indicator
                        amount={activeTypeFilters}
                        className="border-pzh-blue-500 bg-pzh-blue-500 text-pzh-white absolute -top-3 -right-3 z-[1]"
                    />
                )}
                <FieldSelect
                    name="Object_Type"
                    options={typeOptions}
                    placeholder="Filter op type"
                    isMulti
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isSearchable={false}
                    controlShouldRenderValue={false}
                    value={filters.Object_Type}
                    onChange={selected =>
                        handleFilterChange(
                            'Object_Type',
                            selected as FilterOption[]
                        )
                    }
                    variant="small"
                />
            </div>

            <div className="relative flex-1">
                {!!activeActionFilters && (
                    <Indicator
                        amount={activeActionFilters}
                        className="border-pzh-blue-500 bg-pzh-blue-500 text-pzh-white absolute -top-3 -right-3 z-[1]"
                    />
                )}
                <FieldSelect
                    name="Action"
                    options={actionOptions}
                    placeholder="Filter op actie"
                    isMulti
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isSearchable={false}
                    controlShouldRenderValue={false}
                    value={filters.Action}
                    onChange={selected =>
                        handleFilterChange('Action', selected as FilterOption[])
                    }
                    variant="small"
                />
            </div>

            {!isClosed && (
                <>
                    {owners !== 'Others' && (
                        <Button
                            onPress={() => setActiveModal('moduleAddObject')}
                            isDisabled={isLocked}
                            size="small">
                            Onderdeel toevoegen
                        </Button>
                    )}
                    {(canEditModule || isModuleManager) && (
                        <Button
                            onPress={() => setActiveModal('moduleScan')}
                            variant="secondary"
                            icon={ListCheck}
                            iconSize={18}
                            size="small"
                            className="w-10"
                        />
                    )}
                </>
            )}
        </div>
    )
}

const useFormattedData = (
    objects: ModelReturnTypeBasic[],
    navigate: ReturnType<typeof useNavigate>,
    owners: OwnerType
) =>
    useMemo(
        () =>
            objects.map(obj => {
                const { Object_Type, ModuleObjectContext, Model, ...rest } = obj

                const model = models[Object_Type as ModelType]
                const actionText = getObjectActionText(
                    ModuleObjectContext?.Action
                )
                const modifiedDate = parseUtc(Model.Modified_Date || '')
                const isEditable =
                    !model.defaults.disabled &&
                    ModuleObjectContext?.Action !== 'Terminate'

                return {
                    Title: (
                        <Text bold color="text-pzh-blue-500">
                            {Model.Title}
                        </Text>
                    ),
                    Object_Type: model?.defaults?.singularCapitalize,
                    Action: actionText,
                    Modified_Date: (
                        <span className="flex items-center justify-between whitespace-nowrap">
                            {formatDate(modifiedDate, 'dd-MM-yyyy, p')}
                            <ModuleItemDropdown
                                model={model}
                                Object_Type={Object_Type}
                                ModuleObjectContext={ModuleObjectContext}
                                Model={Model}
                                invertHover
                                {...rest}
                            />
                        </span>
                    ),
                    ...(isEditable &&
                        owners !== 'Others' && {
                            onClick: () =>
                                navigate(
                                    `/muteer/modules/${rest.Module_ID}/${Object_Type}/${Model.Object_ID}/bewerk`
                                ),
                        }),
                }
            }),
        [objects, navigate]
    )

const ObjectsTable = ({
    isLocked,
    isClosed,
    owners = 'All',
}: ObjectsTableProps) => {
    const { moduleId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: { Module: { Module_ID = 0 } = {} } = {} } = useModule()

    const tableStateId = `${Module_ID}-${owners}`

    const store = useObjectTableStore()
    const filters = store.getFilters(tableStateId)
    const pagination = store.getPagination(tableStateId)
    const sortBy = store.getSortBy(tableStateId)

    const typeOptions = useMemo(
        () =>
            Object.keys(models)
                .filter(model => !models[model as ModelType].defaults.atemporal)
                .map(model => ({
                    label: models[model as ModelType].defaults
                        .singularCapitalize,
                    value: model,
                })),
        []
    )

    const actionOptions = useMemo(
        () =>
            Object.keys(ModuleObjectActionFull).map(key => ({
                label: getObjectActionText(key),
                value: key,
            })),
        []
    )

    const hasActiveFilters =
        !!filters.Title.trim() ||
        !!filters.Object_Type.length ||
        !!filters.Action.length

    const { data: objects, isFetching } = useModulesGetListModuleObjects(
        {
            module_id: Number(moduleId),
            owner_type: owners,
            ...(owners !== 'All' && {
                owner_uuid: user?.UUID,
            }),
            object_types: filters.Object_Type.length
                ? filters.Object_Type.map(type => type.value || '')
                : undefined,
            actions: filters.Action.length
                ? filters.Action.map(
                      type => type.value as ModuleObjectActionFull
                  )
                : undefined,
            title: filters.Title ? `%${filters.Title}%` : undefined,
            offset: (pagination.pageIndex - 1) * pagination.pageSize,
            limit: pagination.pageSize,
            sort_column: sortBy?.[0]?.id || 'Title',
            sort_order: sortBy?.[0]?.desc ? 'DESC' : 'ASC',
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    )

    const handleSortChange: TableProps['onSortingChange'] = updater => {
        const newSort =
            typeof updater === 'function'
                ? updater(store.getSortBy(tableStateId))
                : updater

        store.setSortBy(tableStateId, newSort)
    }

    const columns = useMemo(
        () => [
            { header: 'Titel', accessorKey: 'Title' },
            { header: 'Type', accessorKey: 'Object_Type' },
            { header: 'Actie', accessorKey: 'Action' },
            { header: 'Laatst bewerkt', accessorKey: 'Modified_Date' },
        ],
        []
    )

    const data = useFormattedData(objects?.results || [], navigate, owners)

    return (
        <div>
            {data.length || hasActiveFilters ? (
                <>
                    <ObjectsTableFilters
                        moduleId={Module_ID}
                        isLocked={isLocked}
                        isClosed={isClosed}
                        typeOptions={typeOptions}
                        actionOptions={actionOptions}
                        onFilterChange={() =>
                            store.setPagination(tableStateId, prev => ({
                                ...prev,
                                pageIndex: 1,
                            }))
                        }
                        owners={owners}
                    />

                    <Table
                        columns={columns}
                        data={data}
                        enableSortingRemoval={false}
                        enableMultiSort={false}
                        limit={pagination.pageSize}
                        total={objects?.total}
                        current={pagination.pageIndex}
                        onPaginationChange={pagination =>
                            store.setPagination(tableStateId, pagination)
                        }
                        state={{ sorting: sortBy }}
                        onSortingChange={handleSortChange}
                        manualSorting
                        isLoading={isFetching}
                    />

                    {!data.length && !isFetching && (
                        <span className="italic">
                            Geen onderdelen gevonden met deze filters.
                        </span>
                    )}
                </>
            ) : !isFetching ? (
                <div className="flex items-center gap-8">
                    <span className="italic">
                        {owners === 'Mine' ? 'Je hebt' : 'Er zijn'} nog geen
                        onderdelen in deze module.
                    </span>
                    <Button
                        onPress={() => setActiveModal('moduleAddObject')}
                        isDisabled={isLocked}
                        variant="cta">
                        Onderdeel toevoegen
                    </Button>
                </div>
            ) : (
                <div className="mt-8 flex justify-center">
                    <LoaderSpinner />
                </div>
            )}
        </div>
    )
}

export default ObjectsTable
