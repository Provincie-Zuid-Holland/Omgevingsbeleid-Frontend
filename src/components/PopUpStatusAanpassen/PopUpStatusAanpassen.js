import React, { Component } from 'react'
import PopUpAnimatedContainer from './../PopUpAnimatedContainer'

const statusArray = [
    'Ontwerp in concept',
    'Ontwerp (Besluitvorming GS)',
    'Ontwerp Openbaar (Besluitvorming PS)',
    'Ontwerp In Inspraak (huidig)',
    'Definitief ontwerp in concept (logische volgende)',
    'Definitief ontwerp (Besluitvorming GS)',
    'Definitief ontwerp openbaar (Besluitvorming PS)',
    'Vastgesteld',
]

class PopUpStatusAanpassen extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <PopUpAnimatedContainer small={true}>
                <div className="text-gray-800">
                    <h2 className="font-bold mb-4">Status aanpassen</h2>
                    <div className="mb-5 m-border-color border-l-2 bg-purple-100 border-purple-700 p-4 font-semibold">
                        Binnenkort mogelijk
                    </div>
                    <div className="inline-block relative w-64">
                        <select
                            required
                            value={this.props.fieldValue}
                            onChange={this.props.handleChange}
                            name={this.props.dataObjectProperty}
                            className="appearance-none block w-full text-gray-700 border bg-white border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500"
                        >
                            <option disabled value=" - selecteer een optie - ">
                                {' '}
                                - selecteer een optie -{' '}
                            </option>
                            {statusArray.map((arrayItem, index) => {
                                return (
                                    <option key={index} value={arrayItem}>
                                        {arrayItem}
                                    </option>
                                )
                            })}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex justify-between mt-5 items-center text-sm">
                        <div
                            className="underline text-gray-600 cursor-pointer"
                            onClick={this.props.toggleStatusPopup}
                        >
                            Annuleren
                        </div>
                        <div className="bg-green-500 px-8 py-2 text-white rounded font-semibold cursor-not-allowed">
                            Aanpassen
                        </div>
                    </div>
                </div>
            </PopUpAnimatedContainer>
        )
    }
}

export default PopUpStatusAanpassen
