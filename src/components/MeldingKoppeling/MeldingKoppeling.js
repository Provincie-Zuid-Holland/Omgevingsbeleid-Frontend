import React, { Component } from 'react'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Class that renders the MeldingKoppeling component, which notifies the user when a connection request for a werkingsgebied is created.
 *
 * @class
 * @extends Component
 */
class MeldingKoppeling extends Component {
    render() {
        return (
            <div className="bg-white rounded shadow p-4 mb-4">
                <div className="flex items-center justify-start">
                    <div className="rounded-full bg-pzh-blue w-12 h-12 inline-block text-white flex justify-center items-center">
                        <FontAwesomeIcon className="font-xl" icon={faLink} />
                    </div>
                    <h3 className="inline-block font-bold text-lg ml-4 text-gray-800">
                        Aanvraag koppeling
                    </h3>
                    <span className="absolute right-0 text-gray-600 mr-16 text-sm">
                        2 uur geleden
                    </span>
                </div>
                <div className="pl-16 pb-4">
                    <p className="text-gray-800 text-sm">
                        Aanvraag voor koppeling met
                        <span className="font-bold ml-1">
                            Duurzame groei van het toerisme in Zuid-Holland
                        </span>
                    </p>
                    <div className="border-l-4 bg-purple-100 border-purple-900 mt-4 mb-6 p-4 relative">
                        <h4 className="font-bold text-gray-800">
                            Grondwaterkwaliteit en -kwantiteit
                        </h4>
                        <span className="absolute right-0 text-xs top-0 text-gray-700 mt-5 mr-4">
                            4 Februari 2019 - Coen van de Bovenkamp
                        </span>
                        <p className="text-sm mt-2 text-gray-700">
                            "Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat."
                        </p>
                    </div>
                    <span className="bg-pzh-green hover:bg-pzh-green-dark text-white font-bold py-2 px-4 rounded cursor-not-allowed text-sm mr-2">
                        Accepteren
                    </span>
                    <span className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-not-allowed text-sm mr-4">
                        Afwijzen
                    </span>
                </div>
            </div>
        )
    }
}

export default MeldingKoppeling
