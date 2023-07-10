import { Heading } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

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

    const highlightString = (
        text: string | undefined,
        query?: string | null
    ) => {
        if (!text) {
            return ''
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

    const highlightedSentence = highlightString(Description, query)
    const highlightedTitle = highlightString(Title, query)

    return (
        <li className="mb-6">
            <Link
                to={`/${model.defaults.slugOverview}/${UUID}`}
                className="group">
                <span className="text-pzh-gray-600">
                    {model.defaults.singularCapitalize}
                </span>
                <Heading level="3" className="mb-2 group-hover:text-pzh-green">
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
