import { faAngleRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import Tippy from '@tippyjs/react'
import { Link } from 'react-router-dom'
import 'tippy.js/dist/tippy.css'

/**
 * @param {Object} object - The object we want to display
 * @param {string} titleSingular - Singular title of object type
 * @param {string} hoofdOnderdeelSlug - Slug for the overview of the type
 * @param {undefined|number} index - Can contain an index if the Component is used in a .map()
 * @param {boolean} mijnBeleid - If true add hash to the detailPageLink
 * @returns A component that displays the type and title on an object and links to its detail ID page
 */

interface CardObjectDetailsProps {
    object: {
        ID?: string | number
        Titel?: string
    }
    titleSingular: string
    hoofdOnderdeelSlug: string
    index?: number
    mijnBeleid?: boolean
    showTippy?: boolean
}

function CardObjectDetails({
    object,
    titleSingular,
    hoofdOnderdeelSlug,
    index,
    mijnBeleid,
    showTippy,
}: CardObjectDetailsProps) {
    const elementID =
        index === 0 || index
            ? `object-card-${titleSingular.toLowerCase()}-${index}`
            : `object-card-${titleSingular.toLowerCase()}`

    const hasDetail =
        hoofdOnderdeelSlug === 'maatregelen' ||
        hoofdOnderdeelSlug === 'beleidskeuzes'

    const detailPageLink = `/muteer/${hoofdOnderdeelSlug}/${object.ID}/${
        !hasDetail ? 'bewerk' : ''
    }${mijnBeleid ? '#mijn-beleid' : ''}`

    const charactersInTitle = object.Titel?.length || 0
    const disableTippy = !showTippy || charactersInTitle < 61

    return (
        <Transition
            show
            enter="transition ease-out duration-150 transform"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-0 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
            className="w-full h-full">
            <Tippy disabled={disableTippy} content={object.Titel}>
                <Link
                    className={`relative h-full w-full inline-block px-4 pt-4 pb-6 overflow-hidden bg-white rounded shadow-md`}
                    to={detailPageLink}
                    id={elementID}>
                    <span
                        className="block py-1 text-sm text-gray-600 font-bold"
                        data-testid="card-object-title">
                        {titleSingular}
                    </span>
                    <h2 className="pr-8 text-xl font-bold text-gray-800 line-clamp-2">
                        {object.Titel}
                    </h2>
                    <span className="absolute bottom-0 right-0 object-left-top w-8 h-10 font-bold text-gray-400">
                        <FontAwesomeIcon
                            className="text-2xl"
                            icon={faAngleRight}
                        />
                    </span>
                </Link>
            </Tippy>
        </Transition>
    )
}

export default CardObjectDetails
