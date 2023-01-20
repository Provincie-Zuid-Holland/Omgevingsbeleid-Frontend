import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, useState } from 'react'
import { useClickAway, useKey } from 'react-use'

import { LoaderCard } from '@/components/Loader'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import networkGraphFilterMenu from '@/constants/networkGraphFilterMenu'

interface NetworkGraphSidebarProps {
    filters?: any
    setFilters: (e: any) => void
    isLoading?: boolean
}

const NetworkGraphSelectFilters = ({
    filters,
    setFilters,
    isLoading,
}: NetworkGraphSidebarProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const activeFiltersAmount = Object.keys(filters).filter(
        filter => filters[filter]
    ).length

    const buttonRef = useRef<HTMLButtonElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const close = () => {
        setIsOpen(false)
        buttonRef.current?.focus()
    }

    useClickAway(popupRef, e => {
        if (e.target !== buttonRef.current) close()
    })
    useKey('Escape', close)

    return (
        <fieldset className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between px-4 pt-2 pb-1 ml-2 bg-white border rounded-md border-pzh-gray-400">
                <legend>Objecten</legend>
                <FontAwesomeIcon
                    className="ml-16 text-gray-800"
                    icon={isOpen ? faChevronUp : faChevronDown}
                />
                <span
                    className="absolute top-0 flex items-center justify-center w-6 h-6 pt-1 -mt-3 leading-none text-white rounded-full bg-pzh-blue"
                    style={{ right: '-0.75rem' }}>
                    {activeFiltersAmount}
                </span>
            </button>
            {isOpen ? (
                <div
                    ref={popupRef}
                    className="absolute right-0 z-20 p-4 pt-0 pr-6 mt-1 bg-white border rounded-md border-pzh-gray-400">
                    {Object.keys(networkGraphFilterMenu).map(filterSection => (
                        <div key={filterSection} className="mt-4">
                            <span className="font-bold text-pzh-blue-dark">
                                {filterSection}
                            </span>
                            <ul>
                                {isLoading ? (
                                    <li>
                                        <LoaderCard height="10" />
                                    </li>
                                ) : (
                                    Object.keys(filters)
                                        .filter(e =>
                                            networkGraphFilterMenu[
                                                filterSection as keyof typeof networkGraphFilterMenu
                                            ].includes(e)
                                        )
                                        .sort()
                                        .map(filterKey => {
                                            return (
                                                <ListItem
                                                    key={filterKey}
                                                    setFilters={setFilters}
                                                    filterKey={
                                                        filterKey as keyof typeof networkGraphConnectionProperties
                                                    }
                                                    filters={filters}
                                                />
                                            )
                                        })
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : null}
        </fieldset>
    )
}

/**
 *
 * @param {function} setFilters - Value is set in the parent state.
 * @param {number} filterKey - Contains a key value of the filter.
 * @param {object} filters - Contains a collection of filters in object form.
 */

interface ListItemProps {
    setFilters: (e: any) => void
    filterKey: keyof typeof networkGraphConnectionProperties
    filters: any
}

const ListItem = ({ setFilters, filterKey, filters }: ListItemProps) => (
    <li
        className={`cursor-pointer transition duration-100 ease-in flex hover:text-gray-900`}
        key={filterKey}>
        <label
            className="cursor-pointer whitespace-nowrap"
            htmlFor={`filter-item-${networkGraphConnectionProperties[filterKey]?.plural}`}>
            <input
                onChange={() =>
                    setFilters({
                        type: 'toggleFilter',
                        filterType: filterKey,
                        newState: !filters[filterKey],
                    })
                }
                className="mr-2 leading-tight"
                type="checkbox"
                defaultChecked={filters[filterKey]}
                name={filterKey}
                id={`filter-item-${networkGraphConnectionProperties[filterKey]?.plural}`}
            />
            {networkGraphConnectionProperties[filterKey]?.plural}
        </label>
    </li>
)

export default NetworkGraphSelectFilters
