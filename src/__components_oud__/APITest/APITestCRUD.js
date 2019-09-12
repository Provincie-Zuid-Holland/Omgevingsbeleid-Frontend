import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { APIcontext } from '../Context/APIcontext'
import CrudContainer from '../Containers/CrudContainer'

// Import Axios instance to connect with the API
import axiosAPI from './../../API/axios'

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

class APITestCRUD extends Component {
    constructor(props) {
        super(props)

        // CrudObject contains the editable fields
        this.state = {
            edit: false,
            crudObject: {},
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setEditorState = this.setEditorState.bind(this)
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
            if (!isObjectEmpty(savedStateInLocalStorage.savedState)) {
                savedStateDate = format(
                    savedStateInLocalStorage.date,
                    'dddd D MMMM',
                    { locale: nlLocale }
                )
                savedStateEmpty = false
            }

            // Connect with API and get data from there
            axiosAPI
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
                })
            }
        }
    }

    handleChange(event) {
        const name = event.target.name
        const type = event.target.type

        let value = event.target.value
        if (type === 'date') {
            value = event.target.value
        }

        this.setState(prevState => ({
            crudObject: {
                ...prevState.crudObject,
                [name]: value,
            },
        }))
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
            axiosAPI
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
            axiosAPI
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

    componentDidUpdate() {
        // Save to LocalStorage
        // If page === edit set Key to Name_UUID
        // If page === new set Key to Name

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
            titelEnkelvoud: this.props.dataModel.variables.Titel_Enkelvoud,
            titelMeervoud: this.props.dataModel.variables.Titel_Meervoud,
            overzichtSlug: this.props.overzichtSlug,
            objectID: this.props.match.params.single,
            editStatus: this.state.edit,
            handleSubmit: this.handleSubmit,
            handleChange: this.handleChange,
            crudObject: this.state.crudObject,
            setEditorState: this.setEditorState,
        }

        // False if data is loading, true if there is a response
        // let dataPending = isObjectEmpty(this.state.crudObject)
        let dataPending = isObjectEmpty(this.state.crudObject)

        return (
            <div>
                {dataPending ? null : (
                    <APIcontext.Provider value={contextObject}>
                        <CrudContainer />
                    </APIcontext.Provider>
                )}
            </div>
        )
    }
}

export default APITestCRUD
