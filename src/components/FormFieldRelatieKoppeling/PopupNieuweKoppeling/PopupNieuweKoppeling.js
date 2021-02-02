import React, { Component } from 'react'
import axios from './../../../API/axios'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'

import PopUpAnimatedContainer from './../../PopUpAnimatedContainer'
import objecten from './../../../constants/koppelingen'

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
        window.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
            }
        })

        axios
            .get(objecten[this.state.type].api)
            .then((res) => {
                // Belang en Taak moeten gefilterd worden
                // Anders const de objecten array zonder het eerste array item
                let responseObjecten
                if (objecten[this.state.type].filterAPI === true) {
                    responseObjecten = res.data.filter(
                        (item) =>
                            item.Type === objecten[this.state.type].filterType
                    )
                } else {
                    responseObjecten = res.data
                }

                this.setState({
                    objecten: responseObjecten,
                    dataLoaded: true,
                })
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
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

        if (crudObject[propertyName]) {
            crudObject[propertyName].forEach((item) => {
                actieveKoppelingen.push(item.UUID)
            })
        }

        const filteredObjecten = this.state.objecten
            .filter(
                (item) =>
                    item.Type !== 'Lid' &&
                    item.Titel &&
                    item.Titel.toLowerCase().includes(
                        this.state.zoekFilter.toLowerCase()
                    )
            )
            .filter((item) => !actieveKoppelingen.includes(item.UUID))

        let koppelTekst = ''
        switch (this.state.type) {
            case 'belangen':
                koppelTekst = 'het belang'
                break
            case 'taken':
                koppelTekst = 'de taak'
                break
            case 'ambities':
                koppelTekst = 'de ambitie'
                break
            case 'opgaven':
                koppelTekst = 'de opgave'
                break
            case 'beleidsdoelen':
                koppelTekst = 'het beleidsdoel'
                break
            case 'themas':
                koppelTekst = 'het thema'
                break
            case 'beleidsregels':
                koppelTekst = 'de beleidsregel'
                break
            case 'doelen':
                koppelTekst = 'de beleidsprestatie'
                break
            case 'beleidsprestaties':
                koppelTekst = 'de beleidsprestatie'
                break
            case 'maatregelen':
                koppelTekst = 'de maatregel'
                break
            case 'verordening':
                koppelTekst = 'de verordening'
                break
            default:
                koppelTekst = 'het object'
                break
        }

        return (
            <PopUpAnimatedContainer>
                <div
                    onClick={this.props.togglePopup}
                    className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                    id={`form-field-koppeling-sluit-popup`}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="form-field-label">
                    {objecten[this.state.type].volledigeTitel} koppelen
                </h3>
                {this.state.actievePagina === 1 ? (
                    <React.Fragment>
                        <p className="form-field-description">
                            Zoek en selecteer {koppelTekst} welke je wilt
                            koppelen met de beleidskeuze '
                            {this.props.titelMainObject}'
                        </p>
                        <div className="relative block w-full mt-4 mb-6">
                            <input
                                onChange={this.handleChange}
                                value={this.state.zoekFilter}
                                className="block w-full py-3 pl-4 pr-12 text-sm leading-tight text-gray-700 border border-gray-400 rounded shadow appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                                id={`form-field-koppeling-zoekbalk`}
                                type="text"
                                name="zoekFilter"
                                placeholder="Zoeken... (typ minimaal 3 karakters)"
                            />
                            <FontAwesomeIcon
                                className="absolute top-0 right-0 mt-4 mr-4 text-sm text-gray-600"
                                icon={faSearch}
                            />
                        </div>
                        <div className="border rounded shadow">
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
                                                    className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-100 cursor-pointer "
                                                    key={item.UUID}
                                                    id={`form-field-koppeling-item-${index}`}
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
                                                    className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                                    key={item.UUID}
                                                    id={`form-field-koppeling-item-${index}`}
                                                >
                                                    {item.Titel}
                                                </li>
                                            )
                                        }
                                    })
                                ) : (
                                    <li
                                        className="px-4 py-2 text-sm text-gray-700 cursor-not-allowed"
                                        key="0"
                                    >
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
                                            <span className="italic text-gray-600 loading">
                                                {
                                                    objecten[this.state.type]
                                                        .volledigeTitelMeervoud
                                                }{' '}
                                                laden...
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
                            Beschrijf de koppeling tussen '
                            {this.state.selected.Titel}' en '
                            {this.props.titelMainObject}'
                        </p>
                        <div className="px-4 py-4 my-4 text-sm text-gray-700 border-l-4 mbg-color-lighter m-border-color">
                            Om er voor te zorgen dat de aangebrachte koppeling
                            daadwerkelijk van waarde is, vragen we je om de
                            koppeling te beschrijven.
                        </div>
                        <p className="mt-4 form-field-description">
                            Beschrijf zo concreet mogelijk de relatie
                        </p>
                        <textarea
                            value={this.state.beschrijving}
                            required
                            onChange={this.handleChange}
                            id={`form-field-koppeling-beschrijving`}
                            name="beschrijving"
                            className="block w-full h-24 px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500"
                            type="text"
                        />
                    </React.Fragment>
                ) : null}
                <div className="flex items-center justify-between mt-6">
                    <span
                        tabIndex="0"
                        className="text-sm text-gray-600 underline cursor-pointer"
                        onClick={this.props.togglePopup}
                        id={`form-field-koppeling-annuleren`}
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
                            onClick={(e) => {
                                if (this.state.selected !== null) {
                                    this.volgendeScherm()
                                } else {
                                    return
                                }
                            }}
                            onKeyPress={(e) => {
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
                            id={`form-field-koppeling-volgende`}
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
                            onClick={(e) => {
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
                            onKeyPress={(e) => {
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
                            id={`form-field-koppeling-koppelen`}
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
