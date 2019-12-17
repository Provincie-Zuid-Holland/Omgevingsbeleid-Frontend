import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { Helmet } from 'react-helmet'
import validator from 'validator'

// Import Components
import ContainerCrudFields from './ContainerCrudFields'
import LoaderContent from './../../components/LoaderContent'
import ContainerCrudHeader from './ContainerCrudHeader'

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
// Response object is the response object from the API call with existing data
function makeCrudObject(array, responseObject) {
    const koppelingenKeysArray = [
        'Ambities',
        'Belangen',
        'BeleidsRegels',
        'Doelen',
        'Maatregelen',
        'Opgaven',
        'Themas',
        'Verordening',
        'WerkingsGebieden',
    ]

    let crudObject = {}
    if (isObjectEmpty(responseObject)) {
        array.forEach(arrayItem => {
            // console.log(crudObject)
            if (koppelingenKeysArray.includes(arrayItem)) {
                // Als het een koppeling Array item is moet de value een array zijn
                crudObject[arrayItem] = []
            } else if (
                arrayItem === 'Verplicht_Programma' ||
                arrayItem === 'Specifiek_Of_Generiek'
            ) {
                crudObject[[arrayItem][0]] = ' - selecteer een optie - '
            } else {
                crudObject[arrayItem] = ''
            }
        })
        console.log('Joe')
    } else {
        console.log('Joe2')
        array.forEach(arrayItem => {
            crudObject[[arrayItem][0]] = responseObject[arrayItem]
        })
    }
    console.log('CRUDOBJECT:')
    console.log(crudObject)
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
        this.checkForEmptyFields = this.checkForEmptyFields.bind(this)
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
                false
                // savedStateInLocalStorage !== null &&
                // !isObjectEmpty(savedStateInLocalStorage.savedState)
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
                    // responseObject.sort(function(a, b) {
                    //     return (
                    //         new Date(b.Modified_Date) -
                    //         new Date(a.Modified_Date)
                    //     )
                    // })
                    const UUID = responseObject[0].UUID
                    console.log(responseObject[0].Eind_Geldigheid)
                    const crudProperties = makeCrudPropertiesArray(dataModel)
                    const crudObject = makeCrudObject(
                        crudProperties,
                        responseObject[0]
                    )
                    console.log(crudObject.Eind_Geldigheid)
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
                                UUID: UUID,
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
                            UUID: UUID,
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
            // if (!isObjectEmpty(savedStateInLocalStorage)) {
            if (false) {
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
                console.log('No LS!')
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

    handleChange(event, metaInfo, dataProp) {
        let value
        let name

        // Get Value
        if (metaInfo && metaInfo.action === 'clear') {
            // If value comes from react-select comp and action is to clear the component
            value = null
            name = dataProp
        } else {
            value = event.target.value
            name = event.target.name

            const type = event.target.type
            if (type === 'date') {
                value = event.target.value
            }
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

    checkForEmptyFields(crudObject) {
        const dataModel = this.props.dataModel
        let allFieldsComplete = true
        // let requiredProperties = []
        // let requiredPropertyTypes = {}
        // Ga voor elk veld van het crudObject na of het een required field is
        Object.keys(crudObject).forEach(function(key, index) {
            if (dataModel.required.includes(key)) {
                const dataModelFormat = dataModel.properties[key].format

                // // Check if the dataModel Type is equal to the type in the crudObject
                // if (
                //     dataModelFormat === 'uuid' &&
                //     allFieldsComplete &&
                //     !crudObject[key]
                // ) {
                //     toast(`Vul alle 'Personen' velden in`)
                //     allFieldsComplete = false
                // } else if (
                //     dataModelFormat === 'uuid' &&
                //     allFieldsComplete &&
                //     !validator.isUUID(crudObject[key])
                // ) {
                //     toast(`Vul alle 'Personen' velden in`)
                //     allFieldsComplete = false
                // }

                // Check UUID's. If there is none set 0000
                if (
                    crudObject[key] !== null &&
                    dataModelFormat === 'uuid' &&
                    allFieldsComplete &&
                    !validator.isUUID(crudObject[key])
                ) {
                    // allFieldsComplete = false
                    crudObject[key] = '00000000-0000-0000-0000-000000000000'
                }

                // // Push de key naar de requiredProperties array
                // requiredProperties.push(key)
                // // Push het type en het format naar het requiredPropertyTypes object
                // requiredPropertyTypes[key] = {
                //     type: dataModel.properties[key].type,
                //     format: dataModel.properties[key].format,
                // }
            }
        })
        return allFieldsComplete

        // Als het een required field is, kijk of het type overeen komt met die in het dataModel
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

        // Remove Local Storage Item
        const objectName = this.props.dataModel.variables.Object_Name
        localStorage.removeItem(objectName)

        // Set variables to save to the DB
        const objectID = this.props.match.params.single
        const overzichtSlug = this.props.overzichtSlug
        const ApiEndpoint = this.props.ApiEndpoint

        let crudObject = this.state.crudObject

        // Zet de Date String om naar een Date Object en kijkt of deze geldig is
        crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
        // if (this.validateDate(crudObject.Begin_Geldigheid)) {
        //     // Datum is geldig
        // } else {
        //     toast('Vul een inwerkingtreding datum in')
        //     return
        // }

        crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
        // if (this.validateDate(crudObject.Eind_Geldigheid)) {
        //     // Datum is geldig
        // } else {
        //     toast('Vul een uitwerkingtreding datum in')
        //     return
        // }

        if (crudObject.Titel !== undefined && crudObject.Titel === '') {
            toast('Vul een titel in')
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
            this.setState(
                {
                    crudObject: crudObject,
                },
                () => console.log(this.state)
            )
            return
        }

        // Voordat we hem PATCHEN of POSTEN kijken we of er nog velden leeg zijn die verplicht zijn
        if (!this.checkForEmptyFields(this.state.crudObject)) {
            return
        }

        // If the user is editing an object PATCH, else POST
        if (this.state.edit) {
            axios
                .patch(`${ApiEndpoint}/${objectID}`, JSON.stringify(crudObject))
                .then(res => {
                    console.log(res.data.ID)
                    this.props.history.push(
                        `/muteer/${overzichtSlug}/${res.data.ID}`
                    )
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
                    this.setState(
                        {
                            crudObject: crudObject,
                        },
                        () => console.log(this.state)
                    )
                })
        } else {
            // Als het object endpoint beleidsrelaties is moeten we het crudObject nog aanpassen
            if (ApiEndpoint === 'beleidsrelaties') {
                crudObject.Status = 'Open'
                crudObject.Aanvraag_Datum = new Date()
            }

            axios
                .post(`${ApiEndpoint}`, JSON.stringify(crudObject))
                .then(res => {
                    this.props.history.push(
                        `/muteer/${overzichtSlug}/${res.data.ID}`
                    )
                    toast('Opgeslagen')
                })
                .catch(error => {
                    console.log(error)

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
                    this.setState(
                        {
                            crudObject: crudObject,
                        },
                        () => console.log(this.state)
                    )
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
        }

        return (
            <div>
                <Helmet>
                    <title>
                        {contextObject.editStatus
                            ? `Omgevingsbeleid - Wijzig ${
                                  contextObject.titelEnkelvoud
                              }${' '}
                            ${contextObject.objectID}`
                            : `Omgevingsbeleid - Voeg een nieuwe${' '}
                            ${contextObject.titelEnkelvoud}${' '}
                              toe`}
                    </title>
                </Helmet>
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

export default MuteerUniversalObjectCRUD
