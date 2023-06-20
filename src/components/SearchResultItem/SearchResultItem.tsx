import { FC } from 'react'
import { Link } from 'react-router-dom'

import { GeoSearchResult } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useSearchParam from '@/hooks/useSearchParam'

interface SearchResultItem {
    item: GeoSearchResult
    searchQuery: any
}

const SearchResultItem: FC<SearchResultItem> = ({ item, searchQuery }) => {
    const { get } = useSearchParam()
    const [paramTextQuery] = get('query')

    const truncateTextWithEllipsis = (text: string, characters = 260) => {
        if (text.length > characters) {
            return text.substring(0, characters) + '...'
        }
        return text
    }

    const highlightString = (
        text: string | undefined,
        query: string | null
    ) => {
        if (!text) {
            return null
        } else if (!query) {
            return text
        }

        const wordsInQuery = query.split(' ').filter(word => word.length >= 4)
        const markedText = wordsInQuery.reduce((acc, word) => {
            const regex = new RegExp(word, 'gi')
            return acc.replace(
                regex,
                `<mark class="marked-red" data-testid="marker">$&</mark>`
            )
        }, text)

        return markedText
    }

    const content = {
        Titel: paramTextQuery
            ? highlightString(item.Titel, paramTextQuery.toString())
            : item.Titel || '',
        Omschrijving: paramTextQuery
            ? highlightString(
                  truncateTextWithEllipsis(item.Omschrijving || ''),
                  paramTextQuery.toString()
              )
            : truncateTextWithEllipsis(item.Omschrijving || ''),
    }

    const type = item.Type
    if (!type) return null

    const model = models[type as ModelType]

    return (
        <li
            className={`py-4 md:pr-8 transition-colors duration-100 ease-in bg-white border-gray-300 group`}
            key={item.UUID}>
            <Link
                className="group"
                to={`/${model.defaults.slugOverview}/${item.UUID}${
                    searchQuery ? `#${searchQuery}` : ''
                }`}>
                <span
                    className="block text-sm opacity-75 text-pzh-blue"
                    data-test="search-result-type">
                    {model.defaults.singularReadable}
                </span>
                {content.Titel ? (
                    <h2
                        className="block mt-1 text-lg font-bold group-hover:text-pzh-green text-pzh-blue group-hover:underline"
                        dangerouslySetInnerHTML={{ __html: content.Titel }}
                    />
                ) : null}
                {content.Omschrijving ? (
                    <p
                        className="mt-2"
                        dangerouslySetInnerHTML={{
                            __html: content.Omschrijving,
                        }}
                    />
                ) : (
                    <p className="mt-2 italic">
                        Er is nog geen omschrijving voor deze
                        {' ' + model.defaults.singularReadable}
                    </p>
                )}
            </Link>
        </li>
    )
}

export default SearchResultItem
