import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text } from '@pzh-ui/components'
import classNames from 'classnames'
import * as d3 from 'd3'
import { useState } from 'react'
import { useWindowSize } from 'react-use'

import { LoaderSmallSpan } from '@/components/Loader'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import networkGraphFilterMenu from '@/constants/networkGraphFilterMenu'

export interface NetworkLegendProps {
    isLoading: boolean
    filters: any
    setFilters: (e: any) => void
}

function NetworkLegend({ isLoading, filters, setFilters }: NetworkLegendProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { width } = useWindowSize()
    const isMobile = width <= 768

    return (
        <div className="absolute bottom-0 right-0 p-4 pt-4 mb-4 mr-4 text-sm bg-white border rounded shadow-sm z-5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className={classNames(
                    'flex items-center justify-between w-full',
                    {
                        block: isMobile,
                        hidden: !isMobile,
                        'mb-2': isOpen && isMobile,
                    }
                )}>
                <Text className="bold" type="body">
                    Legenda
                </Text>
                <FontAwesomeIcon
                    className="ml-16 text-gray-800"
                    icon={isOpen ? faChevronDown : faChevronUp}
                />
            </button>
            {(isMobile && isOpen) || !isMobile
                ? Object.keys(networkGraphFilterMenu).map(filterSection => (
                      <div key={filterSection}>
                          <span className="inline-block mt-2 mb-1 font-bold text-pzh-blue-dark">
                              {filterSection}
                          </span>
                          <ul>
                              {isLoading ? (
                                  <LoaderSmallSpan />
                              ) : (
                                  Object.keys(filters)
                                      .filter(e =>
                                          networkGraphFilterMenu[
                                              filterSection as keyof typeof networkGraphFilterMenu
                                          ].includes(e)
                                      )
                                      .sort()
                                      .map(filterKey => {
                                          const nodeSymbol =
                                              networkGraphConnectionProperties[
                                                  filterKey.toLowerCase() as keyof typeof networkGraphConnectionProperties
                                              ].symbol

                                          const iconPath = d3
                                              .symbol()
                                              .type(nodeSymbol)
                                              .size(40)()

                                          const filterTitle =
                                              networkGraphConnectionProperties[
                                                  filterKey as keyof typeof networkGraphConnectionProperties
                                              ]?.plural

                                          const isActive = filters[filterKey]

                                          const iconColor =
                                              networkGraphConnectionProperties[
                                                  filterKey as keyof typeof networkGraphConnectionProperties
                                              ]?.hex

                                          return (
                                              <button
                                                  key={filterTitle}
                                                  onClick={() =>
                                                      setFilters({
                                                          type: 'toggleFilter',
                                                          filterType: filterKey,
                                                          newState:
                                                              !filters[
                                                                  filterKey
                                                              ],
                                                      })
                                                  }
                                                  className="flex items-center">
                                                  <LegendIcon
                                                      iconColor={iconColor}
                                                      isActive={isActive}
                                                      iconPath={iconPath}
                                                  />
                                                  <Text
                                                      className={classNames({
                                                          'opacity-75 line-through':
                                                              !isActive,
                                                      })}
                                                      type="span">
                                                      {filterTitle}
                                                  </Text>
                                              </button>
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

type LegendIconProps = {
    iconColor: string
    isActive: boolean
    iconPath: string | null
}

const LegendIcon = ({ iconColor, isActive, iconPath }: LegendIconProps) => (
    <svg
        width="20"
        height="20"
        fill={iconColor}
        className={classNames('mt-1', {
            'opacity-75': !isActive,
        })}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg">
        <path d={iconPath || ''} transform="translate(5,5)" />
    </svg>
)

export default NetworkLegend
