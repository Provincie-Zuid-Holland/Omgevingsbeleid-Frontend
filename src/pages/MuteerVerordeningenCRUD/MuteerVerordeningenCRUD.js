import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import validator from 'validator'
import queryString from 'query-string'
import { format, isBefore } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'

// Import Components
import Artikel from './ContainerCrudFields/Artikel'
import Paragraaf from './ContainerCrudFields/Paragraaf'
import Afdeling from './ContainerCrudFields/Afdeling'
import Hoofdstuk from './ContainerCrudFields/Hoofdstuk'

import ButtonBackToPage from './../../components/ButtonBackToPage'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Create Context
import APIcontext from './APIContext'

// Import Utilities
import makeCrudProperties from './../../utils/makeCrudProperties'
import makeCrudObject from './../../utils/makeCrudObject'
import checkRequiredFields from './../../utils/checkRequiredFields'
import formatGeldigheidDatesForUI from './../../utils/formatGeldigheidDatesForUI'

class MuteerVerordeningenCRUD extends Component {
    constructor(props) {
        super(props)

        this.state = {
            crudObject: {
                Status: 'Vigerend',
                Type: this.props.match.params.type,
            },
            saving: false,
        }

        this.formatGeldigheidDatesForUI = formatGeldigheidDatesForUI.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setEditorState = this.setEditorState.bind(this)
        this.getAndSetVerordeningstructuur = this.getAndSetVerordeningstructuur.bind(
            this
        )
        this.checkForEmptyFields = this.checkForEmptyFields.bind(this)
        this.setSaveState = this.setSaveState.bind(this)
    }

    setSaveState(saveState) {
        this.setState({
            saving: saveState,
        })
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

        this.setState((prevState) => ({
            crudObject: {
                ...prevState.crudObject,
                [name]: value,
            },
        }))
    }

    // Algemene State Handler voor de Editor
    setEditorState(stateValue, fieldName) {
        this.setState((prevState) => ({
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
        Object.keys(crudObject).forEach(function (key) {
            if (dataModel.required.includes(key)) {
                const dataModelFormat = dataModel.properties[key].format

                // Check if the dataModel Type is equal to the type in the crudObject
                if (
                    dataModelFormat === 'uuid' &&
                    allFieldsComplete &&
                    !crudObject[key]
                ) {
                    toast(`Vul alle 'Personen' velden in`)
                    allFieldsComplete = false
                } else if (
                    dataModelFormat === 'uuid' &&
                    allFieldsComplete &&
                    !validator.isUUID(crudObject[key])
                ) {
                    // !REFACTOR! Validator eruit slopen en npm package verwijderen
                    toast(`Vul alle 'Personen' velden in`)
                    allFieldsComplete = false
                }
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

        const verordeningsType = this.props.match.params.type
        const dimensieConstants = this.props.dimensieConstants[
            verordeningsType.toUpperCase()
        ]
        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD

        let crudObject = this.state.crudObject

        // Converteer de 'yyyy-MM-DD' waarden naar Date objecten
        if (
            crudObject.Begin_Geldigheid !== null &&
            crudObject.Begin_Geldigheid !== ''
        ) {
            crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
        }
        if (
            crudObject.Eind_Geldigheid !== null &&
            crudObject.Eind_Geldigheid !== ''
        ) {
            crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
        }

        const that = this

        // Check of de verplichte velden zijn ingevuld als het een beleidsbeslissing is
        // !REFACTOR! - velden check voor andere dimensies (Bespreken STUM)
        const alleVeldenIngevuld = checkRequiredFields(
            crudObject,
            dimensieConstants,
            titelEnkelvoud
        )

        if (!alleVeldenIngevuld) {
            this.setState({
                crudObject: this.formatGeldigheidDatesForUI(crudObject),
            })
            return
        }

        function getQueryStringValues(urlParams) {
            const queryStringValues = queryString.parse(urlParams)
            const hoofdstukIndex = queryStringValues.hoofdstuk
            const nest_1 = queryStringValues.nest_1
            const nest_2 = queryStringValues.nest_2
            const nest_3 = queryStringValues.nest_3
            return [hoofdstukIndex, nest_1, nest_2, nest_3]
        }

        function saveNewVerordening(crudObject, callback) {
            axios
                .post(`/verordeningen`, JSON.stringify(crudObject))
                .then((res) => {
                    callback(res.data)
                })
                .catch((error) => {
                    toast(`Er is iets misgegaan`)
                    that.setSaveState(false)
                })
        }

        function patchVerordening(crudObject, verordeningsID, callback) {
            axios
                .patch(
                    `/verordeningen/${verordeningsID}`,
                    JSON.stringify(crudObject)
                )
                .then((res) => {
                    callback(res.data)
                })
                .catch((error) => {
                    toast(`Er is iets misgegaan`)
                    that.setSaveState(false)
                })
        }

        function voegNieuweVerordeningToeInStructuur(
            newVerordeningsChild,
            lineage,
            hoofdstukIndex,
            nest_1,
            nest_2,
            nest_3
        ) {
            if (nest_3 !== 'null') {
                lineage.Structuur.Children[hoofdstukIndex].Children[
                    nest_1
                ].Children[nest_2].Children.splice(
                    nest_3,
                    0,
                    newVerordeningsChild
                )
            } else if (nest_2 !== 'null') {
                lineage.Structuur.Children[hoofdstukIndex].Children[
                    nest_1
                ].Children.splice(nest_2, 0, newVerordeningsChild)
            } else if (nest_1 !== 'null') {
                lineage.Structuur.Children[hoofdstukIndex].Children.splice(
                    nest_1,
                    0,
                    newVerordeningsChild
                )
            } else {
                lineage.Structuur.Children.splice(
                    hoofdstukIndex,
                    0,
                    newVerordeningsChild
                )
            }
            return lineage
        }

        function vervangUUIDVerordeningInStructuur(
            oldVerordeningsUUID,
            newVerordeningsUUID,
            lineage,
            hoofdstukIndex,
            nest_1,
            nest_2,
            nest_3
        ) {
            if (nest_3 !== 'null') {
                lineage.Structuur.Children[hoofdstukIndex].Children[
                    nest_1
                ].Children[nest_2].Children.forEach((item) => {
                    if (item.UUID === oldVerordeningsUUID) {
                        item.UUID = newVerordeningsUUID
                    }
                })
            } else if (nest_2 !== 'null') {
                const nestedArray = lineage.Structuur.Children[
                    hoofdstukIndex
                ].Children[nest_1].Children.forEach((item) => {
                    if (item.UUID === oldVerordeningsUUID) {
                        item.UUID = newVerordeningsUUID
                    }
                })
            } else if (nest_1 !== 'null') {
                lineage.Structuur.Children[hoofdstukIndex].Children.forEach(
                    (item) => {
                        if (item.UUID === oldVerordeningsUUID) {
                            item.UUID = newVerordeningsUUID
                        }
                    }
                )
            } else {
                lineage.Structuur.Children.forEach((item) => {
                    if (item.UUID === oldVerordeningsUUID) {
                        item.UUID = newVerordeningsUUID
                    }
                })
            }
            return lineage
        }

        function patchNewStructuur(
            response,
            urlParams,
            lineage,
            lineageID,
            oldVerordeningsUUID,
            history
        ) {
            const newVerordeningsUUID = response.UUID
            const [
                hoofdstukIndex,
                nest_1,
                nest_2,
                nest_3,
            ] = getQueryStringValues(urlParams)

            newLineage = vervangUUIDVerordeningInStructuur(
                oldVerordeningsUUID,
                newVerordeningsUUID,
                lineage,
                hoofdstukIndex,
                nest_1,
                nest_2,
                nest_3
            )

            const verordeningsStructuurPostObject = {
                Structuur: newLineage.Structuur,
            }

            axios
                .patch(
                    `/verordeningstructuur/${lineageID}`,
                    verordeningsStructuurPostObject
                )
                .then((res) => {
                    that.setSaveState(false)
                    history.push(
                        `/muteer/verordeningen/${lineageID}?actiefHoofdstuk=${hoofdstukIndex}`
                    )
                })
                .catch((err) => console.log(err))
        }

        function saveNewStructuur(
            response,
            urlParams,
            lineage,
            lineageID,
            history
        ) {
            const UUID = response.UUID
            const newVerordeningsChild = {
                UUID: UUID,
                Children: [],
            }

            const [
                hoofdstukIndex,
                nest_1,
                nest_2,
                nest_3,
            ] = getQueryStringValues(urlParams)

            newLineage = voegNieuweVerordeningToeInStructuur(
                newVerordeningsChild,
                lineage,
                hoofdstukIndex,
                nest_1,
                nest_2,
                nest_3
            )

            const verordeningsStructuurPostObject = {
                Structuur: newLineage.Structuur,
            }

            axios
                .patch(
                    `/verordeningstructuur/${lineageID}`,
                    verordeningsStructuurPostObject
                )
                .then((res) => {
                    history.push(
                        `/muteer/verordeningen/${lineageID}?actiefHoofdstuk=${hoofdstukIndex}`
                    )
                })
                .catch((err) => {
                    console.log(err)
                    that.setSaveState(false)
                    toast(`Er is iets misgegaan`)
                })
        }

        const urlParams = this.props.location.search
        const lineageID = this.props.match.params.lineageID
        const verordeningsID = this.props.match.params.verordeningsID
        const oldVerordeningsUUID = this.props.match.params.verordeningsUUID
        const history = this.props.history
        let newLineage = { ...this.state.lineage }

        // !REFACTOR! / !SWEN!
        delete crudObject.Weblink

        // Toon spinning loader in Opslaan button
        this.setSaveState(true)

        if (this.state.edit) {
            patchVerordening(crudObject, verordeningsID, (response) => {
                patchNewStructuur(
                    response,
                    urlParams,
                    newLineage,
                    lineageID,
                    oldVerordeningsUUID,
                    history
                )
            })
        } else {
            saveNewVerordening(crudObject, (response) => {
                saveNewStructuur(
                    response,
                    urlParams,
                    newLineage,
                    lineageID,
                    history
                )
            })
        }
    }

    getAndSetVerordeningstructuur(ID) {
        axios
            .get(`/verordeningstructuur/${ID}`)
            .then((res) => {
                // Get latest lineage
                const lineage = res.data[res.data.length - 1]
                this.setState({
                    lineage: lineage,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // responseObjectFromAPI wordt meegegeven als parameter wanneer de pagina een 'version' pagina is
    createAndSetCrudObject(responseObjectFromAPI) {
        const verordeningsType = this.props.match.params.type
        const dimensieConstants = this.props.dimensieConstants[
            verordeningsType.toUpperCase()
        ]
        const crudProperties = makeCrudProperties(dimensieConstants)
        let crudObject = makeCrudObject({
            crudProperties: crudProperties,
            dimensieConstants: dimensieConstants,
            responseObject: responseObjectFromAPI,
        })

        this.setState({
            crudObject: crudObject,
            dataLoaded: true,
        })
    }

    getAndSetVerordening() {
        // const dataModel = this.props.dataModel
        const objectID = this.props.match.params.verordeningsUUID
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        // Connect with API and get data
        axios
            .get(`${apiEndpoint}/version/${objectID}`)
            .then((res) => {
                const responseObject = res.data
                this.createAndSetCrudObject(responseObject)
            })
            .catch((error) => toast(`Er is iets misgegaan`))
    }

    getHeaderTekst(type) {
        if (this.state.edit) {
            switch (type) {
                case 'Hoofdstuk':
                    return 'Wijzig het hoofdstuk'
                case 'Afdeling':
                    return 'Wijzig de afdeling'
                case 'Paragraaf':
                    return 'Wijzig de paragraaf'
                case 'Artikel':
                    return 'Wijzig het artikel'
            }
        } else {
            switch (type) {
                case 'Hoofdstuk':
                    return 'Voeg een nieuw hoofdstuk toe'
                case 'Afdeling':
                    return 'Voeg een nieuwe afdeling toe'
                case 'Paragraaf':
                    return 'Voeg een nieuwe paragraaf toe'
                case 'Artikel':
                    return 'Voeg een nieuw artikel toe'
            }
        }
    }

    returnContainerCrudFields(type) {
        switch (type) {
            case 'Hoofdstuk':
                return <Hoofdstuk />
            case 'Afdeling':
                return <Afdeling />
            case 'Paragraaf':
                return <Paragraaf />
            case 'Artikel':
                return <Artikel />
        }
    }

    componentDidMount() {
        const ID = this.props.match.params.lineageID

        // Get Lineage
        this.getAndSetVerordeningstructuur(ID)

        if (this.props.editState) {
            // Als er een waarde in de single parameter zit bewerkt de gebruiker een bestaand object
            this.setState(
                {
                    edit: true,
                },
                () => {
                    this.getAndSetVerordening()
                }
            )
        } else {
            // Anders maakt de gebruiker een nieuw object aan
            this.createAndSetCrudObject()
        }
    }

    render() {
        const dimensieConstants = this.props.dimensieConstants
        const objectID = this.props.match.params.verordeningsUUID
        const verordeningsType = this.props.match.params.type

        const contextObject = {
            titelEnkelvoud:
                dimensieConstants[verordeningsType.toUpperCase()]
                    .TITEL_ENKELVOUD,
            titelMeervoud:
                dimensieConstants[verordeningsType.toUpperCase()]
                    .TITEL_MEERVOUD,
            objectID: objectID,
            editStatus: this.state.edit,
            handleSubmit: this.handleSubmit,
            handleChange: this.handleChange,
            crudObject: this.state.crudObject,
            setEditorState: this.setEditorState,
            Van_Beleidsbeslissing_Titel: this.state.Van_Beleidsbeslissing_Titel,
            saving: this.state.saving,
        }

        const verordeningType = this.props.match.params.type
        const lineageID = this.props.match.params.lineageID
        const verordeningsUUID = this.props.match.params.verordeningsUUID
        const searchParams = this.props.location.search
        const headerTekst = this.getHeaderTekst(verordeningType)

        return (
            <div>
                <Helmet>
                    <title>
                        {contextObject.editStatus
                            ? `Omgevingsbeleid - Wijzig de verordening`
                            : `Omgevingsbeleid - Voeg een nieuwe verordening toe`}
                    </title>
                </Helmet>
                <div className="relative w-full px-6 py-32 mbg-color edit-header">
                    <div className="container flex items-center justify-center mx-auto lg:px-10">
                        <div className="w-full pr-20">
                            <ButtonBackToPage
                                terugNaar={
                                    this.state.edit
                                        ? verordeningType.toLowerCase()
                                        : `verordening`
                                }
                                color="text-white"
                                url={
                                    this.state.edit
                                        ? `/muteer/verordeningen/${lineageID}/${verordeningType}/${verordeningsUUID}${searchParams}`
                                        : `/muteer/verordeningen/${lineageID}`
                                }
                            />
                            <h1 className="text-white heading-serif-4xl">
                                {headerTekst}
                            </h1>
                        </div>
                    </div>
                </div>
                <APIcontext.Provider value={contextObject}>
                    {this.returnContainerCrudFields(verordeningType)}
                </APIcontext.Provider>
            </div>
        )
    }
}

export default withRouter(MuteerVerordeningenCRUD)
