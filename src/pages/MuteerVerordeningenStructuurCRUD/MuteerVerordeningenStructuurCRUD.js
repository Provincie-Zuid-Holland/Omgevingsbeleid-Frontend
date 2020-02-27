import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import validator from 'validator'

// Import Components
import ContainerCrudFields from './ContainerCrudFields'
import ContainerMain from './../../components/ContainerMain'
import ButtonSubmitFixed from './../../components/ButtonSubmitFixed'
import ContainerFormSection from './../../components/ContainerFormSection'
import FormFieldTextInput from './../../components/FormFieldTextInput'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import LoaderContent from './../../components/LoaderContent'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Create Context
import APIcontext from './APIContext'

import * as VERORDENINGSTRUCTUUR from '../../constants/Verordeningstructuur'

function generateCrudObject(crudPropertiesObject) {
    const propertyNames = Object.keys(crudPropertiesObject)
    let crudObject = {}
    propertyNames.forEach(property => {
        crudObject[property] = crudPropertiesObject[property].initValue
    })
    return crudObject
}

class MuteerVerordeningenStructuurCRUD extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataLoaded: false,
            crudObject: generateCrudObject(
                VERORDENINGSTRUCTUUR.CRUD_PROPERTIES
            ),
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setEditorState = this.setEditorState.bind(this)
        this.voegKoppelingRelatieToe = this.voegKoppelingRelatieToe.bind(this)
        this.wijzigKoppelingRelatie = this.wijzigKoppelingRelatie.bind(this)
        this.verwijderKoppelingRelatieToe = this.verwijderKoppelingRelatieToe.bind(
            this
        )
    }

    handleChange(event) {
        const name = event.target.name
        const type = event.target.type
        let value = event.target.value

        if (type === 'date') {
            value = event.target.value
        }

        this.setState(
            prevState => ({
                crudObject: {
                    ...prevState.crudObject,
                    [name]: value,
                },
            }),
            () => console.log(this.state)
        )
    }

    // Algemene State Handler voor de Editor
    setEditorState(stateValue, fieldName) {
        this.setState(prevState => ({
            crudObject: {
                ...prevState.crudObject,
                [fieldName]: stateValue,
            },
        }))
    }

    validateDate(dateObject) {
        if (Object.prototype.toString.call(dateObject) === '[object Date]') {
            // it is a date
            if (isNaN(dateObject.getTime())) {
                // date is not valid
                return false
            } else {
                // date is valid
                return true
            }
        } else {
            // not a date
            return false
        }
    }

    handleSubmit(event) {
        event.preventDefault()

        let crudObject = this.state.crudObject

        // Zet de Date String om naar een Date Object en kijkt of deze geldig is
        crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
        crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)

        if (this.state.edit) {
            crudObject.Status = 'Concept'
            crudObject.Structuur = {
                Children: [],
            }

            axios
                .patch(
                    `/verordeningstructuur/${this.props.match.params.lineageID}`,
                    JSON.stringify(crudObject)
                )
                .then(() => {
                    this.props.history.push(`/muteer/verordeningen`)
                    toast('Gewijzigd')
                })
                .catch(error => {
                    // Wijzig de data terug naar het format om in het input veld te tonen
                    if (
                        crudObject.Eind_Geldigheid !== undefined &&
                        crudObject.Eind_Geldigheid !== null
                    ) {
                        crudObject.Eind_Geldigheid = format(
                            crudObject.Eind_Geldigheid,
                            'YYYY-MM-DD'
                        )
                    } else if (crudObject.Eind_Geldigheid === null) {
                        crudObject.Eind_Geldigheid = ''
                    }
                    if (
                        crudObject.Begin_Geldigheid !== undefined &&
                        crudObject.Begin_Geldigheid !== null
                    ) {
                        crudObject.Begin_Geldigheid = format(
                            crudObject.Begin_Geldigheid,
                            'YYYY-MM-DD'
                        )
                    } else if (crudObject.Begin_Geldigheid === null) {
                        crudObject.Begin_Geldigheid = ''
                    }
                    this.setState({
                        crudObject: crudObject,
                    })
                })
        } else {
            crudObject.Status = 'Concept'
            crudObject.Structuur = {
                Children: [],
            }

            axios
                .post(`/verordeningstructuur`, JSON.stringify(crudObject))
                .then(() => {
                    this.props.history.push(`/muteer/verordeningen`)
                    toast('Opgeslagen')
                })
                .catch(error => {
                    // Wijzig de data terug naar het format om in het input veld te tonen
                    if (
                        crudObject.Eind_Geldigheid !== undefined &&
                        crudObject.Eind_Geldigheid !== null
                    ) {
                        crudObject.Eind_Geldigheid = format(
                            crudObject.Eind_Geldigheid,
                            'YYYY-MM-DD'
                        )
                    } else if (crudObject.Eind_Geldigheid === null) {
                        crudObject.Eind_Geldigheid = ''
                    }
                    if (
                        crudObject.Begin_Geldigheid !== undefined &&
                        crudObject.Begin_Geldigheid !== null
                    ) {
                        crudObject.Begin_Geldigheid = format(
                            crudObject.Begin_Geldigheid,
                            'YYYY-MM-DD'
                        )
                    } else if (crudObject.Begin_Geldigheid === null) {
                        crudObject.Begin_Geldigheid = ''
                    }
                    this.setState({
                        crudObject: crudObject,
                    })
                })
        }
    }

    voegKoppelingRelatieToe(propertyName, object, omschrijving) {
        const nieuwObject = {
            UUID: object.UUID,
            Omschrijving: omschrijving,
        }

        // let nieuweArray = this.state.crudObject[propertyName]
        let nieuwCrudObject = this.state.crudObject
        // Als de relatie Array nog niet initialized is, maak deze aan
        if (typeof nieuwCrudObject[propertyName] === 'string') {
            nieuwCrudObject[propertyName] = []
        }
        nieuwCrudObject[propertyName].push(nieuwObject)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling toegevoegd')
        )
    }

    wijzigKoppelingRelatie(koppelingObject, nieuweOmschrijving) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            item => item.UUID === koppelingObject.item.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName][
            index
        ].Omschrijving = nieuweOmschrijving

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling gewijzigd')
        )
    }

    verwijderKoppelingRelatieToe(koppelingObject) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            item => item.UUID === koppelingObject.item.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName].splice(index, 1)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling verwijderd')
        )
    }

    componentDidUpdate(prevProps, prevState) {
        // Save to LocalStorage
        // If page === edit set Key to Name_UUID
        // If page === new set Key to Name
        if (
            this.state.dataLoaded === false ||
            JSON.stringify(this.state.crudObject) ===
                JSON.stringify(prevProps.crudObject)
        ) {
            return
        }

        if (!this.state.edit) {
            const objectName = this.props.dataModel.variables.Object_Name
            const localStorageObject = {
                date: new Date(),
                savedState: this.state.crudObject,
            }
            localStorage.setItem(objectName, JSON.stringify(localStorageObject))
        } else {
            const objectName = this.props.dataModel.variables.Object_Name
            const objectID = this.props.match.params.single
            const localStorageKey = `${objectName}_${objectID}`
            const localStorageObject = {
                date: new Date(),
                savedState: this.state.crudObject,
            }
            localStorage.setItem(
                localStorageKey,
                JSON.stringify(localStorageObject)
            )
        }
    }

    componentDidMount() {
        if (this.props.match.params.lineageID) {
            axios
                .get(
                    `/verordeningstructuur/version/${this.props.match.params.lineageUUID}`
                )
                .then(res => {
                    let crudObject = res.data

                    delete crudObject.ID
                    delete crudObject.UUID
                    delete crudObject.Modified_By
                    delete crudObject.Modified_Date
                    delete crudObject.Created_By
                    delete crudObject.Created_Date

                    crudObject.Begin_Geldigheid = format(
                        crudObject.Begin_Geldigheid,
                        'YYYY-MM-DD'
                    )
                    crudObject.Eind_Geldigheid = format(
                        crudObject.Eind_Geldigheid,
                        'YYYY-MM-DD'
                    )

                    this.setState({
                        edit: true,
                        dataLoaded: true,
                        crudObject: crudObject,
                    })
                })
                .catch(err => console.log(err))
        } else {
            this.setState({
                dataLoaded: true,
            })
        }
    }

    render() {
        const contextObject = {
            objectUUID: this.state.UUID,
            titelEnkelvoud: this.props.dataModel.variables.Titel_Enkelvoud,
            titelMeervoud: this.props.dataModel.variables.Titel_Meervoud,
            overzichtSlug: this.props.overzichtSlug,
            objectID: this.props.match.params.single,
            editStatus: this.state.edit,
            handleSubmit: this.handleSubmit,
            voegKoppelingRelatieToe: this.voegKoppelingRelatieToe,
            wijzigKoppelingRelatie: this.wijzigKoppelingRelatie,
            verwijderKoppelingRelatieToe: this.verwijderKoppelingRelatieToe,
            handleChange: this.handleChange,
            crudObject: this.state.crudObject,
            setEditorState: this.setEditorState,
            Van_Beleidsbeslissing_Titel: this.state.Van_Beleidsbeslissing_Titel,
        }

        return (
            <div>
                <Helmet>
                    <title>
                        {contextObject.editStatus
                            ? `Omgevingsbeleid - Wijzig de verordening`
                            : `Omgevingsbeleid - Voeg een nieuwe verordening toe`}
                    </title>
                </Helmet>
                <div className="w-full py-32 px-6 mbg-color edit-header relative">
                    <div className="lg:px-10 container mx-auto flex justify-center items-center">
                        <div className="w-full pr-20">
                            <ButtonBackToPage
                                terugNaar={`verordening`}
                                color="text-white"
                                url={`/muteer/verordeningen`}
                            />
                            <h1 className="heading-serif-4xl text-white">
                                {this.state.dataLoaded
                                    ? contextObject.editStatus
                                        ? `Wijzig de verordening`
                                        : `Voeg een nieuwe verordening toe`
                                    : null}
                            </h1>
                        </div>
                    </div>
                </div>
                <APIcontext.Provider value={contextObject}>
                    {this.state.dataLoaded ? (
                        <ContainerCrudFields />
                    ) : (
                        <LoaderContent />
                    )}
                </APIcontext.Provider>
            </div>
        )
    }
}

export default withRouter(MuteerVerordeningenStructuurCRUD)
