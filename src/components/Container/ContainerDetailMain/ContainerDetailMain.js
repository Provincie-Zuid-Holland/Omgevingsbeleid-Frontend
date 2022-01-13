import { faCalendarAlt } from '@fortawesome/pro-regular-svg-icons'
import { faLink, faExternalLinkAlt } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router-dom'

// Import Components
import HeadingMain from '../../HeadingMain'
import { LoaderMainTitle, LoaderSmallSpan } from '../../Loader'
// Import Utilities
import getVigerendText from './../../../utils/getVigerendText'

/**
 * Displays main details in a container.
 *
 * @param {object} dataObject - Contains data in object form.
 * @param {string} titleSingular - Title of the object in a singular form
 * @param {boolean} dataReceived - Parameter that is set to true if it contains data.
 * @param {string} overzichtSlug - Portion of the url referring to the overzicht.
 */
const ContainerDetailMain = ({
    dataObject,
    titleSingular,
    dataReceived,
    overzichtSlug,
}) => {
    const validDate = getVigerendText({ dataObject })
    const validDatePrefix = getVigerendText({
        dataObject,
        prefixOnly: true,
    })

    return (
        <div
            className={`relative inline-block w-full px-6 py-5 shadow-md rounded bg-white -mb-2`}>
            <span className="block mb-1 text-sm text-gray-500">
                {titleSingular}
            </span>

            {dataReceived ? (
                <HeadingMain titel={dataObject.Titel} />
            ) : (
                <LoaderMainTitle />
            )}

            <div className="flex mt-8">
                <ContainerDetailMainDate
                    dataReceived={dataReceived}
                    validDatePrefix={validDatePrefix}
                    validDate={validDate}
                />
                <ContainerDetailMainWeblink weblink={dataObject['Weblink']} />
                <ContainerDetailMainRaadpleegLink
                    titleSingular={titleSingular}
                    overzichtSlug={overzichtSlug}
                    dataObject={dataObject}
                    dataReceived={dataReceived}
                />
            </div>
        </div>
    )
}

/**
 * Displays a container containing the main raadpleeglink.
 *
 * @param {string} titleSingular - Title of the object in a singular form
 * @param {object} dataObject - Parameter that is set to true if it contains data.
 * @param {string} overzichtSlug - Portion of the url referring to the overzicht.
 * @param {boolean} dataReceived - Parameter that is set to true if it contains data.
 */
const ContainerDetailMainRaadpleegLink = ({
    titleSingular,
    dataObject,
    overzichtSlug,
    dataReceived,
}) => {
    if (!dataObject) return null

    const raadpleegLink = dataReceived
        ? `/detail/${overzichtSlug}/${dataObject.UUID}`
        : '#'

    return (
        <a
            href={raadpleegLink}
            onClick={e => (!dataReceived ? e.preventDefault() : null)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between w-full py-2 pl-4 hover:bg-gray-50 pzh-transition-colors ${
                dataReceived ? 'cursor-pointer' : ''
            }`}>
            <div>
                <div>
                    <span className="block text-sm font-bold text-gray-700">
                        Link naar raadpleegomgeving
                    </span>
                    <span className="text-sm text-gray-700">
                        {dataReceived ? (
                            `Bekijk ${titleSingular.toLowerCase()}`
                        ) : (
                            <LoaderMainTitle />
                        )}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-center">
                <FontAwesomeIcon
                    className="mr-4 text-lg text-gray-600"
                    icon={faExternalLinkAlt}
                />
            </div>
        </a>
    )
}

/**
 * Displays a container containing a main date
 *
 * @param {boolean} dataReceived - Contains a boolean state if data has been received.
 * @param {string} validDatePrefix - Contains a prefix for valid date.
 * @param {date} validDate - Contains a valid date.
 */
const ContainerDetailMainDate = ({
    dataReceived,
    validDatePrefix,
    validDate,
}) => {
    return (
        <div className="flex items-center justify-between w-full py-2 pr-4 border-r border-gray-300">
            <div>
                <span className="block text-sm font-bold text-gray-700">
                    {dataReceived && validDatePrefix}
                </span>
                {dataReceived ? (
                    <span className="text-sm text-gray-700">{validDate}</span>
                ) : (
                    <span className="block mt-2">
                        <LoaderSmallSpan />
                    </span>
                )}
            </div>
            <div className="flex items-center justify-center">
                <FontAwesomeIcon
                    className="text-xl text-gray-600"
                    icon={faCalendarAlt}
                />
            </div>
        </div>
    )
}

/**
 * Displays a link in which the user can click on to see a certain document.
 *
 * @param {string} weblink - Contains the URL destination.
 */
const ContainerDetailMainWeblink = ({ weblink }) => {
    if (!weblink) return null

    return (
        <a
            href={weblink}
            target="_blank"
            rel="noopener noreferrer"
            id="href-idms-koppeling"
            className="flex items-center justify-between w-full px-4 py-2 border-r border-gray-300 hover:bg-gray-50 pzh-transition-colors">
            <div>
                <span className="block text-sm font-bold text-gray-700">
                    IDMS-koppeling
                </span>
                <span className="text-sm text-gray-700">Bekijk document</span>
            </div>
            <div className="flex items-center justify-center">
                <FontAwesomeIcon
                    className="text-lg text-gray-600"
                    icon={faLink}
                />
            </div>
        </a>
    )
}

export default withRouter(ContainerDetailMain)
