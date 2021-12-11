import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons"

/**
 *
 * @param {object} filters - Contains the current filter state
 * @param {function} setFilters - Contains the current filter state
 */
const ModuleFilters = ({ filters, setFilters }) => {
    return (
        <>
            <ModuleFilterType filters={filters} setFilters={setFilters} />
        </>
    )
}

const ModuleFilterType = ({ filters, setFilters }) => (
    <div className="relative flex items-center group">
        <select
            value={filters.selectedType}
            onChange={(event) =>
                setFilters({
                    type: "changeValue",
                    newValue: event.target.value,
                    property: "selectedType",
                })
            }
            id={`modules-select-type`}
            name={"modules-select-type"}
            className="relative block w-32 px-3 pt-2 pb-1 pr-5 ml-2 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none overflow-ellipsis focus:outline-none hover:border-gray-500 focus:border-gray-500"
        >
            {filters.typeFilters.map((filter) => (
                <option key={filter} value={filter}>
                    {filter}
                </option>
            ))}
        </select>
        <FontAwesomeIcon
            className={`absolute right-0 mr-3 text-gray-500 group-hover:text-gray-800 ease-in duration-100 transition`}
            icon={faCaretDown}
        />
    </div>
)

export default ModuleFilters
