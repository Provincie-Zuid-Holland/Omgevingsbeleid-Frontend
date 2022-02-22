import { Link } from 'react-router-dom'

interface SearchBarPopupItemProps {
    searchQuery: string
    filterItem?: any
    amountOfFilterItems?: number
    dataIndex: number
    setSearchBarPopupOpen: (e: boolean) => void
    selectSearchQueryInput: () => void
    callback?: () => void
}

function SearchBarPopupItem({
    searchQuery,
    filterItem,
    amountOfFilterItems,
    dataIndex,
    setSearchBarPopupOpen,
    selectSearchQueryInput,
    callback,
}: SearchBarPopupItemProps) {
    const focusItem = (type: 'previous' | 'next') => {
        const currentIndex = parseInt(
            document.activeElement?.getAttribute('data-index') || ''
        )
        const isLastItem = currentIndex === amountOfFilterItems
        const isFirstItem = currentIndex === 0

        const focusNewItem = (index: number) =>
            (
                document.querySelector(
                    `[data-index='${index}']`
                ) as HTMLInputElement
            )?.focus()

        if (type === 'next' && isLastItem) {
            return
        } else if (type === 'next' && !isLastItem) {
            focusNewItem(currentIndex + 1)
        } else if (type === 'previous' && isFirstItem) {
            selectSearchQueryInput()
        } else if (type === 'previous' && !isFirstItem) {
            focusNewItem(currentIndex - 1)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.keyCode === 40) {
            // Arrow down
            e.preventDefault()
            focusItem('next')
        } else if (e.keyCode === 38) {
            // Arrow up
            e.preventDefault()
            focusItem('previous')
        }
    }

    const href = filterItem
        ? `/zoekresultaten?query=${searchQuery}&only=${filterItem.filterQuery}`
        : `/zoekresultaten?query=${searchQuery}`

    return (
        <li className={`relative`}>
            <Link
                className={`px-5 w-full relative inline-block hover:bg-gray-50 focus:bg-gray-50 focus:ring focus:rounded cursor-pointer py-2`}
                to={href}
                onClick={() => {
                    setSearchBarPopupOpen(false)
                    if (callback) {
                        callback()
                    }
                }}
                onKeyDown={handleKeyDown}
                data-index={filterItem ? dataIndex + 1 : dataIndex}>
                {filterItem ? (
                    <span className="pl-4 text-sm">
                        In
                        <span className="text-pzh-yellow-dark">
                            {' ' + filterItem.name}
                        </span>
                    </span>
                ) : (
                    <span className="inline-block search-preview">
                        {searchQuery}
                    </span>
                )}
            </Link>
        </li>
    )
}

export default SearchBarPopupItem
