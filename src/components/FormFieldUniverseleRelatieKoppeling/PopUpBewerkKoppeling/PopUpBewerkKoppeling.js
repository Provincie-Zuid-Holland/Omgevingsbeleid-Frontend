import React, { Component } from 'react'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopUpAnimatedContainer from './../../PopUpAnimatedContainer'

class PopUpBewerkKoppeling extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            objecten: [],
            selected: null,
            omschrijving: this.props.bewerkItem.item.Omschrijving || '',
        }
        this.handleChange = this.handleChange.bind(this)
    }

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
                    className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                    id={`form-field-koppeling-sluit-popup`}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="form-field-label">koppelen</h3>

                <p className="form-field-description">
                    Beschrijf de koppeling tussen het nationaal belang '
                    {this.props.bewerkItem.item.data.Titel}' en de
                    beleidsbeslissing '{this.props.titelMainObject}'
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
                                this.props.verwijderKoppelingFromLocalState(
                                    this.props.bewerkItem
                                )
                                this.props.togglePopup()
                            }}
                        >
                            Verwijderen
                        </span>
                    </div>

                    <div
                        className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-green-600 text-white ${
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
                                this.props.wijzigKoppelingRelatieFromLocalState(
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
                                this.props.wijzigKoppelingRelatieFromLocalState(
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
