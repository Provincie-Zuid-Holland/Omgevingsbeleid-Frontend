import React, { Component } from 'react'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopUpAnimatedContainer from './../../PopUpAnimatedContainer'

/**
 * @returns Component where a user can edit an existing connection
 */
class PopUpBewerkKoppeling extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            objecten: [],
            selected: null,
            omschrijving:
                this.props.bewerkItem.item.Koppeling_Omschrijving || '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

    /**
     * Function that sets the value variable to the name variable, based on the e.target values.
     *
     *
     * @param {Event & { target: HTMLInputElement }} e
     */
    handleChange(e) {
        const name = e.target.name
        const value = e.target.value

        this.setState({
            [name]: value,
        })
    }

    render() {
        return (
            <PopUpAnimatedContainer>
                <div
                    onClick={this.props.togglePopup}
                    className="absolute top-0 right-0 px-6 py-4 text-gray-600 cursor-pointer"
                    id={`form-field-koppeling-sluit-popup`}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="font-bold form-field-label">koppelen</h3>

                <p className="form-field-description">
                    Beschrijf de koppeling tussen '
                    {this.props.bewerkItem.item.Object.Titel}' en de
                    beleidskeuze '{this.props.titelMainObject}'
                </p>
                <p className="mt-4 form-field-description">
                    Beschrijf zo concreet mogelijk de relatie
                </p>
                <textarea
                    id={`form-field-koppeling-beschrijving`}
                    value={this.state.omschrijving}
                    required
                    onChange={this.handleChange}
                    name="omschrijving"
                    className="block w-full h-24 px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500"
                    type="text"
                />
                <div className="flex items-center justify-between mt-6">
                    <div>
                        <span
                            tabIndex="0"
                            className="text-sm text-gray-600 underline cursor-pointer"
                            onClick={this.props.togglePopup}
                            id="form-field-koppeling-annuleren"
                        >
                            Annuleren
                        </span>
                        <span
                            tabIndex="0"
                            className="ml-4 text-sm text-red-600 underline cursor-pointer"
                            id="form-field-koppeling-verwijderen"
                            onClick={() => {
                                this.props.verwijderKoppelingRelatie(
                                    this.props.bewerkItem
                                )
                                this.props.togglePopup()
                            }}
                        >
                            Verwijderen
                        </span>
                    </div>

                    <div
                        className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-pzh-green text-white ${
                            this.state.omschrijving.length === 0
                                ? `cursor-not-allowed opacity-50`
                                : `hover:underline`
                        }`}
                        tabIndex="0"
                        onClick={(e) => {
                            if (this.state.omschrijving.length > 0) {
                                this.props.wijzigKoppelingRelatie(
                                    this.props.bewerkItem,
                                    this.state.omschrijving
                                )
                                this.props.togglePopup()
                            } else {
                                return
                            }
                        }}
                        onKeyPress={(e) => {
                            if (
                                e.key === 'Enter' &&
                                this.state.omschrijving.length > 0
                            ) {
                                this.props.wijzigKoppelingRelatie(
                                    this.props.bewerkItem,
                                    this.state.omschrijving
                                )
                                this.props.togglePopup()
                            }
                        }}
                        id="form-field-koppeling-wijzigen"
                    >
                        Wijzigen
                    </div>
                </div>
            </PopUpAnimatedContainer>
        )
    }
}

export default PopUpBewerkKoppeling
