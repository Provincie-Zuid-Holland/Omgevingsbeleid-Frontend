import React, { Component } from 'react'
import axios from './../../../API/axios'
import {
    faCaretDown,
    faAngleDown,
    faTimes,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopUpAnimatedContainer from './../../PopUpAnimatedContainer'
import objecten from './../ObjectenInformatie'

class PopupNieuweKoppeling extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            objecten: [],
            selected: null,
            beschrijving: '',
            zoekFilter: '',
            actievePagina: 1,
            dataLoaded: false,
        }
        this.volgendeScherm = this.volgendeScherm.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        // Get Beleidsbeslissingen om koppelingen mee te maken
        axios
            .get('/beleidsbeslissingen')
            .then(res => {
                const responseObjecten = res.data.slice(1)
                console.log(responseObjecten)

                this.setState({
                    objecten: responseObjecten,
                    dataLoaded: true,
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    dataLoaded: true,
                })
            })
    }

    selectObject(object) {
        if (this.state.selected === object) {
            this.setState({
                selected: null,
            })
        } else {
            this.setState({
                selected: object,
            })
        }
    }

    volgendeScherm() {
        this.setState({
            actievePagina: this.state.actievePagina + 1,
        })
    }

    handleChange(e) {
        const name = e.target.name
        const value = e.target.value

        this.setState({
            [name]: value,
        })
    }

    render() {
        const filteredObjecten = this.state.objecten.filter(item =>
            item.Titel.toLowerCase().includes(
                this.state.zoekFilter.toLowerCase()
            )
        )
        console.log(this.state)
        return (
            <PopUpAnimatedContainer>
                <div
                    onClick={this.props.togglePopup}
                    className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
                    id={`form-field-beleidsrelatie-sluit-popup`}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="form-field-label">Beleidsrelatie toevoegen</h3>
                {this.state.actievePagina === 1 ? (
                    <React.Fragment>
                        <p className="form-field-description">
                            Zoek en selecteer de beleidsbeslissing waarmee '
                            {this.props.titelMainObject}' een koppeling heeft
                        </p>
                        <div className="w-full block relative mt-4 mb-6">
                            <input
                                onChange={this.handleChange}
                                value={this.state.zoekFilter}
                                className="appearance-none w-full block text-gray-700 border border-gray-400 rounded py-3 pl-4 pr-12 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500 shadow text-sm"
                                id={`form-field-beleidsrelatie-zoekbalk`}
                                type="text"
                                name="zoekFilter"
                                placeholder="Zoeken... (typ minimaal 3 karakters)"
                            />
                            <FontAwesomeIcon
                                className="absolute right-0 top-0 mr-4 mt-4 text-gray-600 text-sm"
                                icon={faSearch}
                            />
                        </div>
                        <div className="shadow border rounded">
                            <ul className="flex-row overflow-y-auto popup-results-list">
                                {this.state.objecten &&
                                filteredObjecten.length > 0 ? (
                                    filteredObjecten.map((item, index) => {
                                        if (this.state.selected === item) {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        this.selectObject(item)
                                                    }}
                                                    id={`form-field-beleidsrelatie-item-${index}`}
                                                    className="text-sm text-gray-700 px-4 py-2 cursor-pointer bg-gray-100 font-bold "
                                                    key={item.UUID}
                                                >
                                                    {item.Titel}
                                                </li>
                                            )
                                        } else {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        this.selectObject(item)
                                                    }}
                                                    id={`form-field-beleidsrelatie-item-${index}`}
                                                    className="text-sm text-gray-700 px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                    key={item.UUID}
                                                >
                                                    {item.Titel}
                                                </li>
                                            )
                                        }
                                    })
                                ) : (
                                    <li
                                        className="text-sm text-gray-700 px-4 py-2 cursor-not-allowed"
                                        key="0"
                                    >
                                        {console.log(this.state.dataLoaded)}
                                        {this.state.dataLoaded ? (
                                            this.state.zoekFilter.length ===
                                            0 ? (
                                                <span className="italic text-gray-600">
                                                    Geen resultaten
                                                </span>
                                            ) : (
                                                <span className="italic text-gray-600">
                                                    Geen resultaten voor '
                                                    {this.state.zoekFilter}'
                                                </span>
                                            )
                                        ) : (
                                            <span className="loading italic text-gray-600">
                                                Beleidsbeslissingen laden...
                                            </span>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </React.Fragment>
                ) : null}
                {this.state.actievePagina === 2 ? (
                    <React.Fragment>
                        <p className="form-field-description">
                            Beschrijf de koppeling tussen het nationaal belang '
                            {this.state.selected.Titel}' en de beleidsbeslissing
                            '{this.props.titelMainObject}'
                        </p>
                        <div className="mbg-color-lighter m-border-color border-l-4 px-4 py-4 my-4 text-sm text-gray-700">
                            Om er voor te zorgen dat de aangebrachte koppeling
                            daadwerkelijk van waarde is, vragen we je om de
                            koppeling te beschrijven.
                        </div>
                        <p className="form-field-description mt-4">
                            Beschrijf zo concreet mogelijk de relatie
                        </p>
                        <textarea
                            id={`form-field-beleidsrelatie-beschrijving`}
                            value={this.state.beschrijving}
                            required
                            onChange={this.handleChange}
                            name="beschrijving"
                            className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500 h-24"
                            type="text"
                        />
                    </React.Fragment>
                ) : null}
                <div className="flex justify-between items-center mt-6">
                    <span
                        tabIndex="0"
                        className="text-gray-600 cursor-pointer text-sm underline"
                        onClick={this.props.togglePopup}
                        id={`form-field-beleidsrelatie-annuleren`}
                    >
                        Annuleren
                    </span>
                    {this.state.actievePagina === 1 ? (
                        <div
                            id={`form-field-beleidsrelatie-volgende`}
                            className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-green-600 text-white ${
                                this.state.selected === null
                                    ? `cursor-not-allowed opacity-50`
                                    : `hover:underline`
                            }`}
                            tabIndex="0"
                            onClick={e => {
                                if (this.state.selected !== null) {
                                    this.volgendeScherm()
                                } else {
                                    return
                                }
                            }}
                        >
                            Volgende
                        </div>
                    ) : (
                        <div
                            className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-green-600 text-white ${
                                this.state.beschrijving.length === 0
                                    ? `cursor-not-allowed opacity-50`
                                    : `hover:underline`
                            }`}
                            tabIndex="0"
                            onClick={e => {
                                if (this.state.beschrijving.length > 0) {
                                    this.props.voegKoppelingRelatieToe(
                                        this.state.selected,
                                        this.state.beschrijving
                                    )
                                } else {
                                    return
                                }
                            }}
                            onKeyPress={e => {
                                if (
                                    e.key === 'Enter' &&
                                    this.state.beschrijving.length > 0
                                ) {
                                    this.props.voegKoppelingRelatieToe(
                                        this.state.selected,
                                        this.state.beschrijving
                                    )
                                }
                            }}
                            id={`form-field-beleidsrelatie-koppelen`}
                        >
                            Koppelen
                        </div>
                    )}
                </div>
            </PopUpAnimatedContainer>
        )
    }
}

export default PopupNieuweKoppeling
