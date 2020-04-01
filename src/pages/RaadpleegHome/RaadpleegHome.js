import React, { Component } from 'react'

// Import Components
import LeafletHalfScreenWidthViewer from './../../components/LeafletHalfScreenWidthViewer'
import SearchBar from './../../components/SearchBar'
import ContainerMain from './../../components/ContainerMain'

class RaadpleegHome extends Component {
    render() {
        return (
            <ContainerMain id="raadpleeg-home">
                <div className="flex flex-col justify-between w-1/2 pb-8 pr-8">
                    <div>
                        <h1 className="mt-8 text-gray-800 heading-serif-2xl">
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
                                rel="noopener noreferrer"
                            >
                                provincie Zuid-Holland
                            </a>
                            .
                        </p>
                        <div className="block mt-6">
                            <SearchBar />
                        </div>
                    </div>
                    <p className="mt-10 text-sm text-gray-600">
                        Omdat de website nog in ontwikkeling is kan het zijn dat
                        sommige functionaliteiten niet goed werken. Kom je een
                        fout tegen? Neem dan contact op door te mailen naar{' '}
                        <a
                            href="mailto:omgevingsbeleid@pzh.nl?subject=Feedback Omgevingsbeleid&body=Probeer zo duidelijk mogelijk te omschrijven waar je tegenaan liep"
                            className="underline cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            omgevingsbeleid@pzh.nl
                        </a>
                        .
                    </p>
                    {/* <div>
                        <h2 className="mt-10 text-gray-800 heading-serif">
                            Recente Wijzigingen
                        </h2>
                        <ul className="mt-4 skip-border-last-child">
                            <li className="w-full py-3 text-sm text-gray-700 border-b border-gray-300">
                                <Link to="/artikel-detail">
                                    <span className="mr-3">01-01-2019</span>
                                    <span className="mr-1">Artikel 4.6</span>
                                    <span className="mr-1">-</span>
                                    <span>Werkingsgebied</span>
                                </Link>
                            </li>
                            <li className="w-full py-3 text-sm text-gray-700 border-b border-gray-300">
                                <Link to="/artikel-detail">
                                    <span className="mr-3">01-01-2019</span>
                                    <span className="mr-1">Artikel 4.6</span>
                                    <span className="mr-1">-</span>
                                    <span>Werkingsgebied</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="block w-full h-2 mt-6 border-b border-gray-300" />
                    <div className="mb-10">
                        <h2 className="mt-10 text-gray-800 heading-serif">
                            Stukken die ter inspraak liggen
                        </h2>
                        <ul className="mt-4 skip-border-last-child">
                            <li className="w-full py-3 text-sm text-gray-700 border-b border-gray-300">
                                <Link to="/artikel-detail">
                                    <span className="mr-3">01-01-2019</span>
                                    <span className="mr-1">Artikel 4.6</span>
                                    <span className="mr-1">-</span>
                                    <span>Werkingsgebied</span>
                                </Link>
                            </li>
                            <li className="w-full py-3 text-sm text-gray-700 border-b border-gray-300">
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
