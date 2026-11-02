import { Heading } from '@pzh-ui/components'

import { Link } from 'react-router-dom'

import { SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

interface SearchResultItem extends Omit<
    SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic,
    'object_id' | 'Score' | 'Object_Code'
> {
    query?: string
}

const SearchResultItem = ({
    object_type,
    model: _model,
    description,
    query,
}: SearchResultItem) => {
    const model = models[object_type as ModelType]

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

    const highlightedSentence = highlightString(description, query)
    const highlightedTitle = highlightString(_model.title, query)

    return (
        <li className="mb-6">
            <Link
                to={`/${model.defaults.slugOverview}/${model.defaults.plural}/${_model.id}`}
                className="group flex flex-col">
                <Heading
                    level="2"
                    size="m"
                    className="order-2 mb-2 group-hover:text-pzh-green-500">
                    <span
                        dangerouslySetInnerHTML={{ __html: highlightedTitle }}
                    />
                </Heading>
                <span className="order-1 text-s text-pzh-gray-600">
                    {model.defaults.singularCapitalize}
                </span>
                {!!description ? (
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
