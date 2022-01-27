import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParam } from 'react-use'

import { GetSearch200Item } from '@/api/fetchers.schemas'
import { DimensionType } from '@/types/dimensions'

import getDimensionsConstants from '../../../utils/getDimensionsConstants'

// type GetSearch200ItemCustom = Omit<GetSearch200Item, 'type'> & {
//     type: DimensionType
// }

function getExcerpt(text: string) {
    if (!text) {
        return ''
    } else if (text.length > 250) {
        return text.substring(0, 250) + '...'
    } else {
        return text
    }
}

interface SearchResultItem {
    item: GetSearch200Item
    searchQuery: any
}

const SearchResultItem: FC<SearchResultItem> = ({ item, searchQuery }) => {
    const paramTextQuery = useSearchParam('query')

    function getContent() {
        const omschrijving = item.Omschrijving
            ? getExcerpt(item.Omschrijving)
            : ''

        if (!paramTextQuery) {
            return {
                setInnerHTML: true,
                content: {
                    __html: item.Omschrijving ? item.Omschrijving : '',
                },
            }
        }

        const markedOmschrijving = omschrijving.replace(
            new RegExp(paramTextQuery, 'g'),
            `<mark class="marked-red">${paramTextQuery}</mark>`
        )

        return {
            setInnerHTML: true,
            content: {
                __html: markedOmschrijving,
            },
        }
    }

    const content = {
        Titel: item.Titel,
        Omschrijving: getContent(),
    }

    const type = item.Type
    if (!type) return null

    const dimensieContants = getDimensionsConstants(type as DimensionType)
    const overzichtURL = dimensieContants.SLUG_OVERVIEW
    const titleSingular = dimensieContants.TITLE_SINGULAR

    return (
        <li
            className={`py-4 md:pr-8 transition-colors duration-100 ease-in bg-white border-gray-300 group`}
            key={item.UUID}>
            <Link
                className="group"
                to={`/detail/${overzichtURL}/${item.UUID}#${searchQuery}`}>
                <span
                    className="block text-sm opacity-75 text-pzh-blue"
                    data-test="search-result-type">
                    {titleSingular}
                </span>
                <h2 className="block mt-1 text-lg font-bold group-hover:text-pzh-green text-pzh-blue group-hover:underline">
                    {content.Titel}
                </h2>
                {content.Omschrijving.setInnerHTML ? (
                    <p
                        className="mt-2 line-clamp-4"
                        dangerouslySetInnerHTML={content.Omschrijving.content}
                    />
                ) : (
                    <p className="mt-2 italic">
                        Er is nog geen omschrijving voor deze
                        {' ' + titleSingular.toLowerCase()}
                    </p>
                )}
            </Link>
        </li>
    )
}

export default SearchResultItem
