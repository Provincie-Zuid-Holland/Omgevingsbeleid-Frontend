import React, { Component } from 'react'

// Import Icons
import { faPeopleCarry, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class AandachtsPuntenEigenaarOverdracht extends Component {
    render() {
        return (
            <div className="bg-white rounded shadow p-4 mb-4">
                <div className="flex items-center justify-start">
                    <div className="rounded-full mbg-color w-12 h-12 inline-block text-white flex justify-center items-center">
                        <FontAwesomeIcon icon={faPeopleCarry} />
                    </div>
                    <h3 className="inline-block font-bold text-lg ml-4 text-gray-800">
                        Verzoek tot overdracht eigenaarschap
                    </h3>
                    <span className="absolute right-0 text-gray-600 font-thin mr-16 text-sm">
                        1 dag geleden
                    </span>
                </div>
                <div className="pl-16 pb-4">
                    <p className="text-gray-800 text-sm">
                        <span className="font-bold mr-1">Tom van Gelder</span>
                        wil het 1e eigenaarschap van de beleidsbeslissing
                        <span className="font-bold ml-1 mr-1">
                            Duurzame groei van het toerisme in Zuid-Holland
                        </span>
                        aan je overdragen.
                    </p>
                    <div className="mt-4 mb-2 py-4 flex justify-start items-center">
                        <div className="rounded shadow p-2 flex justify-start items-center pr-4">
                            <div className="bg-orange-500 rounded-full h-12 w-12 inline-block mr-2" />
                            <div className="flex flex-col">
                                <span className="line-through text-gray-700 text-xs block">
                                    Eigenaar 1
                                </span>
                                <span className="font-bold text-lg text-gray-800 block">
                                    Tom van Gelder
                                </span>
                            </div>
                        </div>
                        <FontAwesomeIcon
                            className="font-xl mx-4 text-gray-700"
                            icon={faArrowRight}
                        />
                        <div className="rounded shadow p-2 flex justify-start items-center pr-4">
                            <div className="bg-yellow-500 rounded-full h-12 w-12 inline-block mr-2" />
                            <div className="flex flex-col">
                                <span className="text-gray-700 text-xs block">
                                    Eigenaar 2
                                </span>
                                <span className="font-bold text-lg text-gray-800 block">
                                    Coen van Bovenkamp
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-700 mb-4">
                            Wil je dit eigenaarschap accepteren?
                        </p>
                        <span className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed text-sm mr-2">
                            Accepteren
                        </span>
                        <span className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed text-sm mr-4">
                            Afwijzen
                        </span>
                        <span className="text-gray-700 text-sm underline cursor-not-allowed text-sm hover:text-gray-900">
                            Melding verbergen
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default AandachtsPuntenEigenaarOverdracht
