import React, { Component } from 'react'
import { faPeopleCarry, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class CardEigenaarOverdracht extends Component {
    render() {
        return (
            <div className="p-4 mb-4 bg-white rounded shadow">
                <div className="flex items-center justify-start">
                    <div className="flex items-center justify-center inline-block w-12 h-12 text-white rounded-full mbg-color">
                        <FontAwesomeIcon icon={faPeopleCarry} />
                    </div>
                    <h3 className="inline-block ml-4 text-lg font-bold text-gray-800">
                        Verzoek tot overdracht eigenaarschap
                    </h3>
                    <span className="absolute right-0 mr-16 text-sm font-thin text-gray-600">
                        1 dag geleden
                    </span>
                </div>
                <div className="pb-4 pl-16">
                    <p className="text-sm text-gray-800">
                        <span className="mr-1 font-bold">Tom van Gelder</span>
                        wil het 1e eigenaarschap van de beleidskeuze
                        <span className="ml-1 mr-1 font-bold">
                            Duurzame groei van het toerisme in Zuid-Holland
                        </span>
                        aan je overdragen.
                    </p>
                    <div className="flex items-center justify-start py-4 mt-4 mb-2">
                        <div className="flex items-center justify-start p-2 pr-4 rounded shadow">
                            <div className="inline-block w-12 h-12 mr-2 bg-orange-500 rounded-full" />
                            <div className="flex flex-col">
                                <span className="block text-xs text-gray-700 line-through">
                                    Eigenaar 1
                                </span>
                                <span className="block text-lg font-bold text-gray-800">
                                    Tom van Gelder
                                </span>
                            </div>
                        </div>
                        <FontAwesomeIcon
                            className="mx-4 text-gray-700 font-xl"
                            icon={faArrowRight}
                        />
                        <div className="flex items-center justify-start p-2 pr-4 rounded shadow">
                            <div className="inline-block w-12 h-12 mr-2 bg-yellow-500 rounded-full" />
                            <div className="flex flex-col">
                                <span className="block text-xs text-gray-700">
                                    Eigenaar 2
                                </span>
                                <span className="block text-lg font-bold text-gray-800">
                                    Coen van Bovenkamp
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="mb-4 text-sm text-gray-700">
                            Wil je dit eigenaarschap accepteren?
                        </p>
                        <span className="px-4 py-2 mr-2 text-sm font-bold text-white bg-green-600 rounded cursor-not-allowed hover:bg-green-700">
                            Accepteren
                        </span>
                        <span className="px-4 py-2 mr-4 text-sm font-bold text-white bg-red-600 rounded cursor-not-allowed hover:bg-red-700">
                            Afwijzen
                        </span>
                        <span className="text-sm text-gray-700 underline cursor-not-allowed hover:text-gray-900">
                            Melding verbergen
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default CardEigenaarOverdracht
