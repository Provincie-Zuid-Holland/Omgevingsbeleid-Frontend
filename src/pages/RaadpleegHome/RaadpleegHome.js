import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { faFilePdf } from '@fortawesome/free-regular-svg-icons'
import {
    faExternalLinkAlt,
    faArrowRight,
} from '@fortawesome/pro-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Components
import LeafletViewer from './../../components/LeafletViewer'
import SearchBar from './../../components/SearchBar'
import ContainerMain from './../../components/ContainerMain'

const DocumentLink = ({ href, title, iconLeft, style }) => (
    <li className="py-2 border-b-2 border-gray-200">
        <a
            href={href}
            target="_blank"
            className="flex items-center justify-between"
        >
            <div className="flex">
                <span className="flex items-center w-6">
                    <FontAwesomeIcon
                        icon={iconLeft}
                        className={style ? style : ''}
                    />
                </span>
                <span>{title}</span>
            </div>
        </a>
    </li>
)

const scrollToElement = ({ id }) => {
    const el = document.getElementById(id)
    const y = el.getBoundingClientRect().top + window.pageYOffset - 100
    window.scrollTo({
        top: y,
        behavior: 'smooth',
    })
}

const imageStyles = {
    height: '400px',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
}

class RaadpleegHome extends Component {
    render() {
        return (
            <div>
                <div className="container flex px-6 pt-0 mx-auto mt-6 mb-16 sm:mt-8 sm:py-10 sm:px-6 lg:px-8">
                    <div className="w-full pr-12">
                        <h1 className="mb-4 text-3xl font-bold sm:text-4xl text-primary">
                            Omgevingsbeleid
                        </h1>
                        <p className="my-5 mt-4 leading-7 text-gray-700">
                            Provincie Zuid-Holland heeft haar beleid
                            eenvoudiger, transparanter en toegankelijker
                            gemaakt. Via deze website kunt u al het
                            Omgevingsbeleid van de provincie Zuid-Holland
                            inzien. Denk bijvoorbeeld aan de provinciale
                            ambities voor een duurzame economie, de regelgeving
                            rondom gevaarlijke gassen of aan de maatregelen die
                            de provincie neemt om natuur te herstellen. Zo wordt
                            voor iedereen zichtbaar waar de provincie aan wil
                            werken en wat binnen de provinciegrenzen is
                            toegestaan. Daarnaast kan het Omgevingsbeleid
                            digitaal worden aangepast zodat het altijd
                            up-to-date is.
                        </p>
                        <div className="mt-5 font-semibold text-gray-900">
                            <div
                                className="relative flex items-center cursor-pointer group"
                                onClick={() =>
                                    scrollToElement({ id: 'homepage-visie' })
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="absolute transition-all duration-100 ease-in group-hover:ml-1"
                                />
                                <span className="pl-6">
                                    Hoe is het beleid opgebouwd?
                                </span>
                            </div>
                            <div
                                onClick={() =>
                                    scrollToElement({ id: 'homepage-kaart' })
                                }
                                className="relative flex items-center mt-3 cursor-pointer group"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="absolute transition-all duration-100 ease-in group-hover:ml-1"
                                />
                                <span className="pl-6">Beleid op de kaart</span>
                            </div>
                        </div>
                    </div>
                    <div className="items-center justify-center hidden w-full h-full sm:flex">
                        <ZuidHollandSVG />
                    </div>
                </div>
                <div className="bg-primary-super-dark">
                    <div className="container flex flex-col items-center justify-center px-6 py-10 pb-8 mx-auto text-white sm:px-6 lg:px-8">
                        <h2
                            id="homepage-zoeken"
                            className="mb-3 text-2xl font-bold"
                        >
                            Zoeken in het beleid
                        </h2>
                        <p className="mb-6 leading-7 text-gray-white">
                            Waar bent u naar op zoek binnen het beleid van de
                            provincie Zuid-Holland?
                        </p>
                        <div className="flex justify-center w-full">
                            <div className="w-full lg:w-1/2">
                                <SearchBar placeholder="Zoek op onderdelen uit de visie, programma of de uitvoering" />
                            </div>
                        </div>
                        <span
                            onClick={() =>
                                scrollToElement({ id: 'homepage-kaart' })
                            }
                            className="mt-5 text-white underline opacity-75 cursor-pointer"
                        >
                            Liever zoeken op de kaart? Dat kan!
                        </span>
                    </div>
                </div>
                <div className="container flex px-6 py-8 pt-16 pb-8 mx-auto mb-0 sm:mb-16 sm:px-6 lg:px-8 sm:py-12 md:py-20">
                    <div
                        className="hidden w-full h-full mr-16 text-white bg-indigo-700 sm:inline-block image-home-1"
                        style={imageStyles}
                    />
                    <div className="flex flex-col justify-center w-full">
                        <h2
                            id="homepage-visie"
                            className="text-3xl font-bold sm:text-4xl text-primary"
                        >
                            Visie
                        </h2>
                        <p className="my-5 mt-4 leading-7 text-gray-700">
                            De visie van de provincie Zuid-Holland geeft aan
                            waar de provincie voor staat. Het beschrijft hoe de
                            provincie de toekomst van Zuid-Holland voor zich
                            ziet. De Omgevingsvisie bevat verschillende
                            onderdelen: in de{' '}
                            <mark className="marked-purple">7 ambities</mark>{' '}
                            wordt omschreven waar we als provincie heen willen,
                            de{' '}
                            <mark className="marked-purple">
                                18 beleidsdoelen
                            </mark>{' '}
                            geven hier richting aan en de{' '}
                            <mark className="marked-purple">
                                74 beleidskeuzes
                            </mark>{' '}
                            bepalen hoe de ambities bereikt dienen te worden.
                        </p>
                    </div>
                </div>
                <div className="container flex px-6 py-8 pb-8 mx-auto mb-0 sm:mb-16 lg:px-8">
                    <div className="flex flex-col justify-center w-full">
                        <h2
                            id="homepage-omgevingsprogramma"
                            className="text-3xl font-bold sm:text-4xl text-theme-orange"
                        >
                            Omgevingsprogramma
                        </h2>
                        <p className="my-5 mt-4 leading-7 text-gray-700">
                            In het <b>Omgevingsprogramma</b> staat beschreven
                            welke{' '}
                            <mark className="marked-orange">maatregelen</mark>{' '}
                            de provincie treft om de visie waar te maken. Het
                            Omgevingsprogramma geeft bijvoorbeeld aan voor welke
                            initiatieven subsidies worden verleend en aan welke
                            provinciale wegen wordt gewerkt. Het
                            Omgevingsprogramma is een overzicht van alle
                            maatregelen inclusief de onderliggende activiteiten.
                        </p>
                    </div>
                    <div
                        className="hidden w-full h-full ml-16 text-white bg-indigo-700 sm:inline-block image-home-2"
                        style={imageStyles}
                    />
                </div>
                <div className="container flex px-6 py-8 pb-8 mx-auto mb-0 sm:mb-16 lg:px-8">
                    <div
                        className="hidden w-full h-full mr-16 text-white bg-indigo-700 sm:inline-block image-home-3"
                        style={imageStyles}
                    />
                    <div className="flex flex-col justify-center w-full">
                        <h2 className="text-3xl font-bold sm:text-4xl text-theme-red">
                            Uitvoering
                        </h2>
                        <p className="my-5 mt-4 leading-7 text-gray-700">
                            Bij de uitvoering komen de maatregelen en de
                            activiteiten uit het Omgevingprogramma die bij
                            elkaar horen samen in verschillende{' '}
                            <mark className="marked-red">
                                uitvoeringsplannen
                            </mark>
                            . Voor het in stand houden van goede
                            omgevingskwaliteit horen echter ook regels. De
                            regels die de provincie stelt aan anderen worden
                            ondergebracht in de{' '}
                            <mark className="marked-red">
                                Omgevingsverordening
                            </mark>
                            . Regels waar de provincie zelf aan moet houden
                            staan omschreven in{' '}
                            <mark className="marked-red">beleidsregels</mark>.
                        </p>
                    </div>
                </div>
                <div className="w-full pb-4 bg-primary-light">
                    <div className="container w-full max-w-5xl px-6 py-20 pb-8 mx-auto lg:px-8">
                        <h2
                            id="homepage-kaart"
                            className="text-3xl font-bold sm:text-4xl text-primary"
                        >
                            Beleid op de kaart
                        </h2>
                        <p className="my-5 mt-4 leading-7 text-gray-700">
                            Wilt u het beleid en de regelgeving van de provincie
                            op een specifieke locatie raadplegen? Zoek hieronder
                            op een locatie of markeer een punt of vorm op de
                            kaart.
                        </p>
                        <div className="w-full mx-auto" id="leaflet-homepage">
                            <LeafletViewer className="w-full border border-gray-300 rounded" />
                        </div>
                        <span
                            onClick={() =>
                                scrollToElement({ id: 'homepage-zoeken' })
                            }
                            className="block w-full py-2 mt-5 text-center text-gray-800 underline opacity-75 cursor-pointer"
                        >
                            Liever zoeken op de tekst? Dat kan!
                        </span>
                    </div>
                </div>
                <div className="container flex flex-col px-6 pt-16 pb-12 mx-auto mb-0 sm:mb-16 sm:flex-row lg:px-8">
                    <div className="w-full pr-8">
                        <h3 className="mb-4 text-2xl font-bold text-primary">
                            Documenten
                        </h3>
                        <p className="text-gray-800">
                            We zijn hard bezig met het vullen van onze database.
                            Sommige onderdelen bieden we op dit moment nog aan
                            als PDF’s.
                        </p>
                        <ul className="mt-4 text-gray-700">
                            <DocumentLink
                                href="docs/introductie_omgevingsvisie_Zuid-Holland.pdf"
                                iconLeft={faFilePdf}
                                title="Introductie Omgevingsvisie Zuid-Holland"
                                rel="noopener noreferrer"
                            />
                            <DocumentLink
                                href="docs/ruimtelijke_kwaliteit.pdf"
                                iconLeft={faFilePdf}
                                title="Bijlage Omgevingsvisie: Ruimtelijke kwaliteit"
                                rel="noopener noreferrer"
                            />
                            <DocumentLink
                                href="docs/programma_ruimte.pdf"
                                iconLeft={faFilePdf}
                                title="Programma Ruimte"
                                rel="noopener noreferrer"
                            />
                            <DocumentLink
                                href="docs/programma_mobiliteit.pdf"
                                iconLeft={faFilePdf}
                                title="Programma Mobiliteit"
                                rel="noopener noreferrer"
                            />
                            <DocumentLink
                                href="https://lta.zuid-holland.nl/"
                                iconLeft={faExternalLinkAlt}
                                title="De Lange Termijn Agenda Omgevingsbeleid"
                                style="text-sm"
                                rel="noopener noreferrer"
                            />
                        </ul>
                    </div>
                    <div className="w-full mt-8 sm:mt-0">
                        <h3 className="mb-4 text-2xl font-bold text-primary">
                            In ontwikkeling
                        </h3>
                        <p className="pb-8 text-gray-800">
                            Omdat de website nog in ontwikkeling is kan het zijn
                            dat sommige functionaliteiten niet goed werken. Kom
                            je een fout tegen? Neem dan contact op door te
                            mailen naar{' '}
                            <a
                                href="mailto:omgevingsbeleid@pzh.nl?subject=Feedback Omgevingsbeleid&body=Probeer zo duidelijk mogelijk te omschrijven waar je tegenaan liep"
                                className="underline cursor-pointer"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                omgevingsbeleid@pzh.nl
                            </a>
                            .
                            <br />
                            <br />
                            Wil je weten waar wij mee bezig zijn?{' '}
                            <Link
                                to="/planning"
                                className="underline cursor-pointer"
                            >
                                Klik dan hier
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

const ZuidHollandSVG = () => {
    return (
        <svg
            width="377px"
            height="333px"
            viewBox="0 0 377 333"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>Path</title>
            <g
                id="Omgevingsbeleid---Raadpleegomgeving"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
                fillOpacity="0.15"
            >
                <g
                    id="2.0---Raadpleegomgeving---Start"
                    transform="translate(-831.000000, -167.000000)"
                    fill="#000066"
                >
                    <g id="Group" transform="translate(831.000000, 167.000000)">
                        <polygon
                            id="Path"
                            points="230.866 7.37269 228.41 6.14391 224.726 4.91513 221.042 3.68635 219.814 2.45756 214.902 0 212.446 4.91513 209.99 9.83026 209.99 11.059 208.762 13.5166 206.306 18.4317 203.85 22.1181 203.85 24.5756 202.622 25.8044 202.622 27.0332 201.394 27.0332 201.394 28.262 201.394 29.4908 200.166 30.7196 198.938 33.1771 198.938 34.4059 197.71 35.6347 196.482 38.0923 195.254 39.321 195.254 40.5498 192.798 44.2362 190.342 47.9225 190.342 49.1513 187.886 51.6089 185.43 57.7528 180.518 66.3542 179.29 67.583 178.062 68.8118 176.834 70.0406 174.378 73.7269 174.378 74.9557 170.694 78.6421 167.01 83.5572 163.326 87.2435 162.098 89.7011 160.87 92.1587 158.414 94.6162 157.186 95.845 153.502 98.3026 152.274 99.5314 152.274 100.76 149.818 101.989 147.362 105.675 144.906 105.675 143.678 106.904 142.45 108.133 142.45 109.362 142.45 111.819 138.765 115.506 136.309 117.963 136.309 119.192 133.853 121.649 132.625 122.878 131.397 125.336 128.941 126.565 127.713 127.793 126.485 130.251 125.257 130.251 125.257 131.48 122.801 133.937 117.889 140.081 115.433 142.539 112.977 143.768 112.977 144.996 110.521 148.683 106.837 152.369 106.837 154.827 104.381 156.055 103.153 157.284 84.7329 157.284 82.2769 157.284 79.8208 157.284 65.0847 160.97 56.4886 163.428 55.2606 169.572 52.8046 185.546 51.5765 196.605 61.4007 201.52 60.1726 207.664 56.4886 226.096 55.2606 227.325 55.2606 228.554 55.2606 231.011 54.0326 231.011 49.1205 233.469 42.9805 234.697 39.2964 237.155 36.8404 237.155 35.6124 237.155 35.6124 238.384 34.3844 238.384 29.4723 239.613 28.2443 240.841 27.0163 240.841 18.4202 248.214 17.1922 249.443 8.59609 255.587 0 262.959 15.9642 271.561 20.8762 275.247 22.1042 277.705 23.3322 277.705 29.4723 278.934 30.7003 280.162 34.3844 278.934 36.8404 275.247 39.2964 271.561 42.9805 270.332 44.2085 269.103 45.4365 269.103 50.3485 267.875 56.4886 269.103 58.9446 271.561 60.1726 272.79 67.5407 274.018 72.4528 275.247 72.4528 278.934 73.6808 283.849 76.1368 285.077 78.5928 289.993 78.5928 292.45 78.5928 293.679 78.5928 298.594 79.8208 302.28 82.2769 307.196 83.5049 307.196 85.9609 307.196 87.1889 307.196 88.4169 307.196 89.645 308.424 93.329 308.424 97.013 309.653 99.4691 310.882 100.697 310.882 104.381 310.882 109.293 312.111 112.977 312.111 114.205 313.339 116.661 314.568 125.257 321.941 127.713 324.399 139.993 330.542 141.221 330.542 141.221 331.771 142.45 331.771 143.678 331.771 144.906 331.771 146.134 331.771 147.362 331.771 148.59 331.771 148.59 333 149.818 333 149.818 331.771 151.046 331.771 152.274 331.771 153.502 331.771 154.73 331.771 155.958 331.771 155.958 330.542 157.186 330.542 158.414 330.542 159.642 329.314 160.87 329.314 162.098 329.314 163.326 329.314 163.326 328.085 164.554 328.085 165.782 328.085 167.01 328.085 168.238 328.085 168.238 326.856 169.466 326.856 170.694 326.856 171.922 325.627 173.15 325.627 173.15 324.399 174.378 324.399 175.606 324.399 175.606 323.17 176.834 323.17 176.834 321.941 178.062 321.941 179.29 320.712 179.29 319.483 180.518 318.255 180.518 317.026 181.746 315.797 181.746 314.568 181.746 313.339 185.43 309.653 187.886 307.196 189.114 305.967 191.57 304.738 194.026 302.28 195.254 301.052 197.71 302.28 198.938 303.509 200.166 303.509 205.078 304.738 208.762 305.967 209.99 307.196 214.902 308.424 216.13 309.653 217.358 309.653 219.814 309.653 221.042 309.653 222.27 309.653 227.182 309.653 228.41 309.653 229.638 308.424 230.866 308.424 234.55 308.424 238.235 307.196 239.463 307.196 239.463 305.967 244.375 304.738 246.831 303.509 249.287 302.28 250.515 302.28 250.515 301.052 252.971 299.823 254.199 299.823 257.883 298.594 259.111 298.594 260.339 297.365 261.567 297.365 265.251 296.137 267.707 296.137 270.163 294.908 272.619 293.679 273.847 292.45 276.303 291.221 278.759 289.993 278.759 288.764 282.443 286.306 283.671 286.306 283.671 285.077 284.899 283.849 287.355 282.62 287.355 281.391 288.583 280.162 289.811 278.934 291.039 276.476 292.267 274.018 293.495 270.332 294.723 269.103 294.723 267.875 295.951 266.646 295.951 265.417 297.179 265.417 297.179 264.188 299.635 261.731 303.319 260.502 304.547 260.502 307.003 259.273 310.687 259.273 311.915 259.273 313.143 259.273 315.599 259.273 316.827 259.273 318.055 259.273 319.283 260.502 321.739 259.273 322.967 259.273 324.195 258.044 325.423 258.044 326.651 258.044 326.651 256.815 327.879 256.815 329.107 255.587 329.107 254.358 331.564 253.129 331.564 251.9 332.792 251.9 334.02 250.672 335.248 250.672 335.248 249.443 336.476 249.443 337.704 248.214 338.932 248.214 338.932 246.985 340.16 246.985 341.388 246.985 342.616 245.756 343.844 245.756 345.072 245.756 346.3 245.756 347.528 245.756 348.756 245.756 351.212 245.756 354.896 246.985 356.124 246.985 357.352 246.985 358.58 248.214 359.808 248.214 361.036 248.214 363.492 248.214 364.72 249.443 365.948 249.443 367.176 249.443 368.404 249.443 369.632 249.443 370.86 249.443 372.088 249.443 373.316 249.443 374.544 249.443 375.772 249.443 375.772 250.672 375.772 249.443 375.772 248.214 377 248.214 377 246.985 377 245.756 377 244.528 377 243.299 377 242.07 377 240.841 377 239.613 375.772 239.613 375.772 238.384 374.544 238.384 373.316 238.384 372.088 238.384 370.86 238.384 369.632 238.384 369.632 237.155 369.632 238.384 368.404 238.384 368.404 237.155 368.404 235.926 368.404 234.697 368.404 233.469 367.176 233.469 367.176 232.24 367.176 231.011 367.176 229.782 365.948 229.782 367.176 229.782 368.404 229.782 368.404 231.011 369.632 231.011 370.86 231.011 372.088 231.011 373.316 231.011 374.544 231.011 375.772 231.011 377 231.011 377 229.782 375.772 229.782 377 229.782 377 228.554 375.772 228.554 375.772 227.325 375.772 226.096 374.544 226.096 374.544 224.867 375.772 224.867 375.772 223.638 374.544 223.638 375.772 223.638 375.772 222.41 375.772 221.181 375.772 219.952 377 219.952 375.772 219.952 374.544 219.952 374.544 221.181 373.316 221.181 372.088 221.181 370.86 222.41 369.632 222.41 368.404 222.41 368.404 223.638 368.404 222.41 368.404 223.638 367.176 223.638 367.176 222.41 367.176 221.181 367.176 219.952 368.404 219.952 368.404 218.723 368.404 217.494 367.176 217.494 367.176 216.266 367.176 215.037 367.176 213.808 367.176 212.579 367.176 211.351 367.176 210.122 365.948 210.122 364.72 210.122 364.72 211.351 363.492 211.351 362.264 211.351 361.036 211.351 361.036 212.579 359.808 212.579 359.808 211.351 361.036 211.351 361.036 210.122 361.036 208.893 361.036 207.664 361.036 206.435 359.808 206.435 358.58 206.435 358.58 205.207 357.352 205.207 357.352 203.978 356.124 203.978 356.124 202.749 354.896 202.749 354.896 201.52 354.896 200.292 354.896 199.063 353.668 199.063 353.668 197.834 353.668 196.605 353.668 195.376 352.44 195.376 352.44 194.148 352.44 195.376 351.212 195.376 351.212 196.605 349.984 196.605 349.984 195.376 349.984 194.148 349.984 192.919 348.756 192.919 348.756 190.461 348.756 189.232 348.756 188.004 347.528 186.775 346.3 185.546 346.3 186.775 345.072 188.004 345.072 189.232 343.844 189.232 343.844 190.461 342.616 190.461 341.388 190.461 340.16 190.461 338.932 190.461 337.704 191.69 336.476 191.69 335.248 191.69 334.02 191.69 332.792 191.69 331.564 191.69 331.564 190.461 331.564 189.232 331.564 188.004 330.336 188.004 330.336 186.775 330.336 185.546 330.336 184.317 329.107 183.089 329.107 181.86 327.879 181.86 327.879 180.631 327.879 179.402 327.879 178.173 326.651 178.173 326.651 176.945 325.423 176.945 325.423 175.716 324.195 175.716 324.195 174.487 322.967 174.487 321.739 174.487 321.739 173.258 321.739 172.03 320.511 172.03 320.511 170.801 319.283 170.801 319.283 169.572 319.283 168.343 318.055 168.343 318.055 167.114 318.055 165.886 316.827 165.886 316.827 164.657 315.599 164.657 315.599 163.428 314.371 163.428 314.371 162.199 315.599 162.199 316.827 162.199 316.827 160.97 318.055 160.97 318.055 162.199 318.055 160.97 319.283 160.97 320.511 160.97 321.739 160.97 322.967 160.97 322.967 159.742 324.195 159.742 325.423 159.742 325.423 158.513 325.423 157.284 324.195 157.284 324.195 156.055 324.195 154.827 322.967 154.827 322.967 153.598 321.739 153.598 320.511 153.598 319.283 153.598 319.283 154.827 318.055 153.598 316.827 153.598 315.599 153.598 315.599 154.827 314.371 154.827 313.143 154.827 311.915 154.827 310.687 154.827 309.459 154.827 309.459 153.598 309.459 152.369 308.231 152.369 308.231 151.14 309.459 151.14 309.459 149.911 309.459 151.14 309.459 149.911 310.687 149.911 311.915 149.911 311.915 148.683 311.915 147.454 310.687 146.225 311.915 146.225 313.143 146.225 313.143 144.996 314.371 144.996 314.371 143.768 315.599 143.768 315.599 142.539 315.599 141.31 316.827 141.31 316.827 140.081 316.827 138.852 318.055 138.852 318.055 137.624 319.283 137.624 319.283 136.395 320.511 136.395 320.511 135.166 321.739 135.166 322.967 135.166 322.967 133.937 324.195 133.937 325.423 133.937 326.651 133.937 326.651 132.708 327.879 132.708 329.107 132.708 329.107 131.48 330.336 131.48 330.336 130.251 330.336 129.022 331.564 129.022 330.336 129.022 329.107 129.022 327.879 129.022 326.651 129.022 325.423 129.022 324.195 129.022 322.967 129.022 321.739 129.022 320.511 129.022 319.283 129.022 318.055 130.251 318.055 129.022 319.283 129.022 319.283 127.793 319.283 126.565 318.055 126.565 318.055 125.336 318.055 126.565 316.827 126.565 316.827 124.107 316.827 122.878 316.827 121.649 316.827 120.421 316.827 119.192 316.827 117.963 316.827 116.734 316.827 115.506 316.827 114.277 316.827 113.048 316.827 111.819 316.827 110.59 316.827 109.362 315.599 109.362 314.371 109.362 314.371 108.133 313.143 108.133 313.143 106.904 311.915 106.904 311.915 105.675 310.687 105.675 309.459 105.675 309.459 104.446 308.231 104.446 308.231 103.218 307.003 103.218 307.003 101.989 308.231 101.989 309.459 101.989 310.687 101.989 310.687 100.76 311.915 100.76 311.915 99.5314 311.915 98.3026 311.915 97.0738 311.915 95.845 311.915 94.6162 313.143 94.6162 314.371 94.6162 314.371 93.3875 315.599 93.3875 316.827 93.3875 318.055 93.3875 318.055 92.1587 319.283 92.1587 319.283 93.3875 320.511 93.3875 320.511 94.6162 320.511 93.3875 321.739 93.3875 321.739 94.6162 322.967 94.6162 324.195 94.6162 325.423 94.6162 325.423 95.845 326.651 95.845 327.879 95.845 329.107 95.845 330.336 95.845 330.336 94.6162 331.564 94.6162 331.564 93.3875 331.564 92.1587 331.564 90.9299 331.564 89.7011 331.564 88.4723 331.564 87.2435 332.792 86.0148 334.02 86.0148 335.248 84.786 336.476 84.786 336.476 83.5572 335.248 83.5572 335.248 82.3284 334.02 82.3284 334.02 81.0996 332.792 81.0996 332.792 79.8708 331.564 79.8708 330.336 79.8708 330.336 78.6421 329.107 78.6421 329.107 77.4133 327.879 77.4133 327.879 76.1845 326.651 76.1845 325.423 76.1845 324.195 76.1845 324.195 74.9557 322.967 74.9557 321.739 74.9557 321.739 73.7269 320.511 73.7269 320.511 72.4982 319.283 72.4982 319.283 71.2694 318.055 71.2694 318.055 70.0406 316.827 70.0406 316.827 68.8118 316.827 67.583 315.599 67.583 315.599 66.3542 314.371 66.3542 314.371 65.1255 313.143 65.1255 314.371 65.1255 313.143 65.1255 311.915 65.1255 310.687 65.1255 310.687 63.8967 310.687 62.6679 310.687 61.4391 310.687 60.2103 310.687 58.9816 310.687 57.7528 310.687 56.524 309.459 56.524 309.459 55.2952 308.231 55.2952 308.231 54.0664 308.231 52.8376 307.003 52.8376 307.003 51.6089 305.775 51.6089 304.547 51.6089 303.319 51.6089 303.319 52.8376 302.091 52.8376 302.091 54.0664 300.863 54.0664 300.863 55.2952 299.635 55.2952 299.635 56.524 298.407 56.524 297.179 56.524 295.951 56.524 295.951 57.7528 294.723 57.7528 293.495 57.7528 292.267 57.7528 292.267 58.9816 292.267 60.2103 291.039 60.2103 291.039 61.4391 289.811 61.4391 289.811 62.6679 289.811 61.4391 288.583 61.4391 288.583 60.2103 287.355 58.9816 287.355 57.7528 287.355 56.524 287.355 55.2952 287.355 54.0664 287.355 51.6089 287.355 50.3801 287.355 49.1513 286.127 49.1513 284.899 49.1513 283.671 49.1513 282.443 49.1513 281.215 49.1513 279.987 49.1513 278.759 49.1513 278.759 50.3801 277.531 50.3801 277.531 51.6089 276.303 51.6089 276.303 52.8376 275.075 52.8376 275.075 51.6089 273.847 51.6089 273.847 52.8376 272.619 52.8376 272.619 51.6089 272.619 50.3801 271.391 50.3801 270.163 50.3801 270.163 51.6089 268.935 51.6089 267.707 51.6089 267.707 52.8376 266.479 52.8376 266.479 54.0664 265.251 54.0664 264.023 54.0664 264.023 55.2952 262.795 55.2952 261.567 55.2952 261.567 56.524 260.339 56.524 260.339 57.7528 259.111 57.7528 257.883 57.7528 256.655 57.7528 255.427 57.7528 254.199 57.7528 252.971 57.7528 251.743 57.7528 250.515 57.7528 249.287 57.7528 245.603 55.2952 244.375 55.2952 243.147 56.524 241.919 56.524 240.691 56.524 239.463 56.524 239.463 55.2952 238.235 55.2952 237.007 55.2952 237.007 54.0664 237.007 52.8376 235.779 52.8376 235.779 51.6089 235.779 50.3801 237.007 50.3801 237.007 49.1513 238.235 49.1513 239.463 49.1513 239.463 47.9225 239.463 46.6937 239.463 45.4649 240.691 45.4649 240.691 44.2362 240.691 43.0074 240.691 41.7786 240.691 40.5498 240.691 39.321 241.919 38.0923 241.919 36.8635 241.919 35.6347 241.919 34.4059 241.919 33.1771 240.691 33.1771 240.691 31.9483 241.919 31.9483 241.919 30.7196 243.147 30.7196 243.147 29.4908 244.375 29.4908 244.375 28.262 245.603 28.262 245.603 27.0332 246.831 27.0332 246.831 25.8044 248.059 25.8044 248.059 24.5756 248.059 23.3469 248.059 22.1181 249.287 22.1181 249.287 20.8893 249.287 19.6605 249.287 18.4317 250.515 18.4317 250.515 17.203 250.515 15.9742 251.743 15.9742 251.743 14.7454 251.743 13.5166 252.971 13.5166 252.971 12.2878 254.199 12.2878 254.199 11.059 254.199 9.83026 252.971 9.83026 252.971 8.60148 251.743 8.60148 250.515 8.60148 250.515 7.37269 249.287 7.37269 248.059 7.37269 246.831 7.37269 246.831 8.60148 246.831 7.37269 245.603 7.37269 244.375 8.60148 243.147 8.60148 241.919 8.60148 241.919 9.83026 240.691 9.83026 240.691 11.059 240.691 12.2878 239.463 11.059 238.235 11.059 237.007 11.059 237.007 9.83026 235.779 9.83026 234.55 9.83026 234.55 8.60148"
                        ></polygon>
                    </g>
                </g>
            </g>
        </svg>
    )
}

export default RaadpleegHome
