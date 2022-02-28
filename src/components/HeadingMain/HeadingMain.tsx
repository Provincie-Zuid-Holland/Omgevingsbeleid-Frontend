import { faCubes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Displays a titel, status and modules.
 *
 * @param {string} titel - Containing a titel in string form.
 * @param {string} status - May contain the status "Vigerend" or "Gepubliceerd".
 * @param {array|undefined} modules - Contains the reference of modules the object is connected to
 */

interface HeadingMainProps {
    titel: string
    status?: string
    modules?: { Titel?: string; ID?: string | number }[]
    isHistory?: boolean
}

const HeadingMain = ({
    titel,
    status,
    modules,
    isHistory,
}: HeadingMainProps) => {
    const Heading = isHistory ? 'h2' : 'h1'

    return (
        <div className="relative">
            <Heading className="inline-block text-xl font-bold text-gray-800">
                <span className="mr-4">{titel}</span>
            </Heading>
            {status && <BadgeStatus status={status} />}
            {modules && <BadgesModules modules={modules} />}
        </div>
    )
}

/**
 *
 * @param {string} status - The status
 * @returns A component displaying the current status
 */
const BadgeStatus = ({ status }: Pick<HeadingMainProps, 'status'>) => {
    const isVigerend = status === 'Vigerend'

    return (
        <span
            className={`inline-block font-bold mr-2 my-1 px-2 pt-1 text-xs border rounded ${
                isVigerend
                    ? 'text-pzh-blue border-pzh-blue'
                    : 'text-pzh-yellow-dark border-pzh-yellow-dark'
            }`}>
            {status}
        </span>
    )
}

/**
 *
 * @param {array} modules - Contains an array containing the modules this object is connected to
 * @returns A badge containing the modules Title for all the modules it is connected to
 */
const BadgesModules = ({ modules }: Pick<HeadingMainProps, 'modules'>) => (
    <>
        {modules?.map(module => (
            <a
                key={module.Titel}
                href={`/muteer/beleidsmodules/${module.ID}`}
                target="_blank"
                rel="noreferrer"
                className={`inline-block font-bold mr-2 my-1 px-2 pt-1  text-xs border rounded text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white transition duration-100 ease-in`}>
                <FontAwesomeIcon className="mr-2" icon={faCubes} />
                {module.Titel}
            </a>
        ))}
    </>
)

export default HeadingMain
