import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
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
import PopUpDetailDropdown from '../PopUpDetailDropdown'
import PopUpStatusAanpassen from '../PopUpStatusAanpassen'
import HeadingMain from '../HeadingMain'
import LoaderMainTitle from '../LoaderMainTitle'
import LoaderSmallSpan from '../LoaderSmallSpan'

function StatusLabel(props) {
    return (
        <span className="inline px-3 py-3 ml-3 text-sm font-bold bg-blue-100 rounded-full m-color">
            Vigerend
        </span>
    )
}

// Main Component - Main Container
class ContainerDetailMain extends Component {
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
        const titel = dataObject.Titel
        const dataReceived = this.props.dataReceived

        return (
            <div
                className={`relative inline-block w-full px-6 py-5 shadow-md rounded bg-white -mb-2 ${
                    pageType === 'version' ? 'mt-6' : ''
                }`}
            >
                {this.props.children}
                {titelEnkelvoud === 'Beleidsbeslissing' ? (
                    <div
                        onClick={this.toggleDropdown}
                        className="absolute top-0 right-0 p-5 text-gray-600 cursor-pointer hover:text-gray-800"
                    >
                        <FontAwesomeIcon className="mr-2" icon={faEllipsisV} />
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
                        // toggleDropdown={this.toggleDropdown}
                        // openState={this.state.dropdown}
                        toggleStatusPopup={this.toggleStatusPopup}
                    />
                ) : null}

                <span className="block mb-1 text-sm text-gray-500">
                    {titelEnkelvoud}
                </span>

                {dataReceived ? (
                    <HeadingMain titel={titel} />
                ) : (
                    <LoaderMainTitle />
                )}

                {pageType === 'detail' && titelEnkelvoud === 'beleidskeuze' ? (
                    <StatusLabel />
                ) : null}

                <div className="flex mt-8">
                    <div className="flex items-center justify-between w-full py-2 pr-4 mr-4 border-r border-gray-300">
                        <div>
                            <span className="block text-sm font-bold text-gray-700">
                                {/* isBefore */}
                                {dataReceived &&
                                dataObject['Begin_Geldigheid'] !== null &&
                                isBefore(
                                    dataObject['Begin_Geldigheid'],
                                    new Date()
                                )
                                    ? 'Vigerend sinds'
                                    : 'Vigerend vanaf'}
                            </span>
                            {dataReceived ? (
                                <span className="text-sm text-gray-700">
                                    {dataObject['Begin_Geldigheid'] !== null
                                        ? format(
                                              new Date(
                                                  dataObject['Begin_Geldigheid']
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
                            href={
                                titelEnkelvoud === 'Artikel' ||
                                titelEnkelvoud === 'Paragraaf' ||
                                titelEnkelvoud === 'Afdeling'
                                    ? `/detail/verordeningen/${
                                          this.props.lineageID
                                      }/${this.props.dataObject.UUID}${
                                          this.props.urlParams
                                              ? `${this.props.urlParams}`
                                              : ''
                                      }`
                                    : `/detail/${this.props.overzichtSlug}/${dataObject.UUID}`
                            }
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
            </div>
        )
    }
}

export default withRouter(ContainerDetailMain)
