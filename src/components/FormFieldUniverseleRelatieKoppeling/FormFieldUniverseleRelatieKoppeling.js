import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from './../../API/axios'
import { toast } from 'react-toastify'

import {
    faCaretDown,
    faAngleDown,
    faTimes,
    faSearch,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSpring, animated } from 'react-spring'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

const objecten = {
    belangen: {
        buttonTekst: 'belang',
        volledigeTitel: 'Nationaal Belang',
        api: '/belangen',
        filterAPI: true,
        filterType: 'Nationaal Belang',
        propertyName: 'Belangen',
        type: 'Nationaal Belang',
    },
    taken: {
        buttonTekst: 'taak',
        volledigeTitel: 'Wettelijke taken & bevoegdheden',
        api: '/belangen',
        filterAPI: true,
        filterType: 'Wettelijke Taak & Bevoegdheid',
        propertyName: 'Belangen',
        type: 'Wettelijke Taak & Bevoegdheid',
    },
    ambities: {
        buttonTekst: 'ambities',
        volledigeTitel: 'Ambities',
        api: '/ambities',
        propertyName: 'Ambities',
        type: 'Ambitie',
    },
    themas: {
        buttonTekst: 'Themas',
        volledigeTitel: 'Themas',
        api: '/themas',
        propertyName: 'Themas',
        type: 'Thema',
    },
    doelen: {
        buttonTekst: 'doelen',
        volledigeTitel: 'Doelen',
        api: '/doelen',
        propertyName: 'Doelen',
        type: 'Doel',
    },
    maatregelen: {
        buttonTekst: 'maatregelen',
        volledigeTitel: 'Maatregelen',
        api: '/maatregelen',
        propertyName: 'Maatregelen',
        type: 'Maatregel',
    },
    verordening: {
        buttonTekst: 'verordeningen',
        volledigeTitel: 'Verordening',
        api: '/verordeningen',
        propertyName: 'Verordening',
        type: 'Verordening',
    },
    beleidsRegels: {
        buttonTekst: 'beleidsregels',
        volledigeTitel: 'Beleidsregels',
        api: '/beleidsregels',
        propertyName: 'Beleidsregels',
        type: 'Beleidsregel',
    },
}

class FormFieldUniverseleRelatieKoppeling extends Component {
    // State:
    // selected - bevat het geselecteerde object als de gebruiker op een item in de dropdown klikt
    // koppelingenRelaties - bevat de koppeling & relatie objecten en voegt hier een data property aan toe met API data van dat object
    constructor(props) {
        super(props)
        this.state = {
            selected: [],
            buttonOpen: false,
            popupOpen: false,
            koppelingenRelaties: null,
            dataFromAPILoaded: false,
        }
        this.button = React.createRef()
        this.dropdown = React.createRef()
        this.toggleButton = this.toggleButton.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.togglePopup = this.togglePopup.bind(this)
        this.savekoppelingenRelatiesNaarState = this.savekoppelingenRelatiesNaarState.bind(
            this
        )
        this.saveNieuwekoppelingRelatieNaarState = this.saveNieuwekoppelingRelatieNaarState.bind(
            this
        )
    }

    toggleButton() {
        this.setState({
            buttonOpen: !this.state.buttonOpen,
        })
    }

    handleClickOutside(e) {
        if (this.dropdown.current && this.button.current.contains(e.target)) {
            return
        } else if (this.dropdown.current && e.target !== this.button.current) {
            this.setState({
                buttonOpen: false,
            })
        }
    }

    togglePopup(type) {
        if (this.state.popupOpen !== true) {
            this.setState({
                popupOpen: !this.state.popupOpen,
                popupType: type,
            })
        } else {
            this.setState({
                popupOpen: !this.state.popupOpen,
                popupType: null,
            })
        }
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClickOutside, false)
    }

    componentWillUnmount() {
        document.removeEventListener(
            'mousedown',
            this.handleClickOutside,
            false
        )
    }

    componentDidMount() {
        // We krijgen vanuit de props van het crudObject met de huidige data
        // Ook krijgen we de koppelingRelatieArray waarin de propertyNames om te bewerken in dit component
        // Vervolgens moeten we API calls doen om de laatste data terug te krijgen op basis van de UUID

        // crudObject met alle huidige data
        const crudObject = { ...this.props.crudObject }

        // Bevat de properties van het crudObject die hierin bewerkt moeten worden
        const koppelingRelatieArray = this.props.koppelingRelatieArray

        // Maakt een array om te kijken of 1 van de properties op het crudObject al data heeft
        let actieveKoppelingOfRelaties = []

        // Stopt de actieve koppelingen property names in een array en roept de functie savekoppelingenRelatiesNaarState()
        koppelingRelatieArray.forEach(item => {
            const propertyName = objecten[item].propertyName
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName].length > 0
            ) {
                actieveKoppelingOfRelaties.push(objecten[item].propertyName)
            }
        })

        if (
            actieveKoppelingOfRelaties !== undefined &&
            actieveKoppelingOfRelaties.length > 0
        ) {
            this.savekoppelingenRelatiesNaarState(actieveKoppelingOfRelaties)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props === prevProps || this.state === prevState) {
            return
        }

        // crudObject met alle huidige data
        const crudObject = { ...this.props.crudObject }

        // Bevat de properties van het crudObject die hierin bewerkt moeten worden
        const koppelingRelatieArray = this.props.koppelingRelatieArray

        // Maakt een array om te kijken of 1 van de properties op het crudObject al data heeft
        let actieveKoppelingOfRelaties = []

        // Stopt de actieve koppelingen property names in een array en roept de functie savekoppelingenRelatiesNaarState()
        koppelingRelatieArray.forEach(item => {
            const propertyName = objecten[item].propertyName
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName].length > 0
            ) {
                actieveKoppelingOfRelaties.push(objecten[item].propertyName)
            }
        })

        let arrayMetNieuweObjecten = []
        actieveKoppelingOfRelaties.map(item => {
            this.props.crudObject[item].map(object => {
                const omschrijving = object.omschrijving
                const UUID = object.UUID
                let newItemBool = false
                if (
                    this.state.koppelingenRelaties === null ||
                    this.state.koppelingenRelaties[item] === null
                ) {
                    newItemBool = true
                } else {
                    const newItemBool =
                        this.state.koppelingenRelaties[item] &&
                        this.state.koppelingenRelaties[item].find(
                            item => item.UUID === UUID
                        ) === undefined
                }
                if (newItemBool) {
                    console.log('New Item:')
                    console.log(item)
                    console.log(objecten)
                    this.saveNieuwekoppelingRelatieNaarState({
                        UUID: UUID,
                        propertyName: item,
                        omschrijving: omschrijving,
                    })
                }
            })
        })
    }

    saveNieuwekoppelingRelatieNaarState(nieuweKoppelingRelatieObject) {
        const propertyName = nieuweKoppelingRelatieObject.propertyName
        const UUID = nieuweKoppelingRelatieObject.UUID
        const omschrijving = nieuweKoppelingRelatieObject.omschrijving

        let nieuweKoppelingRelatieState = { ...this.state.koppelingenRelaties }

        axios
            .get(`${objecten[propertyName.toLowerCase()].api}/version/${UUID}`)
            .then(res => {
                console.log('res!')
                console.log(res)
                console.log('propertyName:')
                console.log(propertyName)
                if (nieuweKoppelingRelatieState[propertyName] === undefined) {
                    nieuweKoppelingRelatieState[propertyName] = []
                }
                nieuweKoppelingRelatieState[propertyName].push({
                    UUID: UUID,
                    data: res.data,
                    omschrijving: omschrijving,
                })
                this.setState({
                    koppelingenRelaties: nieuweKoppelingRelatieState,
                })
            })
    }

    savekoppelingenRelatiesNaarState(actieveKoppelingOfRelaties) {
        // crudObject met alle huidige data
        const crudObject = { ...this.props.crudObject }

        // Lege array waar de properties in worden gepushed na er overheen gemap'd te zijn
        // 'Belang' en 'Taak' zijn aparte typen, maar zitten wel beidde op dezelfde propertyName op het crudObject
        // Als tijdens het map'en de propertyName al in de propertyNamesMapped array staat, slaat die 'm over
        let propertyNamesMapped = []
        let newStateKoppelingenRelatiesObject = {}

        actieveKoppelingOfRelaties.forEach(propertyName => {
            if (propertyNamesMapped.includes(propertyName)) {
                return
            }
            propertyNamesMapped.push(propertyName)

            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName].length > 0
            ) {
                newStateKoppelingenRelatiesObject[propertyName] = []
                crudObject[propertyName].forEach((item, index) => {
                    newStateKoppelingenRelatiesObject[propertyName].push(item)
                })
            }
        })

        // Deze twee arrays zijn voor de Promises
        // De eerste bevat alle promises. Ook krijgt deze als eerste een aparte promise die aan het eind vervult kan worden.
        // De API data is wel aanwezig, maar omdat we een functie executie doen wordt deze eerst toegewezen als undefined.
        // Dit is dus om te voorkomen dat de view gerendered wordt met undefined data.
        // De resolveFirstPromise array gebruiken we om hier makkelijk bij te kunnen (resolveFirstPromise[0] en dan een call)
        let promisesDataPropsAdded = []
        let resolveFirstPromise = []

        // Functie om de .data property toe te voegen aan het object
        function findPropertyAndAddDataToStateObject(
            propertyName,
            data,
            resolve
        ) {
            const objectIndex = newStateKoppelingenRelatiesObject[
                propertyName
            ].findIndex(x => x.UUID === data.UUID)

            newStateKoppelingenRelatiesObject[propertyName][
                objectIndex
            ].data = data

            resolve('resolved')
        }

        // Map over actieveKoppelingOfRelaties -> een array met de actie koppelingen & relaties vanuit het CrudObject
        // Vervolgens mappen we hierbinnen over de koppelingen om voor elk de UUID te pakken en hierop een API call te maken

        // Return een array van Axios Promises

        Promise.all(
            actieveKoppelingOfRelaties.map((propertyName, indexPropertyName) =>
                newStateKoppelingenRelatiesObject[propertyName].map(
                    (koppeling, indexKoppeling) => {
                        if (
                            objecten[propertyName.toLowerCase()] === undefined
                        ) {
                            return
                        }

                        // Resolve de eerste promise nadat alle objecten zijn bewerkt
                        const resolveFirstPromiseBool =
                            actieveKoppelingOfRelaties.length ===
                                indexPropertyName + 1 &&
                            newStateKoppelingenRelatiesObject[propertyName]
                                .length ===
                                indexKoppeling + 1

                        axios
                            .get(
                                `${objecten[propertyName.toLowerCase()].api}/version/${koppeling.UUID}`
                            )
                            .then(res => {
                                promisesDataPropsAdded.push(
                                    new Promise((resolve, reject) => {
                                        findPropertyAndAddDataToStateObject(
                                            propertyName,
                                            res.data,
                                            resolve
                                        )
                                    })
                                )
                            })
                    }
                )
            )
        )
            .then(responses => {
                // Zodra alle undefined .data properties zijn toegewezen aan de API data (oftewel, zodra alle functie executies klaar zijn), wordt de eerste Promise vervuld, en zijn alle promises ready.
                Promise.all(promisesDataPropsAdded)
                    .then(() => {
                        setTimeout(() => {
                            this.setState({
                                koppelingenRelaties: newStateKoppelingenRelatiesObject,
                                dataFromAPILoaded: true,
                            })
                        }, 2000)
                    })
                    .catch(err => console.log(err))
            })
            .then(responses => {})
            .catch(err => console.log(err))
    }

    render() {
        console.log(this.state)

        // crudObject met alle huidige data
        const crudObject = { ...this.props.crudObject }

        // Bevat de properties van het crudObject die hierin bewerkt moeten worden
        const koppelingRelatieArray = this.props.koppelingRelatieArray

        // Maakt een array om te kijken of 1 van de properties op het crudObject al data heeft
        const actieveKoppelingOfRelatiesBoolean = koppelingRelatieArray.map(
            item => {
                const propertyName = objecten[item].propertyName
                return crudObject[propertyName].length > 0
            }
        )

        // Lege array waar de properties in worden gepushed na er overheen gemap'd te zijn
        // 'Belang' en 'Taak' zijn aparte typen, maar zitten wel beidde op dezelfde propertyName op het crudObject
        // Als tijdens het map'en de propertyName al in de propertyNamesMapped array staat, slaat die 'm over
        let propertyNamesMapped = []

        return (
            <React.Fragment>
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    hideObjectLabel={this.props.hideObjectLabel}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />
                <div className="bg-white rounded shadow p-5">
                    <div className="flex border-b border-gray-300 font-bold text-gray-700 text-sm py-2">
                        <div className="w-40 mr-5 relative">Type</div>
                        <div className="w-full">Titel</div>
                    </div>
                    <ul className="mb-3">
                        {/* Zodra de API een response heeft gegeven: */}
                        {this.state.dataFromAPILoaded ? (
                            koppelingRelatieArray.map(
                                (koppelingRelatieNaam, index) => {
                                    const propertyName =
                                        objecten[koppelingRelatieNaam]
                                            .propertyName

                                    // Als deze propertyName niet in het koppelingenRelaties object zit; return
                                    if (
                                        this.state.koppelingenRelaties[
                                            propertyName
                                        ] === undefined
                                    ) {
                                        return
                                    }

                                    // Anders returnen we de list items door te loopen over koppelingenRelaties[propertyName]
                                    const listItems = this.state.koppelingenRelaties[
                                        propertyName
                                    ].map((item, index) => {
                                        let type
                                        if (
                                            item.data !== undefined &&
                                            item.data.Type !== undefined
                                        ) {
                                            type = item.data.Type
                                        } else {
                                            type =
                                                objecten[koppelingRelatieNaam]
                                                    .type
                                        }

                                        return (
                                            <li
                                                key={index}
                                                className="flex border-b border-gray-300 text-gray-700 text-sm py-2"
                                            >
                                                <div className="w-40 mr-5 relative">
                                                    {type}
                                                </div>
                                                <div className="w-full">
                                                    {item.data
                                                        ? item.data.Titel
                                                        : null}
                                                </div>
                                            </li>
                                        )
                                    })
                                    return listItems
                                }
                            )
                        ) : (
                            <span className="text-gray-700 text-sm block py-4">
                                {this.props.placeholderTekst}
                            </span>
                        )}
                    </ul>
                    <div className="relative">
                        <div
                            className="mbg-color rounded text inline-block text-white pl-4 text-sm py-1 mt-2 cursor-pointer mbg-color-darker-hover relative"
                            onClick={this.toggleButton}
                            ref={this.button}
                        >
                            <span className="py-1 inline-block select-none">
                                {this.props.buttonTekst}
                            </span>
                            <span className="ml-4 inline-block text-center py-1 border-l m-border-color px-4">
                                <FontAwesomeIcon
                                    className="mt-1 text-white"
                                    icon={faAngleDown}
                                />
                            </span>
                            {this.state.buttonOpen ? (
                                <ul
                                    className="absolute bg-white rounded w-full top-100 left-0 text-gray-700 text-sm shadow"
                                    ref={this.dropdown}
                                >
                                    {this.props.koppelingRelatieArray
                                        ? this.props.koppelingRelatieArray.map(
                                              (item, index) => {
                                                  return (
                                                      <li
                                                          key={index}
                                                          onClick={() => {
                                                              this.togglePopup(
                                                                  item
                                                              )
                                                          }}
                                                          className="px-3 py-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
                                                      >
                                                          {
                                                              objecten[item]
                                                                  .buttonTekst
                                                          }
                                                      </li>
                                                  )
                                              }
                                          )
                                        : null}
                                </ul>
                            ) : null}
                        </div>
                    </div>
                </div>
                {this.state.popupOpen ? (
                    <PopUpKoppelingRelatie
                        titelMainObject={this.props.titelMainObject}
                        type={this.state.popupType}
                        togglePopup={this.togglePopup}
                        voegKoppelingRelatieToe={
                            this.props.voegKoppelingRelatieToe
                        }
                        crudObject={crudObject}
                    />
                ) : null}
            </React.Fragment>
        )
    }
}

class PopUpKoppelingRelatie extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            objecten: [],
            selected: null,
            beschrijving: '',
            zoekFilter: '',
            actievePagina: 1,
        }
        this.volgendeScherm = this.volgendeScherm.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        axios
            .get(objecten[this.state.type].api)
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

                this.setState({
                    objecten: responseObjecten,
                })
            })
            .catch(error => {
                console.log(error)
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
        const crudObject = { ...this.props.crudObject }
        let actieveKoppelingen = []
        crudObject[propertyName].forEach(item => {
            actieveKoppelingen.push(item.UUID)
        })

        const filteredObjecten = this.state.objecten
            .filter(item => item.Titel.includes(this.state.zoekFilter))
            .filter(item => !actieveKoppelingen.includes(item.UUID))

        return (
            <AnimatedPopUp>
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
                            <ul className="flex-row overflow-y-auto max-h-half-screen">
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
                                        Geen resultaten
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
            </AnimatedPopUp>
        )
    }
}

function AnimatedPopUp(props) {
    return (
        <React.Fragment>
            <animated.div
                className="fixed w-screen bg-gray-900 h-screen top-0 left-0 z-10"
                style={useSpring({
                    config: { tension: 300 },
                    opacity: 0.25,
                    from: { opacity: 0 },
                })}
            />
            <div className="fixed top-0 left-0 z-10">
                <div className="flex h-screen w-screen top-0 left-0 justify-center items-center">
                    <animated.div
                        style={useSpring({
                            config: { tension: 300 },
                            transform: 'scale(1)',
                            from: { transform: 'scale(0.75)' },
                        })}
                        className="max-w-5xl relative bg-white rounded shadow px-6 py-6"
                    >
                        {props.children}
                    </animated.div>
                </div>
            </div>
        </React.Fragment>
    )
}

FormFieldUniverseleRelatieKoppeling.propTypes = {
    buttonTekst: PropTypes.string,
    placeholderTekst: PropTypes.string,
}

export default FormFieldUniverseleRelatieKoppeling
