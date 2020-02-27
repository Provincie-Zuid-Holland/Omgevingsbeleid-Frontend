import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from './../../API/axios'
import { toast } from 'react-toastify'

import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopupNieuweKoppeling from './PopupNieuweKoppeling'
import PopupBewerkKoppeling from './PopupBewerkKoppeling'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

import objecten from './ObjectenInformatie'

class FormFieldBeleidsrelatieKoppeling extends Component {
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
        this.voegKoppelingRelatieToe = this.voegKoppelingRelatieToe.bind(this)
        this.togglePopupNieuw = this.togglePopupNieuw.bind(this)
        this.togglePopupBewerk = this.togglePopupBewerk.bind(this)
    }

    verwijderKoppelingFromLocalState(itemObject) {
        let nieuwKoppelingenRelatiesObject = this.state.koppelingenRelaties
        const index = nieuwKoppelingenRelatiesObject[
            itemObject.propertyName
        ].findIndex(item => item.UUID === itemObject.item.UUID)
        nieuwKoppelingenRelatiesObject[itemObject.propertyName].splice(index, 1)

        this.setState(
            {
                koppelingenRelaties: nieuwKoppelingenRelatiesObject,
            },
            toast('Beleidsrelatie verwijderd')
        )
    }

    wijzigKoppelingRelatieFromLocalState(itemObject, nieuweOmschrijving) {
        let nieuwKoppelingenRelatiesObject = this.state.koppelingenRelaties
        const index = nieuwKoppelingenRelatiesObject[
            itemObject.propertyName
        ].findIndex(item => item.UUID === itemObject.item.UUID)
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

    togglePopupNieuw() {
        this.setState({
            popupOpenNieuw: !this.state.popupOpenNieuw,
        })
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

        if (this.props.editStatus) {
            const UUID = this.props.objectUUID
            const apiURL = `/beleidsrelaties?Van_Beleidsbeslissing=${UUID}`

            // Haalt de bestaande beleidsrelaties op die gekoppeld zijn VAN deze beleidsbeslissing
            axios
                .get(apiURL)
                .then(res => {
                    this.setState({
                        objecten: res.data,
                        dataFromAPILoaded: true,
                    })
                })
                .catch(error => {
                    this.setState({
                        dataFromAPILoaded: true,
                    })
                })
        }
    }

    componentDidUpdate(prevProps, prevState) {}

    voegKoppelingRelatieToe(object, omschrijving) {
        const nieuweBeleidsrelatie = {
            Begin_Geldigheid: object.Begin_Geldigheid,
            Eind_Geldigheid: object.Eind_Geldigheid,
            Van_Beleidsbeslissing: this.props.objectUUID,
            Naar_Beleidsbeslissing: object.UUID,
            Titel: '',
            Omschrijving: omschrijving,
            Aanvraag_Datum: new Date(),
            Status: 'Open',
        }

        this.setState(
            {
                maakNieuweBeleidsrelatieAan: true,
            },
            () => {
                axios
                    .post(`/beleidsrelaties`, nieuweBeleidsrelatie)
                    .then(res => {
                        const nieuweBeleidsrelatie = res.data
                        let nieuweObjecten = this.state.objecten
                        nieuweObjecten.push(nieuweBeleidsrelatie)
                        this.setState(
                            {
                                objecten: nieuweObjecten,
                                maakNieuweBeleidsrelatieAan: false,
                            },
                            () => {
                                toast('Beleidsrelatie toegevoegd')
                                this.togglePopupNieuw()
                            }
                        )
                    })
            }
        )
    }

    render() {
        // crudObject met alle huidige data
        const crudObject = this.props.crudObject
        const actieveKoppelingen = this.state.objecten

        return (
            <div className="mb-10">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />
                <div
                    className="bg-white rounded shadow p-5"
                    id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                >
                    <div className="flex border-b border-gray-300 font-bold text-gray-700 text-sm py-2">
                        <div className="w-40 mr-5 relative">Type</div>
                        <div className="w-full">Titel</div>
                    </div>
                    <ul className="mb-3">
                        {/* Zodra de API een response heeft gegeven: */}
                        {this.state.dataFromAPILoaded &&
                        this.state.objecten &&
                        this.state.objecten.length > 0 ? (
                            this.state.objecten.map((koppeling, index) => {
                                return (
                                    <li
                                        key={index}
                                        className="flex border-b border-gray-300 text-gray-700 text-sm py-2 hover:text-gray-900 cursor-pointer"
                                        onClick={() => {
                                            // this.togglePopupBewerk(
                                            //     item,
                                            //     propertyName
                                            // )
                                        }}
                                        id={`form-field-beleidsrelatie-${index}`}
                                    >
                                        <div className="w-40 mr-5 relative">
                                            Beleidsrelatie
                                        </div>
                                        <div className="w-full relative">
                                            {/* {koppeling.data ? item.data.Titel : null} */}
                                            <FontAwesomeIcon
                                                className="absolute right-0 mt-1 mr-2"
                                                icon={faEye}
                                            />
                                        </div>
                                    </li>
                                )
                            })
                        ) : (
                            <span className="text-gray-700 text-sm block py-4">
                                {this.props.placeholderTekst}
                            </span>
                        )}
                    </ul>
                    <div className="relative">
                        <div
                            className="mbg-color rounded text inline-block text-white pl-4 text-sm py-1 mt-2 cursor-pointer mbg-color-darker-hover relative"
                            id="button-nieuwe-relatie"
                            onClick={() =>
                                this.togglePopupNieuw('beleidsbeslissing')
                            }
                            ref={this.button}
                        >
                            <span className="py-1 inline-block select-none">
                                Nieuwe relatie
                            </span>
                            <span className="ml-4 inline-block text-center py-1 border-l m-border-color px-4">
                                <FontAwesomeIcon
                                    className="mt-1 text-white"
                                    icon={faPlus}
                                />
                            </span>
                        </div>
                    </div>
                </div>
                {this.state.popupOpenNieuw ? (
                    <PopupNieuweKoppeling
                        titelMainObject={this.props.titelMainObject}
                        type={this.state.popupType}
                        togglePopup={this.togglePopupNieuw}
                        voegKoppelingRelatieToe={this.voegKoppelingRelatieToe}
                        // crudObject={crudObject}
                        actieveKoppelingen={actieveKoppelingen}
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
            </div>
        )
    }
}

FormFieldBeleidsrelatieKoppeling.propTypes = {
    buttonTekst: PropTypes.string,
    placeholderTekst: PropTypes.string,
}

export default FormFieldBeleidsrelatieKoppeling
