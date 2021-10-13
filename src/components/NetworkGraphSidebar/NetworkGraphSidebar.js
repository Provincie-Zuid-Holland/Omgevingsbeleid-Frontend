import React from "react"
import { faArrowLeft } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useHistory, useLocation } from "react-router-dom"
import { useLastLocation } from "react-router-last-location"

import networkGraphConnectionProperties from "../../constants/networkGraphConnectionProperties"
import networkGraphFilterMenu from "../../constants/networkGraphFilterMenu"

/**
 * Displays a sidebar in the network graph component
 *
 * @param {function} setFilters - Value is set in the parent state.
 * @param {object} filters - Contains filter value which is used in the ListItem component.
 * @param {function} setGraphIsOpen - Contains a boolean value which is set in the parent state to close/open the graph component.
 *
 * @returns A component that displays a sidebar with functionality to filter node types
 */
const NetworkGraphSidebar = ({ setGraphIsOpen, filters, setFilters }) => {
    /**
     * History is set to push a custom url when the graph is Open
     */
    const history = useHistory()
    const location = useLocation()
    const lastLocation = useLastLocation()

    /** Set initial lastLocation, as the networkGraph can update the URL */
    const lastLocationRef = React.useRef(lastLocation)

    const goBack = () => {
        if (
            lastLocationRef?.current?.pathname &&
            lastLocationRef?.current?.pathname !== location.pathname
        ) {
            const lastLocationUrl =
                lastLocationRef?.current?.pathname +
                lastLocationRef?.current?.search
            history.push(lastLocationUrl)
        } else {
            history.push("/")
        }
    }

    return (
        <div className="w-1/4 pl-6 my-10">
            <div
                className="mb-6 text-sm text-gray-600 transition-colors duration-100 ease-in cursor-pointer hover:text-gray-800 "
                onClick={() => {
                    goBack()
                    setGraphIsOpen(false)
                }}
            >
                <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
                <span>Vorige pagina</span>
            </div>
            <h2 className="text-lg text-bold text-pzh-blue">Filter</h2>
            {Object.keys(networkGraphFilterMenu).map((filterSection) => {
                return (
                    <div key={filterSection} className="mt-4">
                        <span className="font-bold text-pzh-blue-dark">
                            {filterSection}
                        </span>
                        <ul>
                            {Object.keys(filters)
                                .filter((e) =>
                                    networkGraphFilterMenu[
                                        filterSection
                                    ].includes(e)
                                )
                                .sort()
                                .map((filterKey) => {
                                    return (
                                        <ListItem
                                            key={filterKey}
                                            setFilters={setFilters}
                                            filterKey={filterKey}
                                            filters={filters}
                                        />
                                    )
                                })}
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

/**
 *
 * @param {function} setFilters - Value is set in the parent state.
 * @param {number} filterKey - Contains a key value of the filter.
 * @param {object} filters - Contains a collection of filters in object form.
 */
const ListItem = ({ setFilters, filterKey, filters }) => {
    return (
        <li
            className={`cursor-pointer transition duration-100 ease-in hover:text-gray-900`}
            key={filterKey}
        >
            <input
                onChange={() =>
                    setFilters({
                        type: "toggleFilter",
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
            <label
                className="cursor-pointer"
                htmlFor={`filter-item-${networkGraphConnectionProperties[filterKey]?.plural}`}
            >
                {networkGraphConnectionProperties[filterKey]?.plural}
                <span
                    className="inline-block w-2 h-2 ml-2 rounded-full"
                    style={{
                        backgroundColor:
                            networkGraphConnectionProperties[filterKey]?.hex,
                    }}
                />
            </label>
        </li>
    )
}

export default NetworkGraphSidebar
