import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { format } from 'date-fns'
import isBefore from 'date-fns/isBefore'
import nlLocale from 'date-fns/locale/nl'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import {
    faLink,
    faExternalLinkAlt,
    faEllipsisV,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import PopUpStatusAanpassen from './../../../components/PopUpStatusAanpassen'
import HeadingMain from './../../../components/HeadingMain'
import LoaderMainTitle from './../../../components/LoaderMainTitle'
import LoaderSmallSpan from './../../../components/LoaderSmallSpan'
import PopUpDetailDropdown from './../PopUpDetailDropdown'

// Main Component - Main Container
class ContainerDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dropdown: false,
            statusPopup: false,
        }
        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.toggleStatusPopup = this.toggleStatusPopup.bind(this)
    }

    toggleDropdown() {
        this.setState({
            dropdown: !this.state.dropdown,
        })
    }

    toggleStatusPopup() {
        this.setState({
            statusPopup: !this.state.statusPopup,
        })
    }

    render() {
        const dataObject = this.props.dataObject
        const titelEnkelvoud = this.props.titelEnkelvoud
        const pageType = this.props.pageType
        const dataReceived = this.props.dataReceived
        const dimensieHistorie = this.props.dimensieHistorie

        return (
            <div
                className={`relative flex w-full px-5 py-5 shadow-md rounded bg-white 
                ${pageType === 'version' ? 'mt-6' : ''}
                `}
            >
                {/* Verticale lijn + bolletje */}
                {dataReceived ? (
                    dataObject.Status === 'Vigerend' ||
                    dataObject.Status === 'Gepubliceerd' ? (
                        dimensieHistorie[0] && dataObject ? (
                            <div className="absolute bottom-0 left-0 h-full pt-5 text-center">
                                <div className="absolute top-0 right-0 inline-block mt-5 bg-indigo-900 status-bolletje" />
                                <div className="inline-block w-8 h-full border-r-2 border-gray-400" />
                            </div>
                        ) : (
                            <div className="absolute bottom-0 left-0 h-full text-center">
                                <div className="inline-block w-8 h-5 border-r-2 border-gray-400" />
                                <div className="absolute top-0 right-0 inline-block mt-5 bg-indigo-900 status-bolletje" />
                            </div>
                        )
                    ) : (
                        <div className="absolute bottom-0 left-0 h-full pt-5 text-center">
                            <div className="absolute relative top-0 right-0">
                                <div className="absolute right-0 z-10 inline-block bg-secondary status-bolletje" />
                                <div className="absolute top-0 border-2 rounded-full border-secondary pulserende-ring" />
                            </div>
                            <div className="relative inline-block w-16 h-full border-r-2 opacity-25 border-secondary ml-min-2px" />
                        </div>
                    )
                ) : null}

                <div className="w-full pl-4 ml-16">
                    {this.props.children}

                    {titelEnkelvoud === 'Beleidsbeslissing' ? (
                        <div
                            onClick={this.toggleDropdown}
                            className="absolute top-0 right-0 p-5 text-gray-600 cursor-pointer hover:text-gray-800"
                        >
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={faEllipsisV}
                            />
                        </div>
                    ) : null}

                    {this.state.dropdown ? (
                        <PopUpDetailDropdown
                            raadpleegLink={`/detail/${this.props.overzichtSlug}/${dataObject.UUID}`}
                            dataObject={dataObject}
                            toggleDropdown={this.toggleDropdown}
                            openState={this.state.dropdown}
                            toggleStatusPopup={this.toggleStatusPopup}
                        />
                    ) : null}

                    {this.state.statusPopup ? (
                        <PopUpStatusAanpassen
                            dataObject={dataObject}
                            status={dataObject.Status}
                            patchStatus={this.props.patchStatus}
                            toggleStatusPopup={this.toggleStatusPopup}
                        />
                    ) : null}

                    <span className="block mb-1 text-sm text-gray-500">
                        {titelEnkelvoud}
                    </span>

                    {dataReceived ? (
                        <HeadingMain
                            titel={dataObject.Titel}
                            status={dataObject.Status}
                        />
                    ) : (
                        <LoaderMainTitle />
                    )}

                    {dataObject.Status !== 'Vigerend' &&
                    dataObject.Status !== 'Gepubliceerd' &&
                    dataObject.Status !== 'Ontwerp in inspraak' &&
                    dataObject.Status !== 'Vastgesteld' ? (
                        <Link
                            to={`/muteer/beleidskeuzes/edit/${
                                this.props.match.params.single
                            }${
                                this.props.location.hash === '#mijn-beleid'
                                    ? '#mijn-beleid'
                                    : ''
                            }`}
                            className="inline-block mt-2 text-blue-700 underline"
                        >
                            Bewerk Beleidskeuze
                        </Link>
                    ) : null}

                    {dataObject.Status === 'Vigerend' ||
                    dataObject.Status === 'Gepubliceerd' ? (
                        <div className="flex mt-8">
                            <div className="flex items-center justify-between w-full py-2 pr-4 mr-4 border-r border-gray-300">
                                <div>
                                    <span className="block text-sm font-bold text-gray-700">
                                        {/* isBefore */}
                                        {dataReceived &&
                                        dataObject['Begin_Geldigheid'] !==
                                            null &&
                                        isBefore(
                                            dataObject['Begin_Geldigheid'],
                                            new Date()
                                        )
                                            ? 'Vigerend sinds'
                                            : 'Vigerend vanaf'}
                                    </span>
                                    {dataReceived ? (
                                        <span className="text-sm text-gray-700">
                                            {dataObject['Begin_Geldigheid'] !==
                                            null
                                                ? format(
                                                      new Date(
                                                          dataObject[
                                                              'Begin_Geldigheid'
                                                          ]
                                                      ),
                                                      'd MMMM yyyy',
                                                      { locale: nlLocale }
                                                  )
                                                : 'Er is nog geen begin geldigheid'}
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
                                    className="flex items-center justify-between w-full py-2 pr-4 mr-4 border-r border-gray-300"
                                >
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
                                            className="text-xl text-gray-600"
                                            icon={faLink}
                                        />
                                    </div>
                                </a>
                            ) : null}
                            {titelEnkelvoud !== 'Beleidsrelatie' ? (
                                <a
                                    href={`/detail/${this.props.overzichtSlug}/${dataObject.UUID}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full py-2 cursor-pointer"
                                >
                                    <div>
                                        <div>
                                            <span className="block text-sm font-bold text-gray-700">
                                                Link naar raadpleegomgeving
                                            </span>
                                            <span className="text-sm text-gray-700">
                                                {dataReceived ? (
                                                    `Bekijk ${titelEnkelvoud.toLowerCase()}`
                                                ) : (
                                                    <LoaderMainTitle />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <FontAwesomeIcon
                                            className="text-xl text-gray-600"
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
}

export default withRouter(ContainerDetail)
