import { Transition } from '@headlessui/react'
import { Heading, Text } from '@pzh-ui/components'
import { Filter as FilterIcon } from '@pzh-ui/icons'
import Tippy from '@tippyjs/react'
import { useState } from 'react'

import { GeoSearchResult } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import Pagination from '@/components/Pagination'
import SearchFilterSection from '@/components/SearchFilterSection'
import SearchResultItem from '@/components/SearchResultItem'
import useSearchFilterStore from '@/hooks/useSearchFilterStore'

interface SidebarResultsProps {
    searchOpen: boolean
    searchResultsTotal: number
    searchResults: GeoSearchResult[]
    setSearchResults: (results: GeoSearchResult[]) => void
    isLoading: boolean
    drawType?: string
    UUIDs: string[]
}

const SidebarResults = ({
    searchOpen,
    searchResultsTotal,
    searchResults,
    setSearchResults,
    isLoading,
    drawType,
    UUIDs,
}: SidebarResultsProps) => {
    const availableFilters = useSearchFilterStore(
        state => state.availableFilters
    )
    const filterState = useSearchFilterStore(state => state.filterState)

    return (
        <Transition
            show={searchOpen}
            enter="transition-all ease-out duration-300 delay-100 transform"
            enterFrom="-mr-840"
            enterTo="mr-0"
            leave="transition-all ease-in duration-300 transform"
            leaveFrom="mr-0"
            leaveTo="-mr-840"
            className="relative w-full max-w-2xl px-4 pt-4 pb-4 overflow-hidden lg:px-20 md:px-10 md:pb-0 md:shadow-pane z-1">
            <div className="pb-2 border-b">
                <div className="flex items-start justify-between">
                    <div>
                        <Heading level="3">Resultaten</Heading>
                        {!isLoading ? (
                            <span className="block text-sm text-opacity-50 text-pzh-blue-dark">
                                {!searchResultsTotal
                                    ? 'Er zijn geen resultaten'
                                    : searchResultsTotal === 1
                                    ? `Er is 1 resultaat`
                                    : `Er zijn ${searchResultsTotal} resultaten`}
                            </span>
                        ) : (
                            <LoaderCard
                                height="18"
                                width="130"
                                className="w-auto"
                            />
                        )}
                    </div>
                    {availableFilters?.length > 1 && (
                        <Filter isLoading={isLoading} />
                    )}
                </div>
            </div>
            <div className="h-full mt-2">
                {!isLoading ? (
                    <>
                        {searchResults.length ? (
                            <div className="h-full pb-8 md:overflow-auto md:pb-20">
                                <ul className="mb-4">
                                    {searchResults
                                        /**
                                         * By default none of the filters are active, if so return all
                                         * If there is one or more filter checked return the checked
                                         */
                                        .filter(item => {
                                            const filterIsActive = Object.keys(
                                                filterState
                                            ).some(
                                                filter =>
                                                    filterState[filter].checked
                                            )

                                            if (!item.Type) {
                                                return false
                                            } else if (
                                                filterIsActive &&
                                                filterState[item.Type]?.checked
                                            ) {
                                                return true
                                            } else if (!filterIsActive) {
                                                return true
                                            } else {
                                                return false
                                            }
                                        })
                                        .map(item => (
                                            <SearchResultItem
                                                searchQuery={null}
                                                item={item}
                                                key={item.UUID}
                                            />
                                        ))}
                                </ul>
                                <Pagination
                                    setSearchResults={setSearchResults}
                                    searchResults={searchResults}
                                    UUIDs={UUIDs}
                                    limit={10}
                                    total={searchResultsTotal}
                                />
                            </div>
                        ) : (
                            <Text className="mt-2">
                                Er zijn geen resultaten voor{' '}
                                {drawType === 'polygon'
                                    ? 'het getekende gebied'
                                    : drawType === 'marker'
                                    ? 'het ingevoerde adres'
                                    : drawType === 'werkingsgebied'
                                    ? 'dit werkingsgebied'
                                    : 'de geplaatste marker'}
                                . Probeer het opnieuw (binnen de grenzen van de
                                provincie Zuid-Holland).
                            </Text>
                        )}
                    </>
                ) : (
                    <div className="mt-4">
                        <LoaderCard height="150" />
                        <LoaderCard height="150" />
                        <LoaderCard height="150" />
                        <LoaderCard height="150" />
                    </div>
                )}
            </div>
        </Transition>
    )
}

const Filter = ({ isLoading }: Partial<SidebarResultsProps>) => {
    const [visible, setVisible] = useState(false)

    return (
        <Tippy
            interactive
            visible={visible}
            onClickOutside={() => setVisible(false)}
            placement="bottom"
            className="pzh-tippy"
            content={
                <div className="flex flex-col w-48 px-4 pt-2 pb-4 bg-white border border-gray-400 rounded shadow-md">
                    <Text className="font-bold">Filteren</Text>

                    <SearchFilterSection loaded={!isLoading} hideLabels />
                </div>
            }>
            <button
                onClick={() => setVisible(!visible)}
                className="flex items-center px-2 py-2 border border-gray-400 rounded">
                <FilterIcon size={16} className="mr-2" />
                <span className="-mb-1 text-sm">Filter</span>
            </button>
        </Tippy>
    )
}

export default SidebarResults
