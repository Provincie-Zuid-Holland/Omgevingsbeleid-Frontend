import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import axios from './../../API/axios'

import { faAngleDown, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopupNieuweKoppeling from './PopupNieuweKoppeling'
import PopupBewerkKoppeling from './PopUpBewerkKoppeling'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

import objecten from './ObjectenInformatie'

// Function to sort in arrays with objects based on properties
const nestedSort = function (prop, arr) {
    prop = prop.split('.')
    arr.sort(function (a, b) {
        prop.forEach((item, index) => {
            a = a[prop[index]]
            b = b[prop[index]]
            if (a < b) {
                return -1
            } else if (a > b) {
                return 1
            } else {
                return 0
            }
        })
    })
    return arr
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
        let nieuwKoppelingenRelatiesObject = this.state.koppelingenRelaties
        const index = nieuwKoppelingenRelatiesObject[
            itemObject.propertyName
        ].findIndex((item) => item.UUID === itemObject.item.UUID)
        nieuwKoppelingenRelatiesObject[itemObject.propertyName].splice(index, 1)

        this.setState({
            koppelingenRelaties: nieuwKoppelingenRelatiesObject,
        })
    }

    wijzigKoppelingRelatieFromLocalState(itemObject, nieuweOmschrijving) {
        let nieuwKoppelingenRelatiesObject = this.state.koppelingenRelaties
        const index = nieuwKoppelingenRelatiesObject[
            itemObject.propertyName
        ].findIndex((item) => item.UUID === itemObject.item.UUID)
        nieuwKoppelingenRelatiesObject[itemObject.propertyName][
            index
        ].Omschrijving = nieuweOmschrijving

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

    componentWillUnmount() {
        document.removeEventListener(
            'mousedown',
            this.handleClickOutside,
            false
        )
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, false)
        // We krijgen vanuit de props van het crudObject met de huidige data
        // Ook krijgen we de koppelingRelatieArray waarin de propertyNames om te bewerken in dit component
        // Vervolgens moeten we API calls doen om de laatste data terug te krijgen op basis van de UUID

        // crudObject met alle gekregen data vanuit de API
        const crudObject = this.props.crudObject

        // Bevat de properties van het crudObject die in dit component bewerkt moeten worden
        // Bijvoorbeeld: koppelingRelatieArray={['belangen', 'taken']}
        const koppelingRelatieArray = this.props.koppelingRelatieArray

        // Maken een array om de actieve koppeling / relaties in te pushen
        let actieveKoppelingOfRelaties = []

        // Voor elk item in de koppelingRelatieArray kijken we of deze al een actieve koppeling heeft op het gekregen crudObject
        koppelingRelatieArray.forEach((item) => {
            const propertyName = objecten[item].propertyName
            if (
                crudObject[propertyName] !== undefined &&
                crudObject[propertyName] !== null &&
                crudObject[propertyName].length > 0 &&
                !actieveKoppelingOfRelaties.includes(
                    objecten[item].propertyName
                )
            ) {
                actieveKoppelingOfRelaties.push(objecten[item].propertyName)
            }
        })

        // Als actieveKoppelingOfRelaties 1 of meer items heeft roepen we savekoppelingenRelatiesNaarState() aan
        if (actieveKoppelingOfRelaties.length > 0) {
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
        koppelingRelatieArray.forEach((item) => {
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

        // Map over de property names die in de crud object prop zitten
        actieveKoppelingOfRelaties.forEach((item) => {
            // map over het het 'item' property binnen het crudObject, bijvoorbeeld 'ambities'
            crudObject[item].forEach((object) => {
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
                        (item) => item.UUID === UUID
                    ) === undefined
                ) {
                    // Anders  we in de state, binnen de property name, naar een object met dezelfde UUID
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
            .then((res) => {
                if (nieuweKoppelingRelatieState[propertyName] === undefined) {
                    nieuweKoppelingRelatieState[propertyName] = []
                }
                nieuweKoppelingRelatieState[propertyName].push({
                    UUID: UUID,
                    data: res.data,
                    Omschrijving: omschrijving,
                })
                this.setState({
                    koppelingenRelaties: nieuweKoppelingRelatieState,
                    dataFromAPILoaded: true,
                })
            })
    }

    // Functie om als het component gemount wordt de bestaande koppelingen en relaties op te halen
    savekoppelingenRelatiesNaarState(actieveKoppelingOfRelaties) {
        // crudObject met alle huidige data
        const crudObject = this.props.crudObject

        // propertyNamesMapped wordt aangemaakt om de properties in te pushes na eroverheen gemap'd te zijn
        // Dit is nodig doordat 'Belang' en 'Taak' beidde aparte typen zijn, maar ook hetzelfde propertyName hebben op het crudObject
        // Met deze array kunnen we al gemapde items overslaan bij de actieveKoppelingOfRelaties.forEach()
        let propertyNamesMapped = []

        // Het object waar de nieuwe koppeling en relatie state in gemaakt wordt
        let newStateKoppelingenRelatiesObject = {}

        // Loop over de actieveKoppelingOfRelaties (gekregen als prop vanuit componentDidMount())
        actieveKoppelingOfRelaties.forEach((propertyName) => {
            // Als er al over de propertyName is gemapped return'en we
            if (propertyNamesMapped.includes(propertyName)) {
                return
            }

            // Anders voegen we de nieuwe propertyName aan de propertyNamesMapped
            propertyNamesMapped.push(propertyName)

            // !!!
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

        const that = this

        // Functie om de .data property toe te voegen aan het object
        function findPropertyAndAddDataToStateObject(propertyName, data) {
            const objectIndex = newStateKoppelingenRelatiesObject[
                propertyName
            ].findIndex((x) => x.UUID === data.UUID)

            newStateKoppelingenRelatiesObject[propertyName][
                objectIndex
            ].data = data

            // If every item in the array contains an .data property
            // We sort the array based on the title
            if (
                newStateKoppelingenRelatiesObject[propertyName].every(
                    (item) => item.data !== undefined
                )
            ) {
                newStateKoppelingenRelatiesObject[propertyName] = nestedSort(
                    'data.Titel',
                    newStateKoppelingenRelatiesObject[propertyName]
                )

                // If the property we inspect is equal to "Belangen"
                // We also sort the array based on the .type property ('Nationaal Belang' & 'Wettelijke Taak & Bevoegdheid')
                if (propertyName === 'Belangen') {
                    newStateKoppelingenRelatiesObject[
                        propertyName
                    ] = nestedSort(
                        'data.Type',
                        newStateKoppelingenRelatiesObject[propertyName]
                    )
                }
            }

            // Als het het laatste item is wat geupdate wordt updaten we nog een keer de state, zodat de .data properties op alle objecten zitten en geupdate worden in de state, en dus in de UI
            that.setState({
                koppelingenRelaties: newStateKoppelingenRelatiesObject,
            })
        }

        // Map over actieveKoppelingOfRelaties -> een array met de actie koppelingen & relaties vanuit het CrudObject
        // Vervolgens mappen we hierbinnen over de koppelingen om voor elk de UUID te pakken en hierop een API call te maken
        // Deze worden gereturned in een Promise.all()
        Promise.all(
            actieveKoppelingOfRelaties.map((propertyName, indexPropertyName) =>
                newStateKoppelingenRelatiesObject[propertyName].forEach(
                    (koppeling, indexKoppeling) => {
                        if (
                            objecten[propertyName.toLowerCase()] === undefined
                        ) {
                            return null
                        }

                        axios
                            .get(
                                `${
                                    objecten[propertyName.toLowerCase()].api
                                }/version/${koppeling.UUID}`
                            )
                            .then((res) => {
                                findPropertyAndAddDataToStateObject(
                                    propertyName,
                                    res.data
                                )
                            })
                    }
                )
            )
        )
            .then((responses) => {
                this.setState({
                    dataFromAPILoaded: true,
                })
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    render() {
        // crudObject met alle huidige data
        const crudObject = this.props.crudObject

        // Bevat de properties van het crudObject die hierin bewerkt moeten worden
        const koppelingRelatieArray = this.props.koppelingRelatieArray

        // Lege array waar de properties in worden gepushed na er overheen gemap'd te zijn
        // 'Belang' en 'Taak' zijn aparte typen, maar zitten wel beidde op dezelfde propertyName op het crudObject
        // Als tijdens het map'en de propertyName al in de propertyNamesMapped array staat, slaat die 'm over
        let propertyNamesMapped = []

        return (
            <React.Fragment>
                {this.props.fieldLabel === 'Koppelingen' ? (
                    <React.Fragment>
                        <h3 className="block mb-2 font-bold tracking-wide text-gray-700">
                            Relaties
                        </h3>
                        <p className="mb-8 text-sm text-gray-700">
                            Een relatie ga je, met wederzijds goedkeuren, aan
                            met andere beleidskeuzes. Deze beleidsrelaties kun
                            je op een later moment aangaan vanuit de
                            beheeromgeving onder het kopje 'Beleidsrelaties'.
                        </p>
                    </React.Fragment>
                ) : null}
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                />
                <div
                    className="p-5 bg-white rounded shadow"
                    id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                >
                    <div className="flex py-2 text-sm font-bold text-gray-700 border-b border-gray-300">
                        <div className="relative w-40 mr-5">Type</div>
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
                                        return null
                                    }
                                    // De eerste keer dat we deze property mappen, dus pushen we hem in de propertyNamesMapped array
                                    propertyNamesMapped.push(propertyName)

                                    // Als deze propertyName niet in het koppelingenRelaties object zit; return
                                    if (
                                        this.state.koppelingenRelaties ===
                                            null ||
                                        this.state.koppelingenRelaties[
                                            propertyName
                                        ] === undefined
                                    ) {
                                        return null
                                    }

                                    let sortedItems = this.state
                                        .koppelingenRelaties

                                    {
                                        /* Object.keys(sortedItems).forEach(
                                        (key, index) => {
                                            sortedItems[key].sort(
                                                (a, b) =>
                                                    a.data.Titel - b.data.Titel
                                            )
                                        }
                                    ) */
                                    }

                                    // Anders returnen we de list items door te loopen over koppelingenRelaties[propertyName]
                                    const listItems = sortedItems[
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
                                                id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}-item-${index}`}
                                                className="flex py-2 text-sm text-gray-700 border-b border-gray-300 cursor-pointer hover:text-gray-900"
                                                onClick={() => {
                                                    this.togglePopupBewerk(
                                                        item,
                                                        propertyName
                                                    )
                                                }}
                                            >
                                                <div className="relative w-40 mr-5">
                                                    {type}
                                                </div>
                                                <div className="relative w-full pr-8">
                                                    {item.data
                                                        ? item.data.Titel
                                                        : null}
                                                    <FontAwesomeIcon
                                                        className="absolute top-0 right-0 mt-1 mr-2"
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
                            <span className="block py-4 text-sm text-gray-700">
                                {this.props.placeholderTekst}
                            </span>
                        )}
                    </ul>
                    <div className="relative">
                        <div
                            className="relative inline-block py-1 pl-4 mt-2 text-sm text-white rounded cursor-pointer mbg-color text mbg-color-darker-hover"
                            onClick={this.toggleButton}
                            ref={this.button}
                            id={`nieuw-item-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        >
                            <span className="inline-block py-1 select-none">
                                {this.props.buttonTekst}
                            </span>
                            <span className="inline-block px-4 py-1 ml-4 text-center border-l m-border-color">
                                <FontAwesomeIcon
                                    className="mt-1 text-white"
                                    icon={faAngleDown}
                                />
                            </span>
                            {this.state.buttonOpen ? (
                                <ul
                                    className="absolute left-0 w-full text-sm text-gray-700 bg-white rounded shadow top-100"
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
                                                          id={`form-field-universele-koppeling-dropdown-button-${index}`}
                                                          className="px-3 py-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
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
                        verwijderKoppelingRelatie={
                            this.props.verwijderKoppelingRelatie
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
