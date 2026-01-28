import { Heading } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { ValidSearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

interface SearchResultItem
    extends Omit<
        ValidSearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic,
        'Object_ID' | 'Score' | 'Object_Code'
    > {
    query?: string
}

const SearchResultItem = ({
    Object_Type,
    Model,
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
    const highlightedTitle = highlightString(Model.Title, query)

    return (
        <li className="mb-6">
            <Link
                to={`/${model.defaults.slugOverview}/${model.defaults.plural}/${Model.UUID}`}
                className="group flex flex-col">
                <Heading
                    level="2"
                    size="m"
                    className="group-hover:text-pzh-green-500 order-2 mb-2">
                    <span
                        dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />
                </Heading>
                <span className="text-s text-pzh-gray-600 order-1">
                    {model.defaults.singularCapitalize}
                </span>
                {!!Description ? (
                    <p
                        className="order-3 line-clamp-3"
                        dangerouslySetInnerHTML={{
                            __html: highlightedSentence,
                        }}
                    />
                ) : (
                    <span className="order-3 italic">
                        Geen voorbeeld beschikbaar
                    </span>
                )}
            </Link>
        </li>
    )
}

export default SearchResultItem
