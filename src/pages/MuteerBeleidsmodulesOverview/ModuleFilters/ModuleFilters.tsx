interface ModuleFiltersProps {
    setFilters: (arg0: {
        type: string
        newValue: string
        property: string
    }) => void
    filters: {
        statusFilters: string[]
        selectedStatus: string
        typeFilters: string[]
        selectedType: string
    }
}

/**
 *
 * @param {object} filters - Contains the current filter state
 * @param {function} setFilters - Contains the current filter state
 */
const ModuleFilters = ({ filters, setFilters }: ModuleFiltersProps) => (
    <div className="relative flex items-center">
        <select
            value={filters.selectedType}
            onChange={event =>
                setFilters({
                    type: 'changeValue',
                    newValue: event.target.value,
                    property: 'selectedType',
                })
            }
            id={`modules-select-type`}
            name={'modules-select-type'}
            className="relative block w-40 px-3 pt-2 pb-1 pr-5 ml-2 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none overflow-ellipsis focus:outline-none hover:border-gray-500 focus:border-gray-500">
            {filters.typeFilters.map(filter => (
                <option key={filter} value={filter}>
                    {filter}
                </option>
            ))}
        </select>
        <select
            value={filters.selectedStatus}
            onChange={event =>
                setFilters({
                    type: 'changeValue',
                    newValue: event.target.value,
                    property: 'selectedStatus',
                })
            }
            id={`modules-select-status`}
            name={'modules-select-status'}
            className="relative block w-40 px-3 pt-2 pb-1 pr-5 ml-2 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none overflow-ellipsis focus:outline-none hover:border-gray-500 focus:border-gray-500">
            {filters.statusFilters.map(filter => (
                <option key={filter} value={filter}>
                    {filter}
                </option>
            ))}
        </select>
    </div>
)

export default ModuleFilters
