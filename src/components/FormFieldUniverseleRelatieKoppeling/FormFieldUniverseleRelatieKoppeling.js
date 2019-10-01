import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from './../../API/axios'
import { toast } from 'react-toastify'
import { useSpring, animated } from 'react-spring'

import {
    faCaretDown,
    faAngleDown,
    faTimes,
    faSearch,
    faEye,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopUpAnimatedContainer from './../PopUpAnimatedContainer'
import PopupNieuweKoppeling from './PopupNieuweKoppeling'
import PopupBewerkKoppeling from './PopUpBewerkKoppeling'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

import objecten from './ObjectenInformatie'

class FormFieldUniverseleRelatieKoppeling extends Component {
    // State:
    // selected - bevat het geselecteerde object als de gebruiker op een item in de dropdown klikt
    // koppelingenRelaties - bevat de koppeling & relatie objecten en voegt hier een data property aan toe met API data van dat object
    constructor(props) {
        super(props)
        this.state = {
            selected: [],
            buttonOpen: false,
            popupOpenNieuw: false,
            popupOpenBewerk: false,
            popupOpenBewerkItem: {},
            koppelingenRelaties: null,
            dataFromAPILoaded: false,
        }
        this.button = React.createRef()
        this.dropdown = React.createRef()
        this.toggleButton = this.toggleButton.bind(this)
        this.verwijderKoppelingFromLocalState = this.verwijderKoppelingFromLocalState.bind(
            this
        )
        this.wijzigKoppelingRelatieFromLocalState = this.wijzigKoppelingRelatieFromLocalState.bind(
            this
        )
        this.handleClickOutside = this.handleClickOutside.bind(this)
        this.togglePopupNieuw = this.togglePopupNieuw.bind(this)
        this.togglePopupBewerk = this.togglePopupBewerk.bind(this)
        this.savekoppelingenRelatiesNaarState = this.savekoppelingenRelatiesNaarState.bind(
            this
        )
        this.saveNieuwekoppelingRelatieNaarState = this.saveNieuwekoppelingRelatieNaarState.bind(
            this
        )
    }

    verwijderKoppelingFromLocalState(itemObject) {
        console.log(itemObject)
        console.log(this.state.koppelingenRelaties)

        let nieuwKoppelingenRelatiesObject = this.state.koppelingenRelaties
        const index = nieuwKoppelingenRelatiesObject[
            itemObject.propertyName
        ].findIndex(item => item.UUID === itemObject.item.UUID)
        nieuwKoppelingenRelatiesObject[itemObject.propertyName].splice(index, 1)

        this.setState({
            koppelingenRelaties: nieuwKoppelingenRelatiesObject,
        })
    }

    wijzigKoppelingRelatieFromLocalState(itemObject, nieuweOmschrijving) {
        console.log(itemObject)
        console.log(this.state.koppelingenRelaties)

        let nieuwKoppelingenRelatiesObject = this.state.koppelingenRelaties
        const index = nieuwKoppelingenRelatiesObject[
            itemObject.propertyName
        ].findIndex(item => item.UUID === itemObject.item.UUID)
        nieuwKoppelingenRelatiesObject[itemObject.propertyName][
            index
        ].Omschrijving = nieuweOmschrijving

        console.log(
            nieuwKoppelingenRelatiesObject[itemObject.propertyName][index]
        )

        this.setState({
            koppelingenRelaties: nieuwKoppelingenRelatiesObject,
        })
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

    togglePopupNieuw(type) {
        if (!this.state.popupOpenNieuw) {
            this.setState({
                popupOpenNieuw: !this.state.popupOpenNieuw,
                popupType: type,
            })
        } else {
            this.setState({
                popupOpenNieuw: !this.state.popupOpenNieuw,
                popupType: null,
            })
        }
    }

    togglePopupBewerk(item, propertyName) {
        if (!this.state.popupOpenBewerk) {
            this.setState({
                popupOpenBewerk: !this.state.popupOpenBewerk,
                popupOpenBewerkItem: {
                    item: item,
                    propertyName: propertyName,
                },
            })
        } else {
            this.setState({
                popupOpenBewerk: !this.state.popupOpenBewerk,
                popupOpenBewerkItem: {
                    item: item,
                    propertyName: propertyName,
                },
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
        const crudObject = this.props.crudObject

        // Bevat de properties van het crudObject die hierin bewerkt moeten worden
        const koppelingRelatieArray = this.props.koppelingRelatieArray

        // Maakt een array om te kijken of 1 van de properties op het crudObject al data heeft
        let actieveKoppelingOfRelaties = []

        // Stopt de actieve koppelingen property names in een array en roept de functie savekoppelingenRelatiesNaarState()
        koppelingRelatieArray.forEach(item => {
            const propertyName = objecten[item].propertyName
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName].length > 0 &&
                !actieveKoppelingOfRelaties.includes(
                    objecten[item].propertyName
                )
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
        const crudObject = this.props.crudObject

        // Bevat de properties van het crudObject die hierin bewerkt moeten worden
        const koppelingRelatieArray = this.props.koppelingRelatieArray

        // Maakt een array om te kijken of 1 van de properties op het crudObject al data heeft
        let actieveKoppelingOfRelaties = []

        // Stopt de actieve koppelingen property names in een array
        koppelingRelatieArray.forEach(item => {
            const propertyName = objecten[item].propertyName
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName].length > 0 &&
                !actieveKoppelingOfRelaties.includes(
                    objecten[item].propertyName
                )
            ) {
                actieveKoppelingOfRelaties.push(objecten[item].propertyName)
            }
        })

        let arrayMetNieuweObjecten = []

        // Map over de property names die in de crud object prop zitten
        actieveKoppelingOfRelaties.map(item => {
            // map over het het 'item' property binnen het crudObject, bijvoorbeeld 'ambities'
            crudObject[item].map(object => {
                const omschrijving = object.Omschrijving
                const UUID = object.UUID
                // Als het een volledig nieuwe property name is die nog niet is toegevoegd (Dus een nieuw type)
                if (
                    !this.state.koppelingenRelaties ||
                    !this.state.koppelingenRelaties[item]
                ) {
                    this.saveNieuwekoppelingRelatieNaarState({
                        UUID: UUID,
                        propertyName: item,
                        Omschrijving: omschrijving,
                    })
                } else if (
                    this.state.koppelingenRelaties[item] &&
                    this.state.koppelingenRelaties[item].find(
                        item => item.UUID === UUID
                    ) === undefined
                ) {
                    // Anders zoeken we in de state, binnen de property name, naar een object met dezelfde UUID
                    // Als we deze niet vinden is het een nieuw item en saven we deze naar de state
                    this.saveNieuwekoppelingRelatieNaarState({
                        UUID: UUID,
                        propertyName: item,
                        Omschrijving: omschrijving,
                    })
                }
            })
        })
    }

    saveNieuwekoppelingRelatieNaarState(nieuweKoppelingRelatieObject) {
        const propertyName = nieuweKoppelingRelatieObject.propertyName
        const UUID = nieuweKoppelingRelatieObject.UUID
        const omschrijving = nieuweKoppelingRelatieObject.Omschrijving

        let nieuweKoppelingRelatieState = { ...this.state.koppelingenRelaties }

        axios
            .get(`${objecten[propertyName.toLowerCase()].api}/version/${UUID}`)
            .then(res => {
                if (nieuweKoppelingRelatieState[propertyName] === undefined) {
                    nieuweKoppelingRelatieState[propertyName] = []
                }
                nieuweKoppelingRelatieState[propertyName].push({
                    UUID: UUID,
                    data: res.data,
                    Omschrijving: omschrijving,
                })
                this.setState(
                    {
                        koppelingenRelaties: nieuweKoppelingRelatieState,
                        dataFromAPILoaded: true,
                    },
                    () => console.log(this.state)
                )
            })
    }

    savekoppelingenRelatiesNaarState(actieveKoppelingOfRelaties) {
        // crudObject met alle huidige data
        const crudObject = this.props.crudObject

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

        // Counter voor findPropertyAndAddDataToStateObject()
        let amountOfItemsAdded = 0
        const that = this

        // Functie om de .data property toe te voegen aan het object
        function findPropertyAndAddDataToStateObject(propertyName, data) {
            amountOfItemsAdded++
            const objectIndex = newStateKoppelingenRelatiesObject[
                propertyName
            ].findIndex(x => x.UUID === data.UUID)

            newStateKoppelingenRelatiesObject[propertyName][
                objectIndex
            ].data = data

            // Als het het laatste item is wat geupdate wordt updaten we nog een keer de state, zodat de .data properties op alle objecten zitten en geupdate worden in de state, en dus in de UI
            // if (amountOfItemsAdded === lengthOfAllObjects) {
            // }
            that.setState({
                koppelingenRelaties: newStateKoppelingenRelatiesObject,
            })
        }

        // Counter voor het aantal objecten. Deze word later weer gebruikt binnen findPropertyAndAddDataToStateObject()
        let lengthOfAllObjects = 0

        // Map over actieveKoppelingOfRelaties -> een array met de actie koppelingen & relaties vanuit het CrudObject
        // Vervolgens mappen we hierbinnen over de koppelingen om voor elk de UUID te pakken en hierop een API call te maken
        // Deze worden gereturned in een Promise.all()
        Promise.all(
            actieveKoppelingOfRelaties.map((propertyName, indexPropertyName) =>
                newStateKoppelingenRelatiesObject[propertyName].map(
                    (koppeling, indexKoppeling) => {
                        // Increase counter by one
                        lengthOfAllObjects++

                        if (
                            objecten[propertyName.toLowerCase()] === undefined
                        ) {
                            return
                        }

                        axios
                            .get(
                                `${objecten[propertyName.toLowerCase()].api}/version/${koppeling.UUID}`
                            )
                            .then(res => {
                                findPropertyAndAddDataToStateObject(
                                    propertyName,
                                    res.data
                                )
                            })
                    }
                )
            )
        )
            .then(responses => {
                this.setState({
                    dataFromAPILoaded: true,
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        // crudObject met alle huidige data
        const crudObject = this.props.crudObject

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
                                    if (
                                        propertyNamesMapped.includes(
                                            propertyName
                                        )
                                    ) {
                                        return
                                    }
                                    propertyNamesMapped.push(propertyName)

                                    // Als deze propertyName niet in het koppelingenRelaties object zit; return
                                    if (
                                        this.state.koppelingenRelaties ===
                                            null ||
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
                                            item.data.Type !== undefined &&
                                            item.data.Type !== 'Paragraaf'
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
                                                className="flex border-b border-gray-300 text-gray-700 text-sm py-2 hover:text-gray-900 cursor-pointer"
                                                onClick={() => {
                                                    this.togglePopupBewerk(
                                                        item,
                                                        propertyName
                                                    )
                                                }}
                                            >
                                                <div className="w-40 mr-5 relative">
                                                    {type}
                                                </div>
                                                <div className="w-full relative">
                                                    {item.data
                                                        ? item.data.Titel
                                                        : null}
                                                    <FontAwesomeIcon
                                                        className="absolute right-0 mt-1 mr-2"
                                                        icon={faEye}
                                                    />
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
                                                              this.togglePopupNieuw(
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
                {this.state.popupOpenNieuw ? (
                    <PopupNieuweKoppeling
                        titelMainObject={this.props.titelMainObject}
                        type={this.state.popupType}
                        togglePopup={this.togglePopupNieuw}
                        voegKoppelingRelatieToe={
                            this.props.voegKoppelingRelatieToe
                        }
                        crudObject={crudObject}
                        objecten={objecten}
                    />
                ) : null}
                {this.state.popupOpenBewerk ? (
                    <PopupBewerkKoppeling
                        titelMainObject={this.props.titelMainObject}
                        type={this.state.popupType}
                        togglePopup={this.togglePopupBewerk}
                        bewerkItem={this.state.popupOpenBewerkItem}
                        voegKoppelingRelatieToe={
                            this.props.voegKoppelingRelatieToe
                        }
                        wijzigKoppelingRelatie={
                            this.props.wijzigKoppelingRelatie
                        }
                        wijzigKoppelingRelatieFromLocalState={
                            this.wijzigKoppelingRelatieFromLocalState
                        }
                        verwijderKoppelingRelatieToe={
                            this.props.verwijderKoppelingRelatieToe
                        }
                        verwijderKoppelingFromLocalState={
                            this.verwijderKoppelingFromLocalState
                        }
                        crudObject={crudObject}
                        objecten={objecten}
                    />
                ) : null}
            </React.Fragment>
        )
    }
}

FormFieldUniverseleRelatieKoppeling.propTypes = {
    buttonTekst: PropTypes.string,
    placeholderTekst: PropTypes.string,
}

export default FormFieldUniverseleRelatieKoppeling
