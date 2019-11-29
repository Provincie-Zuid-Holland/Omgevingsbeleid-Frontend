import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import LeafletHalfScreenWidthViewer from './../../components/LeafletHalfScreenWidthViewer'
import SearchBar from './../../components/SearchBar'
import ContainerMain from './../../components/ContainerMain'

class RaadpleegHome extends Component {
    render() {
        return (
            // <div
            //     className="container mx-auto flex pr-6 pb-8"
            //     id="raadpleeg-home"
            // >
            <ContainerMain id="raadpleeg-home">
                <div className="w-1/2 pr-8 pb-20">
                    <h1 className="mt-8 heading-serif-2xl text-gray-800">
                        Omgevingsbeleid
                    </h1>
                    <p className="mt-4 text-gray-800">
                        Zoek eenvoudig binnen het Omgevingsbeleid van de
                        provincie Zuid-Holland of selecteer een locatie of
                        gebied op de kaart. Meer algemene informatie over
                        omgevingsbeleid is te lezen op de website van de{' '}
                        <a
                            href="https://www.zuid-holland.nl/actueel/omgevingsbeleid/"
                            className="underline cursor-pointer"
                            target="_blank"
                            rel="noopener"
                        >
                            provincie Zuid-Holland
                        </a>
                        .
                    </p>
                    <div className="mt-10 block">
                        <SearchBar />
                    </div>
                    {/* <div>
                        <h2 className="heading-serif text-gray-800 mt-10">
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
                        <h2 className="heading-serif text-gray-800 mt-10">
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
                    </div> */}
                </div>
                <div id="half-screen-leaflet-container">
                    <LeafletHalfScreenWidthViewer />
                </div>
            </ContainerMain>
        )
    }
}

export default RaadpleegHome
