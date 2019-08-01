import React, { Component } from 'react'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

// Import UI Components
import EditButton from './../UI/ApiView/EditButton'
import MainTitel from './../UI/ApiView/MainTitel'
import StatusLabel from './../StatusLabel'

// Import Icons
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faLink, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Main Component - Main Container
class DetailMain extends Component {
    render() {
        const dataObject = this.props.dataObject
        const titelEnkelvoud = this.props.titelEnkelvoud
        const pageType = this.props.pageType
        const overzichtSlug = this.props.overzichtSlug
        const objectID = dataObject.ID
        const titel = dataObject.Titel

        return (
            <div
                className={`relative inline-block w-full px-6 py-5 shadow-md rounded overflow-hidden bg-white -mb-2 ${
                    pageType === 'version' ? 'mt-6' : null
                }`}
            >
                <span className="text-gray-500 text-sm mb-1 block">
                    {titelEnkelvoud}
                </span>

                <MainTitel titel={titel} />
                {pageType === 'detail' ? <StatusLabel /> : null}

                <div className="mt-8 flex">
                    <div className="flex justify-between items-center w-1/3 mr-4 pr-4 border-r border-gray-300 py-2">
                        <div>
                            <span className="block font-bold text-gray-700 text-sm">
                                Vigerend sinds
                            </span>
                            <span className="text-sm text-gray-700">
                                {format(
                                    new Date(dataObject['Begin_Geldigheid']),
                                    'D MMMM YYYY',
                                    { locale: nlLocale }
                                )}
                                {/* 24 juni 2017 */}
                            </span>
                        </div>
                        <div>
                            <FontAwesomeIcon
                                className="text-gray-600 text-xl"
                                icon={faCalendarAlt}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-1/3 mr-4 pr-4 border-r border-gray-300 py-2">
                        <div>
                            <span className="block font-bold text-gray-700 text-sm">
                                IDMS-koppeling
                            </span>
                            <span className="text-sm text-gray-700">
                                Bekijk document
                            </span>
                        </div>
                        <div>
                            <FontAwesomeIcon
                                className="text-gray-600 text-xl"
                                icon={faLink}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-1/3 py-2 cursor-pointer">
                        <div>
                            <span className="block font-bold text-gray-700 text-sm">
                                Link naar raadpleegomgeving
                            </span>
                            <span className="text-sm text-gray-700">
                                Bekijk {titelEnkelvoud.toLowerCase()}
                            </span>
                        </div>
                        <div>
                            <FontAwesomeIcon
                                className="text-gray-600 text-xl"
                                icon={faExternalLinkAlt}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DetailMain
