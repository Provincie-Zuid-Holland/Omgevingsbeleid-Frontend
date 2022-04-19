import { Link } from 'react-router-dom'

/**
 * Displays a button link, which the user can add a new object.
 *
 * @param {string} createNewSlug - Portion of the url referring to the newly created object .
 * @param {string} hoofdOnderdeelSlug - Portion of the url and id referring to the hoofdOnderdeel.
 * @param {string} titleSingular - Contains the title in singular form, which is used for the button.
 */

interface ButtonAddNewObjectProps {
    createNewSlug: string
    hoofdOnderdeelSlug: string
    titleSingular: string
}

function ButtonAddNewObject({
    createNewSlug,
    hoofdOnderdeelSlug,
    titleSingular,
}: ButtonAddNewObjectProps) {
    return (
        <div className={`mb-6 display-inline display-inline w-full`}>
            <Link
                id={`object-add-new-${hoofdOnderdeelSlug.toLowerCase()}`}
                className="flex items-center justify-center h-full px-4 py-4 overflow-hidden text-gray-600 no-underline border border-gray-300 border-dashed rounded hover:border-gray-400 transition-regular hover:text-gray-800"
                to={`/muteer/${hoofdOnderdeelSlug}/${createNewSlug}`}>
                <span className="px-4 py-2 font-bold text-center">
                    + Voeg {titleSingular} Toe
                </span>
            </Link>
        </div>
    )
}

export default ButtonAddNewObject
