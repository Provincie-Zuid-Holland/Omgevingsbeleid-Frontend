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
        axios
            .get(objecten.beleidsbeslissing.api)
            .then(res => {
                // Belang en Taak moeten gefilterd worden
                // Anders const de objecten array zonder het eerste array item
                let responseObjecten
                if (objecten[this.state.type].filterAPI === true) {
                    responseObjecten = res.data.slice(1).filter(item => {
                        if (
                            item.Type === objecten[this.state.type].filterType
                        ) {
                            return item
                        }
                    })
                } else {
                    responseObjecten = res.data.slice(1)
                }

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
        const propertyName = objecten[this.state.type].propertyName
        const crudObject = JSON.parse(JSON.stringify(this.props.crudObject))
        let actieveKoppelingen = []
        crudObject[propertyName].forEach(item => {
            actieveKoppelingen.push(item.UUID)
        })

        const filteredObjecten = this.state.objecten
            .filter(item =>
                item.Titel.toLowerCase().includes(
                    this.state.zoekFilter.toLowerCase()
                )
            )
            .filter(item => !actieveKoppelingen.includes(item.UUID))

        return (
            <PopUpAnimatedContainer>
                <div
                    onClick={this.props.togglePopup}
                    className="cursor-pointer absolute right-0 top-0 text-gray-600 px-3 py-2"
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="form-field-label">
                    {objecten[this.state.type].volledigeTitel} koppelen
                </h3>
                {this.state.actievePagina === 1 ? (
                    <React.Fragment>
                        <p className="form-field-description">
                            Zoek en selecteer het nationaal welke je wilt
                            koppelen met de beleidsbeslissing '
                            {this.props.titelMainObject}'
                        </p>
                        <div className="w-full block relative mt-4 mb-6">
                            <input
                                onChange={this.handleChange}
                                value={this.state.zoekFilter}
                                className="appearance-none w-full block text-gray-700 border border-gray-400 rounded py-3 pl-4 pr-12 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500 shadow text-sm"
                                id="titel"
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
                                            'Geen resultaten'
                                        ) : (
                                            <span className="loading">
                                                {
                                                    objecten[this.state.type]
                                                        .volledigeTitelMeervoud
                                                }{' '}
                                                laden
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
                    >
                        Annuleren
                    </span>
                    {this.state.actievePagina === 1 ? (
                        <div
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
                            onKeyPress={e => {
                                if (
                                    e.key === 'Enter' &&
                                    this.state.beschrijving.length > 0
                                ) {
                                    this.props.voegKoppelingRelatieToe(
                                        objecten[this.state.type].propertyName,
                                        this.state.selected,
                                        this.state.beschrijving
                                    )
                                    this.props.togglePopup()
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
                                        objecten[this.state.type].propertyName,
                                        this.state.selected,
                                        this.state.beschrijving
                                    )
                                    this.props.togglePopup()
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
                                        objecten[this.state.type].propertyName,
                                        this.state.selected,
                                        this.state.beschrijving
                                    )
                                    this.props.togglePopup()
                                }
                            }}
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
