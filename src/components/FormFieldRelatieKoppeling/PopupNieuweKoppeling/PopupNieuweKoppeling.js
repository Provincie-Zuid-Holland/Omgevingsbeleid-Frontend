import React, { Component } from 'react'
import axios from './../../../API/axios'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'

import PopUpAnimatedContainer from './../../PopUpAnimatedContainer'
import objecten from './../../../constants/koppelingen'

const getTypeText = (type) => {
    switch (type) {
        case 'belangen':
            return 'het belang'
        case 'taken':
            return 'de taak'
        case 'ambities':
            return 'de ambitie'
        case 'beleidsdoelen':
            return 'het beleidsdoel'
        case 'themas':
            return 'het thema'
        case 'beleidsregels':
            return 'de beleidsregel'
        case 'beleidsprestaties':
            return 'de beleidsprestatie'
        case 'maatregelen':
            return 'de maatregel'
        case 'verordening':
            return 'de verordening'
        default:
            return 'het object'
    }
}

/**
 * Class that renders the PopupNieuweKoppeling component in a imported PopUpAnimatedContainer,
 * in which the user on the first page searches a koppeltekst which they want to connect to the beleidskeuze.
 * On the second page the user describes the relationship between the koppeltekst value and the beleidskeuze.
 *
 */
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

    /**
     * Function that adds the EventListener keypress "Enter".
     *
     *
     */
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

    /**
     * Function to setState of the selected state within the function.
     *
     *
     *
     * @param {object} object - Parameter used as an value of the selected state within the function.
     */
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

    /**
     * Function to set the state of the actievePagina variable with a new value.
     *
     *
     */
    volgendeScherm() {
        this.setState({
            actievePagina: this.state.actievePagina + 1,
        })
    }

    /**
     * Function to handle change of the user and set the name variable by using the value.
     *
     *
     *
     * @param {e} e - Parameter that is used to catch any changes given by the user.
     */
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

        let typeText = getTypeText(this.state.type)

        return (
            <PopUpAnimatedContainer>
                <div
                    onClick={this.props.togglePopup}
                    className="absolute top-0 right-0 px-6 py-4 text-gray-600 cursor-pointer"
                    id={`form-field-koppeling-sluit-popup`}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="font-bold form-field-label">
                    {objecten[this.state.type].volledigeTitel} koppelen
                </h3>
                {this.state.actievePagina === 1 ? (
                    <React.Fragment>
                        <p className="form-field-description">
                            Zoek en selecteer {typeText} welke je wilt koppelen
                            met de beleidskeuze '{this.props.titelMainObject}'
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
                                    filteredObjecten.map((item, index) => (
                                        <li
                                            onClick={() => {
                                                this.selectObject(item)
                                            }}
                                            className={`px-4 py-2 text-sm text-gray-700 cursor-pointer ${
                                                this.state.selected === item
                                                    ? 'bg-gray-100 font-bold'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                            key={item.UUID}
                                            id={`form-field-koppeling-item-${index}`}
                                        >
                                            {item.Titel}
                                        </li>
                                    ))
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
                        <div className="px-4 py-4 my-4 text-sm text-gray-700 border-l-4 bg-pzh-blue-super-light border-pzh-blue">
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
                            aria-label="beschrijving"
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
                            className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-pzh-green text-white ${
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
                            className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-pzh-green text-white ${
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
export { getTypeText }
