import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { ModuleObjectShort } from '@/api/fetchers.schemas'
import Indicator from '@/components/Indicator'
import ModuleItemDropdown from '@/components/Modules/ModuleItemDropdown'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import { getObjectActionText } from '@/utils/dynamicObject'

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
import { MagnifyingGlass } from '@pzh-ui/icons'

type FilterOption = { label?: string; value?: string }

const getUniqueOptions = (items: ModuleObjectShort[] = [], path: string) => {
    const seen = new Set<string>()
    return items
        .map(obj => {
            if (path === 'Object_Type') {
                const value = obj.Object_Type
                const label =
                    models[value as ModelType]?.defaults?.singularCapitalize
                return { label, value }
            }

            if (path === 'ModuleObjectContext.Action') {
                const value = obj.ModuleObjectContext?.Action
                const label = getObjectActionText(value)
                return { label, value }
            }

            return undefined
        })
        .filter(
            option =>
                option?.value &&
                !seen.has(option.value) &&
                seen.add(option.value)
        )
        .map(option => ({ label: option?.label, value: option?.value }))
}

const useFilteredAndSortedData = (
    objects: ModuleObjectShort[],
    filters: {
        Title: string
        Object_Type: FilterOption[]
        Action: FilterOption[]
    },
    sortBy: { id: string; desc: boolean }[],
    navigate: ReturnType<typeof useNavigate>
) => {
    return useMemo(() => {
        const filtered = objects.filter(obj => {
            const matchesTitle = obj.Title?.toLowerCase().includes(
                filters.Title.toLowerCase()
            )
            const matchesType =
                filters.Object_Type.length === 0 ||
                filters.Object_Type.some(f => f.value === obj.Object_Type)
            const matchesAction =
                filters.Action.length === 0 ||
                filters.Action.some(
                    f => f.value === obj.ModuleObjectContext?.Action
                )

            return matchesTitle && matchesType && matchesAction
        })

        const formatted = filtered.map(obj => {
            const {
                Title,
                Object_Type,
                ModuleObjectContext,
                Modified_Date,
                ...rest
            } = obj

            const model = models[Object_Type as ModelType]
            const actionText = getObjectActionText(ModuleObjectContext?.Action)
            const modifiedDate = parseUtc(Modified_Date)

            return {
                raw: {
                    Title: Title.toLowerCase(),
                    Object_Type,
                    Action: actionText,
                    Modified_Date: modifiedDate,
                },
                display: {
                    Title: (
                        <Text bold color="text-pzh-blue-500">
                            {Title}
                        </Text>
                    ),
                    Object_Type: model?.defaults?.singularCapitalize,
                    Action: actionText,
                    Modified_Date: (
                        <span className="flex items-center justify-between whitespace-nowrap">
                            {formatDate(modifiedDate, 'dd-MM-yyyy, p')}
                            <ModuleItemDropdown
                                model={model}
                                Title={Title}
                                Object_Type={Object_Type}
                                ModuleObjectContext={ModuleObjectContext}
                                Modified_Date={Modified_Date}
                                invertHover
                                {...rest}
                            />
                        </span>
                    ),
                    onClick: () =>
                        navigate(
                            `/muteer/modules/${rest.Module_ID}/${Object_Type}/${rest.Object_ID}/bewerk`
                        ),
                },
            }
        })

        const sorted = [...formatted].sort((a, b) => {
            for (const { id, desc } of sortBy) {
                const aVal = a.raw[id as keyof typeof a.raw]
                const bVal = b.raw[id as keyof typeof b.raw]
                if (aVal == null || bVal == null) continue
                if (aVal < bVal) return desc ? 1 : -1
                if (aVal > bVal) return desc ? -1 : 1
            }
            return 0
        })

        return sorted.map(entry => entry.display)
    }, [objects, filters, sortBy, navigate])
}

interface ObjectsTableProps {
    isLocked: boolean
}

const ObjectsTable = ({ isLocked }: ObjectsTableProps) => {
    const navigate = useNavigate()
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const {
        data: { Objects: objects = [], Module: { Module_ID = 0 } = {} } = {},
        isLoading,
    } = useModule()

    const store = useObjectTableStore()
    const filters = store.getFilters(Module_ID)
    const sortBy = store.getSortBy(Module_ID)

    const typeOptions = useMemo(
        () => getUniqueOptions(objects, 'Object_Type'),
        [objects]
    )
    const actionOptions = useMemo(
        () => getUniqueOptions(objects, 'ModuleObjectContext.Action'),
        [objects]
    )

    const activeTypeFilters =
        filters.Object_Type.length <= typeOptions.length
            ? filters.Object_Type.length
            : 0
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

    const data = useFilteredAndSortedData(objects, filters, sortBy, navigate)

    return (
        <div>
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex-2">
                    <FieldInput
                        name="Title"
                        placeholder="Zoek op titel van een onderdeel"
                        icon={MagnifyingGlass}
                        value={filters.Title}
                        onChange={e =>
                            handleFilterChange('Title', e.target.value)
                        }
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
                    />
                </div>
                <Button
                    onPress={() => setActiveModal('moduleAddObject')}
                    isDisabled={isLocked}>
                    Onderdeel toevoegen
                </Button>
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
