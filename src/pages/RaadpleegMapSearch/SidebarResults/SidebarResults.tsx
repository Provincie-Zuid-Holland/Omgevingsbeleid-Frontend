import { Transition } from '@headlessui/react'

import { GetSearch200Item } from '@/api/fetchers.schemas'
import Heading from '@/components/Heading'
import { LoaderCard } from '@/components/Loader'
import SearchResultItem from '@/components/SearchResultItem'

interface SidebarResultsProps {
    searchOpen: boolean
    searchResults: GetSearch200Item[]
    isLoading: boolean
}

const SidebarResults = ({
    searchOpen,
    searchResults,
    isLoading,
}: SidebarResultsProps) => (
    <Transition
        show={searchOpen}
        enter="transition-all ease-out duration-300 delay-100 transform"
        enterFrom="-mr-840"
        enterTo="mr-0"
        leave="transition-all ease-in duration-300 transform"
        leaveFrom="mr-0"
        leaveTo="-mr-840"
        className="pt-4 lg:px-20 shadow-pane relative max-w-2xl w-full z-1 overflow-hidden">
        <div className="border-b pb-2">
            <Heading level="3">Resultaten</Heading>
            <span className="text-pzh-blue-dark text-sm text-opacity-50">
                Er zijn 121 resultaten
            </span>
        </div>
        <div className="mt-2">
            {!isLoading ? (
                <ul className="overflow-scroll max-h-844 pb-8 lg:pb-16">
                    {searchResults.map(result => (
                        <SearchResultItem
                            key={result.UUID}
                            item={result}
                            searchQuery={null}
                        />
                    ))}
                </ul>
            ) : (
                <div className="mt-4">
                    <LoaderCard height="150" />
                    <LoaderCard height="150" />
                    <LoaderCard height="150" />
                </div>
            )}
        </div>
    </Transition>
)

export default SidebarResults
