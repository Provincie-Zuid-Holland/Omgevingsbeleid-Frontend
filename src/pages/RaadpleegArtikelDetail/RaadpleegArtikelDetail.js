import React, { Component } from 'react'
import {
    faAngleRight,
    faClock,
    faFileDownload,
    faPrint,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'
import PopUpRevisieContainer from './../../components/PopUpRevisieContainer'

function RevisieListItem(props) {
    return (
        <li className="py-2">
            <span
                className={`inline-block w-4 h-4 bg-${
                    props.color
                }-500 rounded-full mt-1 absolute`}
            />
            <span
                className={`pl-6 text-sm ${props.current ? 'font-bold' : null}`}
            >
                {props.content}
            </span>
        </li>
    )
}

class RaadpleegArtikelDetail extends Component {
    render() {
        return (
            <div className="container mx-auto flex px-6 pb-8 mt-8">
                <div className="w-1/4">
                    <ButtonBackToPage terugNaar="startpagina" url="/" />
                    <h2 className="mt-6 text-l font-serif block">
                        Inhoudsopgave verordening
                    </h2>
                    <ul className="mt-4 pr-8">
                        <li className="mt-2 text-gray-700">
                            <span className="text-sm block">Hoofdstuk 7</span>
                            <span className="text-xs">
                                Financiële Bepalingen
                            </span>
                            <ul>
                                <li className="pl-6 mt-2 text-gray-700">
                                    <span className="text-sm block">
                                        Paragraaf 7.1
                                    </span>
                                    <span className="text-xs">Leges</span>
                                </li>
                                <li className="pl-6 mt-2 text-gray-700">
                                    <span className="text-sm block">
                                        Paragraaf 7.2
                                    </span>
                                    <span className="text-xs">
                                        Grondwaterheffingen
                                    </span>
                                    <ul>
                                        <li className="pl-6 mt-2 text-gray-700">
                                            <span className="text-sm block">
                                                Artikel 7.13
                                            </span>
                                            <span className="text-xs">
                                                Grondwaterheffing, grondslag en
                                                belastbaar feit
                                            </span>
                                        </li>
                                        <li className="pl-6 mt-2 text-gray-700">
                                            <span className="text-sm block">
                                                Artikel 7.14
                                            </span>
                                            <span className="text-xs">
                                                Vrijstelling
                                            </span>
                                        </li>
                                        <li className="pl-6 mt-2 text-gray-700">
                                            <span className="text-sm block">
                                                Artikel 7.15
                                            </span>
                                            <span className="text-xs">
                                                Heffingsplicht
                                            </span>
                                        </li>
                                        <li className="pl-6 mt-2 text-gray-700">
                                            <span className="text-sm block">
                                                Artikel 7.16
                                            </span>
                                            <span className="text-xs">
                                                Tarief
                                            </span>
                                        </li>
                                        <li className="pl-6 mt-2 text-gray-700">
                                            <span className="text-sm block">
                                                Artikel 7.17
                                            </span>
                                            <span className="text-xs">
                                                Wijze van heffing en tijdstip
                                                van betalen
                                            </span>
                                        </li>
                                        <li className="pl-6 mt-2 text-gray-700">
                                            <span className="text-sm block">
                                                Artikel 7.18
                                            </span>
                                            <span className="text-xs">
                                                Kwijtschelding
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="w-2/4">
                    {/* Artikel Breadcrumb */}
                    <span className="text-gray-600 text-sm">
                        <span className="mr-1">7. Financiële bepalingen</span>
                        <span className="mr-1">
                            <FontAwesomeIcon icon={faAngleRight} /> §
                        </span>
                        <span>7.2 Grondwaterheffing</span>
                    </span>

                    {/* Artikel Headers */}
                    <span className="text-l font-serif block text-gray-800 mt-8">
                        Artikel 7.13
                    </span>
                    <h1 className="mt-2 heading-serif-2xl">
                        Grondwaterheffing, grondslag en belastbaar feit
                    </h1>

                    {/* Meta Content */}
                    <div>
                        <span className="text-gray-600 text-sm mr-3">
                            Vigerend sinds 01-01-2018
                        </span>
                        <span className="text-gray-600 text-sm mr-3">
                            &bull;
                        </span>
                        <PopUpRevisieContainer>
                            <RevisieListItem
                                content="In inspraak (1)"
                                color="red"
                            />
                            <RevisieListItem
                                content="1 januari 2018"
                                color="orange"
                                current={true}
                            />
                            <RevisieListItem
                                content="2 januari 2016"
                                color="blue"
                            />
                            <RevisieListItem
                                content="14 juli 2014"
                                color="blue"
                            />
                            <RevisieListItem
                                content="18 november 2010"
                                color="blue"
                            />
                        </PopUpRevisieContainer>
                        <span className="text-gray-600 text-sm mr-3">
                            &bull;
                        </span>
                        <span className="text-gray-600 text-sm mr-3">
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={faFileDownload}
                            />
                            Download als PDF
                        </span>
                        <span className="text-gray-600 text-sm mr-3">
                            &bull;
                        </span>
                        <span className="text-gray-600 text-sm mr-3">
                            <FontAwesomeIcon className="mr-2" icon={faPrint} />
                            Afdrukken
                        </span>
                    </div>

                    {/* Melding */}
                    <div className="w-full border border-red-500 bg-red-100 text-red-500 px-4 py-2 rounded mt-4 text-sm">
                        Een nieuwe versie van artikel 7.13 ligt ter inzage.
                        Bekijk de nieuwe versie.
                    </div>

                    {/* Artikel Inhoud */}
                    <div>
                        <ol className="list-decimal pl-4 text-gray-700 text-sm mt-4">
                            <li className="mb-1">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </li>
                            <li className="mb-1">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </li>
                            <li className="mb-1">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </li>
                        </ol>
                    </div>

                    {/* Tag Container */}
                    <div className="mt-8">
                        <h2 className="text-l font-serif block text-gray-800 mt-8">
                            Tags
                        </h2>
                        <div className="flex mt-3">
                            <div className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-4">
                                Grondwater
                            </div>
                            <div className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-4">
                                Grondwaterheffing
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/4 pl-8">
                    <div className="flex justify-between mt-8 text-gray-800">
                        <h2 className="text-l font-serif">Werkingsgebied</h2>
                        <span className="text-xs">
                            Bekijk in het groot
                            <FontAwesomeIcon
                                className="ml-2 text-gray-700"
                                icon={faExternalLinkAlt}
                            />
                        </span>
                    </div>
                    <div className="bg-orange-100 w-full h-64 block mt-4" />
                </div>
            </div>
        )
    }
}

export default RaadpleegArtikelDetail
