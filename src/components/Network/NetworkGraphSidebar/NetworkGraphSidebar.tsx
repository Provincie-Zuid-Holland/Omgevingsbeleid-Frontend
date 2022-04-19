import {
    faArrowLeft,
    faChevronDown,
    faChevronUp,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { LoaderCard } from '@/components/Loader'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import networkGraphFilterMenu from '@/constants/networkGraphFilterMenu'
import usePreviousPage from '@/hooks/usePreviousPage'

interface NetworkGraphSidebarProps {
    filters?: any
    setFilters: (e: any) => void
    isLoading?: boolean
}

const NetworkGraphSidebar = ({
    filters,
    setFilters,
    isLoading,
}: NetworkGraphSidebarProps) => {
    const { back } = usePreviousPage()
    const windowSize = useWindowSize()

    const [isOpen, setIsOpen] = useState(true)
    const [isTablet, setisTablet] = useState(false)

    useEffect(() => {
        if (windowSize.width < 1024) {
            setisTablet(true)
        } else {
            setisTablet(false)
        }
    }, [windowSize])

    return (
        <div className="w-full px-4 pr-4 mt-10 mb-4 lg:pl-6 lg:ml-10 lg:w-1/4">
            <div
                className="mb-6 text-sm text-pzh-blue cursor-pointer opacity-75 hover:opacity-100 transition-opacity ease-in duration-100 inline-block"
                onClick={() => back()}>
                <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
                <span>Vorige pagina</span>
            </div>
            <h2
                className="relative text-lg text-bold text-pzh-blue"
                onClick={() => {
                    if (isTablet) {
                        setIsOpen(!isOpen)
                    }
                }}>
                {isTablet ? `${isOpen ? 'Sluit' : 'Open'} filters` : 'Filters'}
                {isTablet ? (
                    <FontAwesomeIcon
                        className={`ml-4`}
                        icon={isOpen ? faChevronUp : faChevronDown}
                    />
                ) : null}
            </h2>
            {isOpen
                ? Object.keys(networkGraphFilterMenu).map(filterSection => (
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
                  ))
                : null}
        </div>
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
        className={`cursor-pointer transition duration-100 ease-in hover:text-gray-900`}
        key={filterKey}>
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
        <label
            className="cursor-pointer"
            htmlFor={`filter-item-${networkGraphConnectionProperties[filterKey]?.plural}`}>
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

export default NetworkGraphSidebar
