import { faTimes, faSearch } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cloneDeep from 'lodash.clonedeep'
import { Component } from 'react'
import { toast } from 'react-toastify'

import { PopUpAnimatedContainer } from '../../../Popup'
import axios from './../../../../API/axios'
import objecten from './../../../../constants/koppelingen'

const getTypeText = type => {
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
 * Displays a popup in which users can create Beleidsrelaties
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
     */
    componentDidMount() {
        window.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault()
            }
        })

        /**
         * Right now the 'Belangen' and 'Taken' are both the same object, but differentiated with a type
         * The object contains the property 'filterAPI' from the 'ObjectenInformatie.js' file.
         * This means we need to filter this based on the active type in state.
         * @param {object} res - Contains the response from the API
         * @returns {array} containing the (filtered) data from the API
         */
        const getResponseData = res => {
            if (objecten[this.state.type].filterAPI === true) {
                return res.data.filter(
                    item => item.Type === objecten[this.state.type].filterType
                )
            } else {
                return res.data
            }
        }

        axios
            .get(objecten[this.state.type].api)
            .then(res => {
                const data = getResponseData(res)
                this.setState({
                    objecten: data,
                    dataLoaded: true,
                })
            })
            .catch(err => {
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
     */
    volgendeScherm() {
        this.setState({
            actievePagina: this.state.actievePagina + 1,
        })
    }

    /**
     * Function to handle change of the user and set the name variable by using the value.
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

    /**
     *
     * @param {string} type - Contains the current active type of object
     * @returns {string} Containing the type and the correct article
     */
    getTypeText(type) {
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
     * Filter objects based on searchQuery and already connected objects
     * @returns {array} containing the filtered objects
     */
    getFilteredObjects = () => {
        const propertyName = objecten[this.state.type].propertyName
        const crudObject = cloneDeep(this.props.crudObject)

        let actieveKoppelingen = []

        if (crudObject[propertyName]) {
            crudObject[propertyName].forEach(item => {
                actieveKoppelingen.push(item.Object.UUID)
            })
        }

        return this.state.objecten
            .filter(
                item =>
                    (item.Type !== 'Lid' &&
                        item.Titel &&
                        item.Titel.toLowerCase().includes(
                            this.state.zoekFilter.toLowerCase()
                        )) ||
                    (item.Type !== 'Lid' &&
                        item.Titel &&
                        item?.Volgnummer?.toLowerCase()?.includes(
                            this.state.zoekFilter.toLowerCase()
                        ))
            )
            .filter(item => !actieveKoppelingen.includes(item.UUID))
    }

    render() {
        const filteredObjecten = this.getFilteredObjects()

        return (
            <PopUpAnimatedContainer>
                <div
                    onClick={this.props.togglePopup}
                    className="absolute top-0 right-0 px-6 py-4 text-gray-600 cursor-pointer"
                    id={`form-field-koppeling-sluit-popup`}>
                    <FontAwesomeIcon icon={faTimes} />
                </div>
                <h3 className="font-bold form-field-label">
                    {objecten[this.state.type].volledigeTitel} koppelen
                </h3>
                {this.state.actievePagina === 1 ? (
                    <>
                        <p className="form-field-description">
                            Zoek en selecteer{' '}
                            {this.getTypeText(this.state.type)} welke je wilt
                            koppelen met de beleidskeuze &apos;
                            {this.props.titelMainObject}&apos;
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
                                    filteredObjecten
                                        .sort((a, b) => {
                                            if (
                                                a.Titel.toUpperCase() <
                                                b.Titel.toUpperCase()
                                            ) {
                                                return -1
                                            } else if (
                                                a.Titel.toUpperCase() >
                                                b.Titel.toUpperCase()
                                            ) {
                                                return 1
                                            } else {
                                                return 0
                                            }
                                        })
                                        .map((item, index) => (
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
                                                id={`form-field-koppeling-item-${index}`}>
                                                <span
                                                    className={`${
                                                        item.Volgnummer
                                                            ? 'w-10 inline-block'
                                                            : ''
                                                    }`}>
                                                    {item.Volgnummer
                                                        ? item.Volgnummer
                                                        : null}
                                                </span>
                                                <span>{item.Titel}</span>
                                            </li>
                                        ))
                                ) : (
                                    <li
                                        className="px-4 py-2 text-sm text-gray-700 cursor-not-allowed"
                                        key="0">
                                        {this.state.dataLoaded ? (
                                            this.state.zoekFilter.length ===
                                            0 ? (
                                                <span className="italic text-gray-600">
                                                    Geen resultaten
                                                </span>
                                            ) : (
                                                <span className="italic text-gray-600">
                                                    Geen resultaten voor &apos;
                                                    {this.state.zoekFilter}
                                                    &apos;
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
                    </>
                ) : null}
                {this.state.actievePagina === 2 ? (
                    <>
                        <p className="form-field-description">
                            Beschrijf de koppeling tussen &apos;
                            {this.state.selected.Titel}&apos; en &apos;
                            {this.props.titelMainObject}&apos;
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
                    </>
                ) : null}
                <div className="flex items-center justify-between mt-6">
                    <span
                        tabIndex="0"
                        className="text-sm text-gray-600 underline cursor-pointer"
                        onClick={this.props.togglePopup}
                        id={`form-field-koppeling-annuleren`}>
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
                            onClick={() => {
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
                            id={`form-field-koppeling-volgende`}>
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
                            onClick={() => {
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
                            id={`form-field-koppeling-koppelen`}>
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
