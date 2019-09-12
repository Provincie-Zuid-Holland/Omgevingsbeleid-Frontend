import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import LeafletHalfScreenWidthViewer from './../../components/LeafletHalfScreenWidthViewer'

class Zoekbalk extends Component {
    render() {
        return (
            <div className="w-full block relative">
                <input
                    className="appearance-none w-full block text-gray-700 border border-gray-400 rounded py-3 pl-4 pr-12 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500 shadow text-sm"
                    id="titel"
                    type="text"
                    placeholder="Zoeken op tags, adres, artikelnummer, etc."
                />
                <FontAwesomeIcon
                    className="absolute right-0 top-0 mr-4 mt-4 text-gray-600 text-sm"
                    icon={faSearch}
                />
            </div>
        )
    }
}

class RaadpleegHome extends Component {
    render() {
        return (
            <div
                className="container mx-auto flex px-6 pb-8"
                id="raadpleeg-home"
            >
                <div className="w-1/2 pr-8 pb-20">
                    <h1 className="mt-8 heading-serif-2xl">Omgevingsbeleid</h1>
                    <p className="mt-6 text-gray-800">
                        Zoek eenvoudig binnen het Omgevingsbeleid van de
                        provincie Zuid-Holland of selecteer een locatie of
                        gebied op de kaart. Meer algemene informatie over
                        omgevingsbeleids is te lezen op de website van de{' '}
                        <a href="#" className="underline cursor-pointer">
                            provincie Zuid-Holland
                        </a>
                        .
                    </p>
                    <div className="mt-10 block">
                        <Zoekbalk />
                    </div>
                    <div>
                        <h2 className="heading-serif mt-10">
                            Recente Wijzigingen
                        </h2>
                        <ul className="mt-4 skip-border-last-child">
                            <li className="text-gray-700 text-sm w-full border-b border-gray-300 py-3">
                                <Link to="/artikel-detail">
                                    <span className="mr-3">01-01-2019</span>
                                    <span className="mr-1">Artikel 4.6</span>
                                    <span className="mr-1">-</span>
                                    <span>Werkingsgebied</span>
                                </Link>
                            </li>
                            <li className="text-gray-700 text-sm w-full border-b border-gray-300 py-3">
                                <Link to="/artikel-detail">
                                    <span className="mr-3">01-01-2019</span>
                                    <span className="mr-1">Artikel 4.6</span>
                                    <span className="mr-1">-</span>
                                    <span>Werkingsgebied</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="border-b border-gray-300 w-full block h-2 mt-6" />
                    <div className="mb-10">
                        <h2 className="heading-serif mt-10">
                            Stukken die ter inspraak liggen
                        </h2>
                        <ul className="mt-4 skip-border-last-child">
                            <li className="text-gray-700 text-sm w-full border-b border-gray-300 py-3">
                                <Link to="/artikel-detail">
                                    <span className="mr-3">01-01-2019</span>
                                    <span className="mr-1">Artikel 4.6</span>
                                    <span className="mr-1">-</span>
                                    <span>Werkingsgebied</span>
                                </Link>
                            </li>
                            <li className="text-gray-700 text-sm w-full border-b border-gray-300 py-3">
                                <Link to="/artikel-detail">
                                    <span className="mr-3">01-01-2019</span>
                                    <span className="mr-1">Artikel 4.6</span>
                                    <span className="mr-1">-</span>
                                    <span>Werkingsgebied</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="half-screen-leaflet-container">
                    <LeafletHalfScreenWidthViewer />
                </div>
            </div>
        )
    }
}

export default RaadpleegHome
