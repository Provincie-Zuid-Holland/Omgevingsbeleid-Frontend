import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Indicator from '@/components/Indicator'
import ModuleItemDropdown from '@/components/Modules/ModuleItemDropdown'
import * as models from '@/config/objects'
import { ModelReturnTypeBasic, ModelType } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import { getObjectActionText } from '@/utils/dynamicObject'

import { useModulesGetListModuleObjects } from '@/api/fetchers'
import { ModuleObjectActionFull } from '@/api/fetchers.schemas'
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

type FilterOption = { label?: string; value?: string }

const useFormattedData = (
    objects: ModelReturnTypeBasic[],
    navigate: ReturnType<typeof useNavigate>
) => {
    return useMemo(
        () =>
            objects.map(obj => {
                const { Object_Type, ModuleObjectContext, Model, ...rest } = obj

                const model = models[Object_Type as ModelType]
                const actionText = getObjectActionText(
                    ModuleObjectContext?.Action
                )
                const modifiedDate = parseUtc(Model.Modified_Date || '')

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
                    ...(!model.defaults.disabled &&
                        ModuleObjectContext?.Action !== 'Terminate' && {
                            onClick: () =>
                                navigate(
                                    `/muteer/modules/${rest.Module_ID}/${Object_Type}/${Model.Object_ID}/bewerk`
                                ),
                        }),
                }
            }),
        [objects, navigate]
    )
}

interface ObjectsTableProps {
    isLocked: boolean
    isClosed: boolean
}

const ObjectsTable = ({ isLocked, isClosed }: ObjectsTableProps) => {
    const { moduleId } = useParams()
    const navigate = useNavigate()
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const { data: { Module: { Module_ID = 0 } = {} } = {}, isLoading } =
        useModule()

    const { data: objects } = useModulesGetListModuleObjects({
        module_id: Number(moduleId),
    })

    const store = useObjectTableStore()
    const moduleStates = useObjectTableStore(state => state.moduleStates)
    const filters = store.getFilters(Module_ID)
    const sortBy = store.getSortBy(Module_ID)

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
        [ModuleObjectActionFull]
    )

    const isModuleInitialized = Module_ID !== 0 && Module_ID in moduleStates
    const knownTypesRef = useRef<Set<string>>(new Set())

    useEffect(() => {
        if (Module_ID === 0 || typeOptions.length === 0) return

        const isVisible = (opt: { value?: string }) =>
            !models[opt.value as ModelType]?.defaults?.hideFromModuleFilter

        if (!isModuleInitialized) {
            knownTypesRef.current = new Set()
            const filteredTypes = typeOptions.filter(isVisible)
            store.setFilter(Module_ID, 'Object_Type', filteredTypes)
            filteredTypes.forEach(opt => {
                if (opt.value) knownTypesRef.current.add(opt.value)
            })
        } else {
            const known = knownTypesRef.current

            if (known.size === 0) {
                typeOptions.forEach(opt => {
                    if (opt.value) known.add(opt.value)
                })
            } else {
                const newTypes = typeOptions.filter(
                    opt => opt.value && !known.has(opt.value) && isVisible(opt)
                )
                typeOptions.forEach(opt => {
                    if (opt.value) known.add(opt.value)
                })
                if (newTypes.length > 0) {
                    const currentFilters = store.getFilters(Module_ID)
                    store.setFilter(Module_ID, 'Object_Type', [
                        ...currentFilters.Object_Type,
                        ...newTypes,
                    ])
                }
            }
        }
    }, [isModuleInitialized, Module_ID, typeOptions, store])

    const activeTypeFilters = filters.Object_Type.filter(f =>
        typeOptions.some(opt => opt.value === f.value)
    ).length
    const activeActionFilters = filters.Action.filter(f =>
        actionOptions.some(opt => opt.value === f.value)
    ).length

    const handleFilterChange = (
        key: keyof typeof filters,
        value: string | FilterOption[]
    ) => {
        store.setFilter(Module_ID, key, value)
    }

    const handleSortChange: TableProps['onSortingChange'] = updater => {
        const newSort =
            typeof updater === 'function'
                ? updater(store.getSortBy(Module_ID))
                : updater

        store.setSortBy(Module_ID, newSort)
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

    const data = useFormattedData(objects?.results || [], navigate)

    return (
        <div>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex-2">
                    <FieldInput
                        name="Title"
                        placeholder="Zoek op titel van een onderdeel"
                        value={filters.Title}
                        onChange={e =>
                            handleFilterChange('Title', e.target.value)
                        }
                        inlineButton={
                            <Button
                                className="absolute top-1 right-1 flex h-8 w-8 items-center justify-center p-0"
                                aria-label="Zoeken"
                                icon={MagnifyingGlass}
                                iconSize={14}
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
                            handleFilterChange(
                                'Action',
                                selected as FilterOption[]
                            )
                        }
                        variant="small"
                    />
                </div>
                {!isClosed && (
                    <>
                        <Button
                            onPress={() => setActiveModal('moduleAddObject')}
                            isDisabled={isLocked}
                            size="small">
                            Onderdeel toevoegen
                        </Button>
                        <Button
                            onPress={() => setActiveModal('moduleScan')}
                            variant="secondary"
                            icon={ListCheck}
                            iconSize={18}
                            size="small"
                            className="w-10"
                        />
                    </>
                )}
            </div>

            <Table
                columns={columns}
                data={data}
                enableSortingRemoval={false}
                enableMultiSort={false}
                state={{ sorting: sortBy }}
                onSortingChange={handleSortChange}
                manualSorting
                isLoading={isLoading}
            />
        </div>
    )
}

export default ObjectsTable
