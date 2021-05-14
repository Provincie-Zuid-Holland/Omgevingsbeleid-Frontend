import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
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

// Import Utilities
import getVigerendText from './../../utils/getVigerendText'

/**
 * Function to display a statusLabel within the ContainerDetailMain component with the text "Vigerend".
 *
 * @function
 *
 * @param {object} props - Containing a set value and is not used within this function.
 */
function StatusLabel(props) {
    return (
        <span className="inline px-3 py-3 ml-3 text-sm font-bold bg-blue-100 rounded-full text-pzh-blue">
            Vigerend
        </span>
    )
}

/**
 * Class that renders the ContainerDetailMain component that is used within the muteeruniversalObjectDetail page.
 * The class uses the parent props given to it, in conditional operators to show/hide the imported components or parts of elements, if they contain a value.
 * The class is used in the page MuteerUniversalObjectDetail.
 *
 * @class
 * @extends {Component}
 */
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

    /**
     * Function to toggle (hide/show) the dropdown element by toggling the dropdown state.
     *
     * @function
     */

    toggleDropdown() {
        this.setState({
            dropdown: !this.state.dropdown,
        })
    }

    /**
     * Function to toggle (hide/show) the statusPopup by setting the statusPopup state.
     *
     * @function
     */
    toggleStatusPopup() {
        this.setState({
            statusPopup: !this.state.statusPopup,
        })
    }

    render() {
        const dataObject = this.props.dataObject
        const titleSingular = this.props.titleSingular
        const pageType = this.props.pageType
        const titel = dataObject.Titel
        const dataReceived = this.props.dataReceived

        const validDate = getVigerendText({ dataObject })
        const validDatePrefix = getVigerendText({
            dataObject,
            prefixOnly: true,
        })

        return (
            <div
                className={`relative inline-block w-full px-6 py-5 shadow-md rounded bg-white -mb-2 ${
                    pageType === 'version' ? 'mt-6' : ''
                }`}
            >
                {this.props.children}
                {titleSingular === 'Beleidskeuze' ? (
                    <div
                        onClick={this.toggleDropdown}
                        className="absolute top-0 right-0 p-5 text-gray-600 cursor-pointer hover:text-gray-800"
                    >
                        <FontAwesomeIcon className="mr-2" icon={faEllipsisV} />
                    </div>
                ) : null}

                {this.state.dropdown ? (
                    <PopUpDetailDropdown
                        titleSingular={titleSingular}
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
                    {titleSingular}
                </span>

                {dataReceived ? (
                    <HeadingMain titel={titel} />
                ) : (
                    <LoaderMainTitle />
                )}

                {pageType === 'detail' && titleSingular === 'beleidskeuze' ? (
                    <StatusLabel />
                ) : null}

                <div className="flex mt-8">
                    <div className="flex items-center justify-between w-full py-2 pr-4 border-r border-gray-300">
                        <div>
                            <span className="block text-sm font-bold text-gray-700">
                                {dataReceived && validDatePrefix}
                            </span>
                            {dataReceived ? (
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
                            className="flex items-center justify-between w-full px-4 py-2 border-r border-gray-300 hover:bg-gray-50 pzh-transition-colors"
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
                                    className="text-lg text-gray-600"
                                    icon={faLink}
                                />
                            </div>
                        </a>
                    ) : null}
                    {titleSingular !== 'Beleidsrelatie' ? (
                        <a
                            href={
                                titleSingular === 'Artikel' ||
                                titleSingular === 'Paragraaf' ||
                                titleSingular === 'Afdeling'
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
                            className="flex items-center justify-between w-full py-2 pl-4 cursor-pointer hover:bg-gray-50 pzh-transition-colors"
                        >
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
                            <div>
                                <FontAwesomeIcon
                                    className="mr-4 text-lg text-gray-600"
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
