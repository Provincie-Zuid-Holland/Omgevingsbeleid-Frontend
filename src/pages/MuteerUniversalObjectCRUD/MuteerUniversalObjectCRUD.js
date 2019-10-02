import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

// Import Components
import ContainerCrudFields from './ContainerCrudFields'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import LoaderContent from './../../components/LoaderContent'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Create Context
import APIcontext from './APIContext'

// Function to see if property on object is editable
function getCRUDBoolean(dataModel, propertyName) {
    return dataModel.properties[propertyName].UI.userCRUD
}

// Function to see if an object is empty
function isObjectEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false
    }
    return true
}

// Function to make a list to see which properties on the object are editable by the user - EDIT OBJECT
function makeCrudPropertiesArray(dataModel) {
    // Make list of property names from object
    const propertyNames = Object.keys(dataModel.properties)

    // Check for each Property in propertyNames if property CRUD value is True and if True add to new Array
    const crudProperties = propertyNames.filter(propertyName => {
        return getCRUDBoolean(dataModel, propertyName)
    })

    return crudProperties
}

// Function to make an object containing the fields that the user can edit
function makeCrudObject(array, responseObject) {
    let crudObject = {}
    if (isObjectEmpty(responseObject)) {
        array.forEach(arrayItem => {
            if (
                arrayItem === 'Verplicht_Programma' ||
                arrayItem === 'Specifiek_Of_Generiek'
            ) {
                crudObject[[arrayItem][0]] = ' - selecteer een optie - '
            } else {
                crudObject[[arrayItem][0]] = ''
            }
        })
    } else {
        array.forEach(arrayItem => {
            crudObject[[arrayItem][0]] = responseObject[arrayItem]
        })
    }

    return crudObject
}

class MuteerUniversalObjectCRUD extends Component {
    constructor(props) {
        super(props)

        // CrudObject contains the editable fields
        this.state = {
            edit: false,
            crudObject: {},
            dataLoaded: false,
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

    componentDidMount() {
        // Single parameter === object-id; user is editing an existing object
        if (this.props.match.params.single) {
            this.setState({
                edit: true,
            })

            const dataModel = this.props.dataModel
            const objectID = this.props.match.params.single
            const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint
            const objectName = this.props.dataModel.variables.Object_Name

            // See if there is a saved object in local storage
            const localStorageKey = `${objectName}_${objectID}`
            const savedStateInLocalStorage = JSON.parse(
                localStorage.getItem(localStorageKey)
            )

            let savedStateDate = ''
            let savedStateEmpty = true

            // See if local storage is empty
            if (
                savedStateInLocalStorage !== null &&
                !isObjectEmpty(savedStateInLocalStorage.savedState)
            ) {
                savedStateDate = format(
                    savedStateInLocalStorage.date,
                    'dddd D MMMM',
                    { locale: nlLocale }
                )
                savedStateEmpty = false
            }

            // Connect with API and get data from there
            axios
                .get(`${ApiEndpoint}/${objectID}`)
                .then(res => {
                    const responseObject = res.data
                    const crudProperties = makeCrudPropertiesArray(dataModel)
                    const crudObject = makeCrudObject(
                        crudProperties,
                        responseObject[0]
                    )

                    if (crudObject.Begin_Geldigheid !== undefined) {
                        crudObject.Begin_Geldigheid = format(
                            crudObject.Begin_Geldigheid,
                            'YYYY-MM-DD'
                        )
                    }
                    if (crudObject.Eind_Geldigheid !== undefined) {
                        crudObject.Eind_Geldigheid = format(
                            crudObject.Begin_Geldigheid,
                            'YYYY-MM-DD'
                        )
                    }

                    // If there is a saved state in LocalStorage &&
                    // If that state is equal to the latest state from the API
                    // If that savedState object is not empty
                    if (
                        savedStateEmpty === false &&
                        JSON.stringify(crudObject) !==
                            JSON.stringify(
                                savedStateInLocalStorage.savedState &&
                                    !isObjectEmpty(
                                        savedStateInLocalStorage.savedState
                                    )
                            )
                    ) {
                        this.setState(
                            {
                                crudObject: savedStateInLocalStorage.savedState,
                                dataLoaded: true,
                            },
                            () => {
                                toast(({ closeToast }) => (
                                    <div>
                                        Opgeslagen versie van {savedStateDate}
                                    </div>
                                ))
                            }
                        )
                    } else {
                        this.setState({
                            crudObject: crudObject,
                            dataLoaded: true,
                        })
                    }
                })
                .catch(error => {
                    if (error.response !== undefined) {
                        if (error.response.status === 401) {
                            localStorage.removeItem('access_token')
                            this.props.history.push('/login')
                        }
                    } else {
                        console.log(error)
                    }
                })
        } else {
            // See if there is a saved object in local storage
            const savedStateInLocalStorage = JSON.parse(
                localStorage.getItem(this.props.dataModel.variables.Object_Name)
            )

            // If Local storage is not empty
            if (!isObjectEmpty(savedStateInLocalStorage)) {
                const savedStateDate = format(
                    savedStateInLocalStorage.date,
                    'dddd D MMMM',
                    { locale: nlLocale }
                )

                this.setState(
                    {
                        crudObject: savedStateInLocalStorage.savedState,
                        dataLoaded: true,
                    },
                    () => {
                        toast(({ closeToast }) => (
                            <div>Opgeslagen versie van {savedStateDate}</div>
                        ))
                    }
                )

                // Else if Local Storage is empty, make an empty crud object
            } else {
                // If no saved version make a CRUD Object with empty strings
                const dataModel = this.props.dataModel
                const crudProperties = makeCrudPropertiesArray(dataModel)
                const crudObject = makeCrudObject(crudProperties)
                this.setState({
                    crudObject: crudObject,
                    dataLoaded: true,
                })
            }
        }
    }

    handleChange(event) {
        console.log('Called')

        const name = event.target.name
        const type = event.target.type

        let value = event.target.value
        if (type === 'date') {
            value = event.target.value
        }
        console.log(name)
        console.log(value)

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

    handleSubmit(event) {
        event.preventDefault()

        // Remove Local Storage Item
        const objectName = this.props.dataModel.variables.Object_Name
        localStorage.removeItem(objectName)

        // Set variables to save to the DB
        const objectID = this.props.match.params.single
        const overzichtSlug = this.props.overzichtSlug
        const ApiEndpoint = this.props.ApiEndpoint

        let crudObject = this.state.crudObject

        // Convert geldigheid values to Dates
        if (crudObject.Begin_Geldigheid !== undefined) {
            crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
        }
        if (crudObject.Eind_Geldigheid !== undefined) {
            crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
        }

        // If the user is editing an object PATCH, else POST
        if (this.state.edit) {
            axios
                .patch(`${ApiEndpoint}/${objectID}`, JSON.stringify(crudObject))
                .then(res => {
                    if (this.props.match.path.includes('api-test')) {
                        this.props.history.push(
                            `/api-test/${overzichtSlug}/${res.data.ID}`
                        )
                    } else {
                        this.props.history.push(
                            `/${overzichtSlug}/${res.data.ID}`
                        )
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            axios
                .post(`${ApiEndpoint}`, JSON.stringify(crudObject))
                .then(res => {
                    if (this.props.match.path.includes('api-test')) {
                        this.props.history.push(
                            `/api-test/${overzichtSlug}/${res.data.ID}`
                        )
                    } else {
                        this.props.history.push(
                            `/${overzichtSlug}/${res.data.ID}`
                        )
                    }
                })
                .catch(error => {
                    console.log(error)
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
        // const nieuwObject = {
        //     UUID: object.UUID,
        //     Omschrijving: omschrijving,
        // }

        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            item => item.UUID === koppelingObject.item.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName].splice(index, 1)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Relatie verwijderd.')
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

    render() {
        console.log(this.state.crudObject)

        const contextObject = {
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
        }

        return (
            <div>
                <ContainerCrudHeader
                    editStatus={this.state.edit}
                    titelMeervoud={
                        this.props.dataModel.variables.Titel_Meervoud
                    }
                    overzichtSlug={this.props.overzichtSlug}
                    titelEnkelvoud={
                        this.props.dataModel.variables.Titel_Enkelvoud
                    }
                    objectID={this.props.match.params.single}
                />
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

function ContainerCrudHeader(props) {
    let mainTitle = ''

    if (
        props.editStatus &&
        props.titelEnkelvoud.toLowerCase() !== 'beleidsregel'
    ) {
        mainTitle = `Wijzig een ${props.titelEnkelvoud.toLowerCase()}`
    } else if (
        !props.editStatus &&
        props.titelEnkelvoud.toLowerCase() !== 'beleidsregel'
    ) {
        mainTitle = `Voeg een nieuwe ${props.titelEnkelvoud.toLowerCase()} toe`
    } else if (
        props.editStatus &&
        props.titelEnkelvoud.toLowerCase() === 'beleidsregel'
    ) {
        mainTitle = `Beheer ${props.titelEnkelvoud.toLowerCase()}`
    } else if (
        !props.editStatus &&
        props.titelEnkelvoud.toLowerCase() === 'beleidsregel'
    ) {
        mainTitle = `Voeg een nieuwe ${props.titelEnkelvoud.toLowerCase()} toe`
    }

    return (
        <div className="w-full py-32 px-6 mbg-color edit-header relative">
            <div className="container mx-auto flex justify-center items-center">
                <div className="w-full pr-20">
                    {props.editStatus === false ? (
                        <ButtonBackToPage
                            terugNaar={props.titelMeervoud.toLowerCase()}
                            color="text-white"
                            url={`/${props.overzichtSlug}`}
                        />
                    ) : (
                        <ButtonBackToPage
                            terugNaar={props.titelEnkelvoud.toLowerCase()}
                            color="text-white"
                            url={`/${props.overzichtSlug}/${props.objectID}`}
                        />
                    )}
                    <h1 className="heading-serif-4xl text-white">
                        {mainTitle}
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default MuteerUniversalObjectCRUD
