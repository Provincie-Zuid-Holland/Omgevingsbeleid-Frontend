import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { format } from 'date-fns'
import isBefore from 'date-fns/is_before'
import nlLocale from 'date-fns/locale/nl'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import {
    faLink,
    faExternalLinkAlt,
    faEllipsisV,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import PopUpDetailDropdown from './../../../components/PopUpDetailDropdown'
import PopUpStatusAanpassen from './../../../components/PopUpStatusAanpassen'
import HeadingMain from './../../../components/HeadingMain'
import LoaderMainTitle from './../../../components/LoaderMainTitle'
import LoaderSmallSpan from './../../../components/LoaderSmallSpan'

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
                            <div className="absolute h-full left-0 bottom-0 pt-5 text-center">
                                <div className="inline-block bg-indigo-900 absolute top-0 right-0 mt-5 status-bolletje" />
                                <div className="h-full w-8 border-r-2 border-gray-400 inline-block" />
                            </div>
                        ) : (
                            <div className="absolute h-full left-0 bottom-0 text-center">
                                <div className="h-5 w-8 border-r-2 border-gray-400 inline-block h-5" />
                                <div className="inline-block bg-indigo-900 absolute top-0 right-0 mt-5 status-bolletje" />
                            </div>
                        )
                    ) : (
                        <div className="absolute h-full left-0 bottom-0 pt-5 text-center">
                            <div className="relative absolute top-0 right-0">
                                <div className="status-bolletje inline-block bg-yellow-600 right-0 absolute" />
                                <div className="pulserende-ring border-yellow-600 top-0 absolute border-2 rounded-full" />
                            </div>
                            <div className="h-full w-16 border-r-2 border-yellow-400 inline-block" />
                        </div>
                    )
                ) : null}

                <div className="ml-16 pl-4 w-full">
                    {this.props.children}

                    {titelEnkelvoud === 'Beleidsbeslissing' ? (
                        <div
                            onClick={this.toggleDropdown}
                            className="absolute right-0 top-0 hover:text-gray-800 text-gray-600 cursor-pointer p-5"
                        >
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={faEllipsisV}
                            />
                        </div>
                    ) : null}

                    {this.state.dropdown ? (
                        <PopUpDetailDropdown
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

                    <span className="text-gray-500 text-sm mb-1 block">
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
                            to={`/muteer/beleidsbeslissingen/edit/${this.props.match.params.single}`}
                            className="underline text-blue-700 mt-2 inline-block"
                        >
                            Bewerk Beleidsbeslissing
                        </Link>
                    ) : null}

                    {dataObject.Status === 'Vigerend' ||
                    dataObject.Status === 'Gepubliceerd' ? (
                        <div className="mt-8 flex">
                            <div className="flex justify-between items-center w-full mr-4 pr-4 border-r border-gray-300 py-2">
                                <div>
                                    <span className="block font-bold text-gray-700 text-sm">
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
                                                      'D MMMM YYYY',
                                                      { locale: nlLocale }
                                                  )
                                                : 'Er is nog geen begin geldigheid'}
                                        </span>
                                    ) : (
                                        <span className="mt-2 block">
                                            <LoaderSmallSpan />
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <FontAwesomeIcon
                                        className="text-gray-600 text-xl"
                                        icon={faCalendarAlt}
                                    />
                                </div>
                            </div>
                            {dataObject['Weblink'] ? (
                                <a
                                    href={`//${dataObject['Weblink']}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    id="href-idms-koppeling"
                                    className="flex justify-between items-center w-full mr-4 pr-4 border-r border-gray-300 py-2"
                                >
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
                                </a>
                            ) : null}
                            {titelEnkelvoud !== 'Beleidsrelatie' ? (
                                <a
                                    href={`/detail/${this.props.overzichtSlug}/${this.props.match.params.single}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex justify-between items-center w-full py-2 cursor-pointer"
                                >
                                    <div>
                                        <div>
                                            <span className="block font-bold text-gray-700 text-sm">
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
                                            className="text-gray-600 text-xl"
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
