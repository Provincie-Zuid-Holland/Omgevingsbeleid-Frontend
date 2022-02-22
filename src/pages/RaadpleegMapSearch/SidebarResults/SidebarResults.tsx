import { faFilter } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import Tippy from '@tippyjs/react'
import { useState } from 'react'

import { GetSearch200Item } from '@/api/fetchers.schemas'
import Heading from '@/components/Heading'
import { LoaderCard } from '@/components/Loader'
import Pagination from '@/components/Pagination'
import SearchFilterSection from '@/components/SearchFilterSection'
import SearchResultItem from '@/components/SearchResultItem'
import Text from '@/components/Text'
import { FilterCollection } from '@/hooks/useSearchResultFilters'

interface SidebarResultsProps {
    searchOpen: boolean
    searchResults: GetSearch200Item[]
    setSearchResults: (results: GetSearch200Item[]) => void
    isLoading: boolean
    drawType?: string
    onPageFilters: FilterCollection
    setOnPageFilters: any
    UUIDs: string[]
}

const SidebarResults = ({
    searchOpen,
    searchResults,
    setSearchResults,
    isLoading,
    drawType,
    onPageFilters,
    setOnPageFilters,
    UUIDs,
}: SidebarResultsProps) => (
    <Transition
        show={searchOpen}
        enter="transition-all ease-out duration-300 delay-100 transform"
        enterFrom="-mr-840"
        enterTo="mr-0"
        leave="transition-all ease-in duration-300 transform"
        leaveFrom="mr-0"
        leaveTo="-mr-840"
        className="pt-4 lg:px-20 md:px-10 px-4 md:pb-0 pb-4 md:shadow-pane relative max-w-2xl w-full z-1 overflow-hidden">
        <div className="border-b pb-2">
            <div className="flex justify-between">
                <Heading level="3">Resultaten</Heading>
                {onPageFilters?.availableFilters?.length > 1 && (
                    <Filter
                        isLoading={isLoading}
                        onPageFilters={onPageFilters}
                        setOnPageFilters={setOnPageFilters}
                    />
                )}
            </div>
            {!isLoading ? (
                <span className="text-pzh-blue-dark text-sm text-opacity-50">
                    {!searchResults.length
                        ? 'Er zijn geen resultaten'
                        : searchResults.length === 1
                        ? `Er is 1 resultaat`
                        : `Er zijn ${searchResults.length} resultaten`}
                </span>
            ) : (
                <LoaderCard height="18" width="130" className="w-auto" />
            )}
        </div>
        <div className="mt-2">
            {!isLoading ? (
                <>
                    {searchResults.length ? (
                        <div className="md:overflow-scroll md:max-h-838 md:pb-8 md:lg:pb-16">
                            <ul className="mb-4">
                                {searchResults
                                    /**
                                     * By default none of the filters are active, if so return all
                                     * If there is one or more filter checked return the checked
                                     */
                                    .filter(item => {
                                        const filterIsActive = Object.keys(
                                            onPageFilters.filterState
                                        ).some(
                                            filter =>
                                                onPageFilters.filterState[
                                                    filter
                                                ].checked
                                        )

                                        if (!item.Type) {
                                            return false
                                        } else if (
                                            filterIsActive &&
                                            onPageFilters.filterState[item.Type]
                                                ?.checked
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
                                setOnPageFilters={setOnPageFilters}
                                setSearchResults={setSearchResults}
                                searchResults={searchResults}
                                UUIDs={UUIDs}
                                limit={10}
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

const Filter = ({
    isLoading,
    onPageFilters,
    setOnPageFilters,
}: Partial<SidebarResultsProps>) => {
    const [visible, setVisible] = useState(false)

    return (
        <Tippy
            visible={visible}
            onClickOutside={() => setVisible(false)}
            placement="bottom"
            className="pzh-tippy"
            content={
                <div className="flex flex-col pt-2 pb-4 px-4 bg-white border border-gray-400 rounded w-48 shadow-md">
                    <Text className="font-bold">Filteren</Text>

                    <SearchFilterSection
                        loaded={!isLoading}
                        onPageFilters={onPageFilters!}
                        setOnPageFilters={setOnPageFilters}
                        hideLabels
                    />
                </div>
            }>
            <button
                onClick={() => setVisible(!visible)}
                className="flex items-center border border-gray-400 rounded py-2 px-2">
                <FontAwesomeIcon icon={faFilter} className="text-sm mr-2" />
                <span className="text-sm -mb-1">Filter</span>
            </button>
        </Tippy>
    )
}

export default SidebarResults
