import { faCalendarAlt } from '@fortawesome/pro-regular-svg-icons'
import {
    faLink,
    faExternalLinkAlt,
    faEllipsisV,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useState } from 'react'
import {
    withRouter,
    Link,
    RouteComponentProps,
    useLocation,
    useParams,
} from 'react-router-dom'

import { BeleidskeuzesRead } from '@/api/fetchers.schemas'
import HeadingMain from '@/components/HeadingMain'
import { LoaderMainTitle, LoaderSmallSpan } from '@/components/Loader'
import { PopUpModules, PopUpStatusAanpassen } from '@/components/Popup'
import getVigerendText from '@/utils/getVigerendText'

import PopUpDetailDropdown from '../PopUpDetailDropdown'

/**
 * Returns a Container component for a policy object detail page
 */

interface ContainerDetailProps extends RouteComponentProps {
    dataObject: BeleidskeuzesRead
    setDataObject?: (dataObject: BeleidskeuzesRead) => void
    patchStatus: (dataObject: BeleidskeuzesRead, value: string) => void
    titleSingular: string
    pageType: string
    overzichtSlug: string
    isLoading?: boolean
    dimensionHistory: BeleidskeuzesRead[]
    setDimensionHistory: (dimensionHistory: BeleidskeuzesRead[]) => void
}

const ContainerDetail: FC<ContainerDetailProps> = ({
    children,
    dataObject,
    setDataObject,
    patchStatus,
    titleSingular,
    pageType,
    overzichtSlug,
    isLoading,
    dimensionHistory,
    setDimensionHistory,
}) => {
    const location = useLocation()
    const { single } = useParams<{ single: string }>()

    const [dropdown, setDropdown] = useState(false)
    const [statusPopup, setStatusPopup] = useState(false)
    const [modulesPopup, setModulesPopup] = useState(false)

    const validDate = getVigerendText({ dataObject })
    const validDatePrefix = getVigerendText({
        dataObject,
        prefixOnly: true,
    })

    return (
        <div
            className={`relative flex w-full py-5 shadow-md rounded bg-white 
                ${pageType === 'version' ? 'mt-6' : ''}
                ${
                    dataObject.Status === 'Vigerend' ||
                    dataObject.Status === 'Gepubliceerd'
                        ? 'px-5'
                        : 'pl-16 pr-5'
                }
                `}>
            {/* Verticale lijn + bolletje */}
            {!isLoading && dataObject ? (
                dataObject.Status === 'Vigerend' ||
                dataObject.Status === 'Gepubliceerd' ? (
                    dimensionHistory[0] && dataObject ? (
                        <div className="absolute bottom-0 left-0 h-full pt-5 text-center">
                            <div className="absolute top-0 right-0 inline-block mt-5 bg-pzh-blue status-bolletje" />
                            <div className="inline-block w-8 h-full border-r-2 border-gray-400" />
                        </div>
                    ) : (
                        <div className="absolute bottom-0 left-0 h-full text-center">
                            <div className="inline-block w-8 h-5 border-r-2 border-gray-400" />
                            <div className="absolute top-0 right-0 inline-block mt-5 bg-pzh-blue status-bolletje" />
                        </div>
                    )
                ) : (
                    <div className="absolute bottom-0 left-0 h-full pt-5 text-center yellow-line-container">
                        <div className="relative top-0 right-0">
                            <div className="absolute right-0 z-10 inline-block bg-pzh-yellow-dark status-bolletje" />
                            <div className="absolute top-0 border-2 rounded-full border-pzh-yellow-dark pulserende-ring" />
                        </div>
                        <div className="relative inline-block w-16 h-full border-r-2 opacity-25 border-pzh-yellow-dark" />
                    </div>
                )
            ) : null}

            <div className="w-full pl-4 ml-5">
                {children}

                <div
                    onClick={() => setDropdown(!dropdown)}
                    className="absolute top-0 right-0 p-5 text-gray-600 cursor-pointer hover:text-gray-800"
                    id="container-detail-dropdown-dots">
                    <FontAwesomeIcon className="mr-2" icon={faEllipsisV} />
                </div>

                {dropdown ? (
                    <PopUpDetailDropdown
                        dimensionHistory={dimensionHistory}
                        setDimensionHistory={setDimensionHistory}
                        slug={overzichtSlug}
                        titleSingular={titleSingular}
                        raadpleegLink={`/detail/${overzichtSlug}/${dataObject.UUID}`}
                        dataObject={dataObject}
                        setDataObject={setDataObject}
                        openState={dropdown}
                        toggleDropdown={() => setDropdown(!dropdown)}
                        toggleStatusPopup={() => setStatusPopup(!statusPopup)}
                        toggleModulesPopup={() =>
                            setModulesPopup(!modulesPopup)
                        }
                    />
                ) : null}

                {statusPopup ? (
                    <PopUpStatusAanpassen
                        dataObject={dataObject}
                        status={dataObject.Status!}
                        patchStatus={patchStatus}
                        toggleStatusPopup={() => setStatusPopup(!statusPopup)}
                    />
                ) : null}
                {modulesPopup ? (
                    <PopUpModules
                        dimensionHistory={dimensionHistory}
                        setDimensionHistory={setDimensionHistory}
                        setDataObject={setDataObject}
                        titleSingular={titleSingular}
                        dataObject={dataObject}
                        toggleModulesPopup={() =>
                            setModulesPopup(!modulesPopup)
                        }
                    />
                ) : null}

                <span className="block mb-1 text-sm text-gray-500">
                    {titleSingular}
                </span>

                {!isLoading ? (
                    <HeadingMain
                        titel={dataObject.Titel || ''}
                        status={dataObject.Status}
                        modules={dataObject.Ref_Beleidsmodules}
                    />
                ) : (
                    <LoaderMainTitle />
                )}

                {dataObject.Status !== 'Vigerend' &&
                dataObject.Status !== 'Gepubliceerd' &&
                dataObject.Status !== 'Ontwerp in inspraak' &&
                dataObject.Status !== 'Vastgesteld' ? (
                    <Link
                        to={`/muteer/${overzichtSlug}/edit/${single}${
                            location.hash === '#mijn-beleid'
                                ? '#mijn-beleid'
                                : ''
                        }`}
                        className="inline-block mt-2 underline text-pzh-blue hover:text-pzh-blue-dark pzh-transition-colors">
                        Bewerk {titleSingular}
                    </Link>
                ) : null}

                {dataObject.Status === 'Vigerend' ||
                dataObject.Status === 'Gepubliceerd' ? (
                    <div className="flex mt-8">
                        <div className="flex items-center justify-between w-full py-2 pr-4 border-r border-gray-300">
                            <div>
                                <span className="block text-sm font-bold text-gray-700">
                                    {!isLoading && validDatePrefix}
                                </span>
                                {!isLoading ? (
                                    <span className="text-sm text-gray-700">
                                        {validDate}
                                    </span>
                                ) : (
                                    <span className="block mt-2">
                                        <LoaderSmallSpan />
                                    </span>
                                )}
                            </div>
                            <div>
                                <FontAwesomeIcon
                                    className="text-xl text-gray-600"
                                    icon={faCalendarAlt}
                                />
                            </div>
                        </div>
                        {dataObject['Weblink'] ? (
                            <a
                                href={dataObject['Weblink']}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="href-idms-koppeling"
                                className="flex items-center justify-between w-full px-4 py-2 border-r border-gray-300 hover:bg-gray-50 pzh-transition-colors">
                                <div>
                                    <span className="block text-sm font-bold text-gray-700">
                                        IDMS-koppeling
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        Bekijk document
                                    </span>
                                </div>
                                <div>
                                    <FontAwesomeIcon
                                        className="text-lg text-gray-600"
                                        icon={faLink}
                                    />
                                </div>
                            </a>
                        ) : null}
                        {titleSingular !== 'Beleidsrelatie' ? (
                            <a
                                href={`/detail/${overzichtSlug}/${dataObject.UUID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full py-2 pl-4 rounded-r cursor-pointer hover:bg-gray-50 pzh-transition-colors">
                                <div>
                                    <div>
                                        <span className="block text-sm font-bold text-gray-700">
                                            Link naar raadpleegomgeving
                                        </span>
                                        <span className="text-sm text-gray-700">
                                            {!isLoading ? (
                                                `Bekijk ${titleSingular.toLowerCase()}`
                                            ) : (
                                                <LoaderMainTitle />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <FontAwesomeIcon
                                        className="mr-4 text-lg text-gray-600"
                                        icon={faExternalLinkAlt}
                                    />
                                </div>
                            </a>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default withRouter(ContainerDetail)
