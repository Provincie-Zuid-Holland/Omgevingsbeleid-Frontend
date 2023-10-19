import { Link } from 'react-router-dom'

import { Heading } from '@pzh-ui/components'

import { ValidSearchObject } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

interface SearchResultItem
    extends Omit<ValidSearchObject, 'Object_ID' | 'Score'> {
    query?: string
}

const SearchResultItem = ({
    Title,
    Object_Type,
    UUID,
    Description,
    query,
}: SearchResultItem) => {
    const model = models[Object_Type as ModelType]

    const highlightString = (text?: string, query?: string | null) => {
        if (!text) {
            return ''
        } else if (!query) {
            return text
        }

        // Filter and escape query words to be used in regex
        const wordsInQuery = query
            .split(' ')
            .filter(word => word.length >= 4)
            .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

        if (wordsInQuery.length === 0) {
            return text
        }

        // Create a regex pattern for all the words in the query
        const pattern = new RegExp(wordsInQuery.join('|'), 'gi')
        const markedText = text.replace(
            pattern,
            `<mark class="marked-red" data-testid="marker">$&</mark>`
        )

        return markedText
    }

    const highlightedSentence = highlightString(Description, query)
    const highlightedTitle = highlightString(Title, query)

    return (
        <li className="mb-6">
            <Link
                to={`/${model.defaults.slugOverview}/${model.defaults.plural}/${UUID}`}
                className="group">
                <span className="text-s text-pzh-gray-600">
                    {model.defaults.singularCapitalize}
                </span>
                <Heading
                    level="3"
                    size="m"
                    className="mb-2 group-hover:text-pzh-green">
                    <span
                        dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />
                </Heading>
                {!!Description ? (
                    <p
                        className="line-clamp-3"
                        dangerouslySetInnerHTML={{
                            __html: highlightedSentence,
                        }}
                    />
                ) : (
                    <span className="italic">Geen voorbeeld beschikbaar</span>
                )}
            </Link>
        </li>
    )
}

export default SearchResultItem
