import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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
                        <div className="block mt-8">
                            <SearchBar width="w-full" />
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
                        . Wil je weten waar wij mee bezig zijn?{' '}
                        <Link
                            to="/planning"
                            className="underline cursor-pointer"
                        >
                            Klik dan hier
                        </Link>
                        .
                    </p>
                </div>
                <div id="half-screen-leaflet-container">
                    <LeafletHalfScreenWidthViewer />
                </div>
            </ContainerMain>
        )
    }
}

export default RaadpleegHome
