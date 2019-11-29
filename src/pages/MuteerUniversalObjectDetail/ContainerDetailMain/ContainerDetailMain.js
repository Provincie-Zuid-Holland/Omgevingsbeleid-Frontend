import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { format } from 'date-fns'
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

function StatusLabel(props) {
    return (
        <span className="inline bg-blue-100 m-color ml-3 px-3 py-3 rounded-full font-bold text-sm">
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
                className={`relative inline-block w-full px-6 py-5 shadow-md rounded overflow-hidden bg-white -mb-2 ${
                    pageType === 'version' ? 'mt-6' : null
                }`}
            >
                {titelEnkelvoud === 'Beleidsbeslissing' ? (
                    <div
                        onClick={this.toggleDropdown}
                        className="absolute right-0 top-0 hover:text-gray-800 text-gray-600 cursor-pointer p-5"
                    >
                        <FontAwesomeIcon className="mr-2" icon={faEllipsisV} />
                    </div>
                ) : null}

                {this.state.dropdown ? (
                    <PopUpDetailDropdown
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

                <span className="text-gray-500 text-sm mb-1 block">
                    {titelEnkelvoud}
                </span>

                {dataReceived ? (
                    <HeadingMain titel={titel} />
                ) : (
                    <LoaderMainTitle />
                )}

                {pageType === 'detail' &&
                titelEnkelvoud === 'beleidsbeslissing' ? (
                    <StatusLabel />
                ) : null}

                <div className="mt-8 flex">
                    <div className="flex justify-between items-center w-full mr-4 pr-4 border-r border-gray-300 py-2">
                        <div>
                            <span className="block font-bold text-gray-700 text-sm">
                                Vigerend sinds
                            </span>
                            {dataReceived ? (
                                <span className="text-sm text-gray-700">
                                    {dataObject['Begin_Geldigheid'] !== null
                                        ? format(
                                              new Date(
                                                  dataObject['Begin_Geldigheid']
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
                        <div className="flex justify-between items-center w-full mr-4 pr-4 border-r border-gray-300 py-2">
                            <a
                                href={dataObject['Weblink']}
                                target="_blank"
                                id="href-idms-koppeling"
                            >
                                <span className="block font-bold text-gray-700 text-sm">
                                    IDMS-koppeling
                                </span>
                                <span className="text-sm text-gray-700">
                                    Bekijk document
                                </span>
                            </a>
                            <div>
                                <FontAwesomeIcon
                                    className="text-gray-600 text-xl"
                                    icon={faLink}
                                />
                            </div>
                        </div>
                    ) : null}
                    {titelEnkelvoud !== 'Beleidsrelatie' ? (
                        <div className="flex justify-between items-center w-full py-2 cursor-pointer">
                            <div>
                                <a
                                    href={`/detail/${this.props.overzichtSlug}/${this.props.match.params.single}`}
                                    target="_blank"
                                    rel="noopener"
                                >
                                    <span className="block font-bold text-gray-700 text-sm">
                                        Link naar raadpleegomgeving
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        Bekijk {titelEnkelvoud.toLowerCase()}
                                    </span>
                                </a>
                            </div>
                            <div>
                                <FontAwesomeIcon
                                    className="text-gray-600 text-xl"
                                    icon={faExternalLinkAlt}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
}

export default withRouter(ContainerDetailMain)
