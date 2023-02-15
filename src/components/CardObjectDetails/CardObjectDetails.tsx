import { AngleRight } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

/**
 * @param {Object} object - The object we want to display
 * @param {string} titleSingular - Singular title of object type
 * @param {string} hoofdOnderdeelSlug - Slug for the overview of the type
 * @returns A component that displays the type and title on an object and links to its detail ID page
 */

interface CardObjectDetailsProps {
    object: {
        ID?: string | number
        Titel?: string
    }
    titleSingular: string
    hoofdOnderdeelSlug: string
}

function CardObjectDetails({
    object,
    titleSingular,
    hoofdOnderdeelSlug,
}: CardObjectDetailsProps) {
    const hasDetail =
        hoofdOnderdeelSlug === 'maatregelen' ||
        hoofdOnderdeelSlug === 'beleidskeuzes' ||
        hoofdOnderdeelSlug === 'verordeningen'

    const detailPageLink = `/muteer/${hoofdOnderdeelSlug}/${object.ID}/${
        !hasDetail ? 'bewerk' : ''
    }#mijn-beleid`

    return (
        <Link
            className="relative inline-block w-full h-full px-4 pt-4 pb-6 overflow-hidden bg-white rounded shadow-md"
            to={detailPageLink}>
            <span
                className="block py-1 text-sm font-bold text-gray-600"
                data-testid="card-object-title">
                {titleSingular}
            </span>
            <h2 className="pr-8 text-xl font-bold text-gray-800 line-clamp-2">
                {object.Titel}
            </h2>
            <span className="absolute bottom-0 right-0 object-left-top w-8 h-10 font-bold text-gray-400">
                <AngleRight size={24} />
            </span>
        </Link>
    )
}

export default CardObjectDetails
