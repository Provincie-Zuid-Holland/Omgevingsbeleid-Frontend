import { useFloating, shift, offset } from '@floating-ui/react-dom'
import { faFilter } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover, Transition } from '@headlessui/react'

import { GetSearch200Item } from '@/api/fetchers.schemas'
import Heading from '@/components/Heading'
import { LoaderCard } from '@/components/Loader'
import SearchFilterSection from '@/components/SearchFilterSection'
import SearchResultItem from '@/components/SearchResultItem'
import Text from '@/components/Text'
import { FilterCollection } from '@/hooks/useSearchResultFilters'

interface SidebarResultsProps {
    searchOpen: boolean
    searchResults: GetSearch200Item[]
    isLoading: boolean
    drawType?: string
    onPageFilters: FilterCollection
    setOnPageFilters: any
}

const SidebarResults = ({
    searchOpen,
    searchResults,
    isLoading,
    drawType,
    onPageFilters,
    setOnPageFilters,
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
                        <ul className="md:overflow-scroll md:max-h-830 md:pb-8 md:lg:pb-16">
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
                                            onPageFilters.filterState[filter]
                                                .checked
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
                    ) : (
                        <Text className="mt-2">
                            Er zijn geen resultaten voor{' '}
                            {drawType === 'FeatureCollection'
                                ? 'het getekende gebied'
                                : drawType === 'adres'
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
    const { x, y, reference, floating, strategy } = useFloating({
        placement: 'bottom',
        middleware: [shift({ padding: 5 }), offset(15)],
    })

    return (
        <Popover className="relative">
            <Popover.Button
                ref={reference}
                className="flex items-center border border-gray-400 rounded py-2 px-2">
                <FontAwesomeIcon icon={faFilter} className="text-sm mr-2" />
                <span className="text-sm -mb-1">Filter</span>
            </Popover.Button>

            <Popover.Panel
                ref={floating}
                className="z-10"
                style={{
                    position: strategy,
                    top: y ?? '',
                    left: x ?? '',
                }}>
                <div className="flex flex-col py-2 px-4 bg-white border border-gray-400 rounded shadow-md popover-arrow w-40">
                    <Text className="font-bold">Filteren</Text>

                    <SearchFilterSection
                        loaded={!isLoading}
                        onPageFilters={onPageFilters!}
                        setOnPageFilters={setOnPageFilters}
                        hideLabels
                    />
                </div>
            </Popover.Panel>
        </Popover>
    )
}

export default SidebarResults
