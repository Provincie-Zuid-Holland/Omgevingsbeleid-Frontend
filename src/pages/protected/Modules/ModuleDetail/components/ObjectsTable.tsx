import { useMemo, useState } from 'react'

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

import { keepPreviousData } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import { useModulesGetListModuleObjects } from '@/api/fetchers'
import { ModuleObjectActionFull, OwnerType } from '@/api/fetchers.schemas'
import Indicator from '@/components/Indicator'
import { LoaderSpinner } from '@/components/Loader'
import ModuleItemDropdown from '@/components/Modules/ModuleItemDropdown'
import * as models from '@/config/objects'
import { ModelReturnTypeBasic, ModelType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import useObjectTableStore from '@/store/objectTableStore'
import { getObjectActionText } from '@/utils/dynamicObject'
import { parseUtc } from '@/utils/parseUtc'

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

    const [title, setTitle] = useState(filters.title)

    const activeTypeFilters = filters.object_type.filter(filter =>
        typeOptions.some(option => option.value === filter.value)
    ).length

    const activeActionFilters = filters.action.filter(filter =>
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
        store.setFilter(tableStateId, 'title', title.trim())
    }

    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex-2">
                <FieldInput
                    name="title"
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
                        className="absolute -top-3 -right-3 z-[1] border-pzh-blue-500 bg-pzh-blue-500 text-pzh-white"
                    />
                )}
                <FieldSelect
                    name="object_type"
                    options={typeOptions}
                    placeholder="Filter op type"
                    isMulti
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isSearchable={false}
                    controlShouldRenderValue={false}
                    value={filters.object_type}
                    onChange={selected =>
                        handleFilterChange(
                            'object_type',
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
                        className="absolute -top-3 -right-3 z-[1] border-pzh-blue-500 bg-pzh-blue-500 text-pzh-white"
                    />
                )}
                <FieldSelect
                    name="action"
                    options={actionOptions}
                    placeholder="Filter op actie"
                    isMulti
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isSearchable={false}
                    controlShouldRenderValue={false}
                    value={filters.action}
                    onChange={selected =>
                        handleFilterChange('action', selected as FilterOption[])
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
                const {
                    object_type,
                    module_object_context: ModuleObjectContext,
                    model: _model,
                    ...rest
                } = obj

                const model = models[object_type as ModelType]
                const actionText = getObjectActionText(
                    ModuleObjectContext?.action
                )
                const modifiedDate = parseUtc(_model.modified_date || '')
                const isEditable =
                    !model.defaults.disabled &&
                    ModuleObjectContext?.action !== 'Terminate'

                return {
                    title: (
                        <Text bold color="text-pzh-blue-500">
                            {_model.title}
                        </Text>
                    ),

                    object_type: model?.defaults?.singularCapitalize,
                    action: actionText,
                    modified_date: (
                        <span className="flex items-center justify-between whitespace-nowrap">
                            {formatDate(modifiedDate, 'dd-MM-yyyy, p')}
                            <ModuleItemDropdown
                                objectConfig={model}
                                object_type={object_type}
                                module_object_context={ModuleObjectContext}
                                model={_model}
                                invertHover
                                {...rest}
                            />
                        </span>
                    ),
                    ...(isEditable &&
                        owners !== 'Others' && {
                            onClick: () =>
                                navigate(
                                    `/muteer/modules/${rest.module_id}/${object_type}/${_model.object_id}/bewerk`
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
    const { canAddNewObjectToModule } = usePermissions()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: { module: { module_id = 0 } = {} } = {} } = useModule()

    const tableStateId = `${module_id}-${owners}`

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
        !!filters.title.trim() ||
        !!filters.object_type.length ||
        !!filters.action.length

    const { data: objects, isFetching } = useModulesGetListModuleObjects(
        {
            module_id: Number(moduleId),
            owner_type: owners,
            ...(owners !== 'All' && {
                owner_id: user?.id,
            }),
            object_types: filters.object_type.length
                ? filters.object_type.map(type => type.value || '')
                : undefined,
            actions: filters.action.length
                ? filters.action.map(
                      type => type.value as ModuleObjectActionFull
                  )
                : undefined,
            only_active_modules: false,
            title: filters.title ? `%${filters.title}%` : undefined,
            offset: (pagination.pageIndex - 1) * pagination.pageSize,
            limit: pagination.pageSize,
            sort_column: sortBy?.[0]?.id || 'title',
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
            { header: 'Titel', accessorKey: 'title' },
            { header: 'Type', accessorKey: 'object_type' },
            { header: 'Actie', accessorKey: 'action' },
            { header: 'Laatst bewerkt', accessorKey: 'modified_date' },
        ],
        []
    )

    const data = useFormattedData(objects?.results || [], navigate, owners)

    return (
        <div>
            {data.length || hasActiveFilters ? (
                <>
                    <ObjectsTableFilters
                        moduleId={module_id}
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
                        isDisabled={isLocked || !canAddNewObjectToModule}
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
