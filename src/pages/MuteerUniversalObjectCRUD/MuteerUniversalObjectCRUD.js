import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { Helmet } from "react-helmet"
import cloneDeep from "lodash.clonedeep"
import * as axiosPackage from "axios"

// Import Components
import ContainerCrudHeader from "./ContainerCrudHeader"
import LoaderContent from "./../../components/LoaderContent"
import ButtonSubmitFixed from "./../../components/ButtonSubmitFixed"
import ContainerMain from "./../../components/ContainerMain"

// Import FormFieldContainers
import FormFieldContainerAmbities from "./FormFieldContainers/FormFieldContainerAmbities"
import FormFieldContainerBelangen from "./FormFieldContainers/FormFieldContainerBelangen"
import FormFieldContainerBeleidsregels from "./FormFieldContainers/FormFieldContainerBeleidsregels"
import FormFieldContainerBeleidskeuzes from "./FormFieldContainers/FormFieldContainerBeleidskeuzes"
import FormFieldContainerMaatregelen from "./FormFieldContainers/FormFieldContainerMaatregelen"
import FormFieldContainerBeleidsdoelen from "./FormFieldContainers/FormFieldContainerBeleidsdoelen"
import FormFieldContainerThemas from "./FormFieldContainers/FormFieldContainerThemas"
import FormFieldContainerBeleidsprestaties from "./FormFieldContainers/FormFieldContainerBeleidsprestaties"
import FormFieldContainerBeleidsmodules from "./FormFieldContainers/FormFieldContainerBeleidsmodules"

// Import Axios instance to connect with the API
import axios from "./../../API/axios"

// Import Utilities
import scrollToElement from "./../../utils/scrollToElement"
import isEndDateBeforeStartDate from "./../../utils/isEndDateBeforeStartDate"
import makeCrudProperties from "./../../utils/makeCrudProperties"
import makeCrudObject from "./../../utils/makeCrudObject"
import checkContainsRequiredUnfilledField from "./../../utils/checkContainsRequiredUnfilledField"
import formatGeldigheidDatesForUI from "./../../utils/formatGeldigheidDatesForUI"
import formatGeldigheidDatesForAPI from "./../../utils/formatGeldigheidDatesForAPI"
import handleError from "./../../utils/handleError"
import { checkIfUserIsAllowedOnPage } from "../../utils/checkIfUserIsAllowedOnPage"
import { toastNotification } from "../../utils/toastNotification"
import { removeEmptyCRUDProperties } from "../../utils/removeEmptyCRUDProperties"
import { isDateInAValidRange } from "../../utils/isDateInAValidRange"

/**
 * @param {object} authUser - contains the logged in user object
 * @param {object} dimensieConstants - Contains all the properties of the policy object (see the src/constants folder)
 * @returns a page where the user can create new or edit existing policy objects
 */
class MuteerUniversalObjectCRUD extends Component {
    constructor(props) {
        super(props)

        /**
         * @param {boolean} edit - Indicates if the user is editing an existing policy object
         * @param {object} crudObject - Contains an object that holds all the properties we can edit on the policy object
         * @param {boolean} dataLoaded - Indicates if all the data from the API has been loaded
         */
        this.state = {
            edit: false,
            crudObject: {},
            dataLoaded: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.prepareForRequest = this.prepareForRequest.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.voegKoppelingRelatieToe = this.voegKoppelingRelatieToe.bind(this)
        this.wijzigKoppelingRelatie = this.wijzigKoppelingRelatie.bind(this)
        this.verwijderKoppelingRelatie = this.verwijderKoppelingRelatie.bind(
            this
        )
        this.getAndSetDimensieDataFromApi = this.getAndSetDimensieDataFromApi.bind(
            this
        )
    }

    /**
     *
     * @param {object} event - Contains the event object
     * @param {undefined|object} metaInfo - Optional parameter that contains an object with meta info about the executed action from a react-select <Select> element
     * @param {undefined|string} dataProp - Optional parameter containing a property name to reset the value of from a react-select <Select> element
     */
    handleChange(event, metaInfo, dataProp) {
        let value
        let name

        if (metaInfo && metaInfo.action === "clear") {
            /** This is the case when the user clicks the 'x' icon in a react-select <Select> component */
            value = null
            name = dataProp
        } else {
            value = event.target.value
            name = event.target.name

            const type = event.target.type
            if (type === "date") {
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

    /**
     * Function to POST a policy object to the API
     * @param {object} crudObject - Contains the policy object with updated values
     */
    postDimensieObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

        axios
            .post(`${apiEndpoint}`, JSON.stringify(crudObject))
            .then((res) => {
                this.props.history.push(
                    `/muteer/${overzichtSlug}/${res.data.ID}${
                        this.props.location.hash === "#mijn-beleid"
                            ? "#mijn-beleid"
                            : ""
                    }`
                )
                toastNotification({ type: "saved" })
            })
            .catch((err) => {
                handleError(err)
            })
    }

    /**
     * Function to PATCH a policy object to the API
     * @param {object} crudObject - Contains the policy object with updated values
     */
    patchDimensieObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const objectID = this.props.match.params.single
        const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

        axios
            .patch(`${apiEndpoint}/${objectID}`, JSON.stringify(crudObject), {
                cancelToken: this.axiosCancelSource.token,
            })
            .then((res) => {
                this.props.history.push(
                    `/muteer/${overzichtSlug}/${res.data.ID}${
                        this.props.location.hash === "#mijn-beleid"
                            ? "#mijn-beleid"
                            : ""
                    }`
                )
                toastNotification({ type: "saved" })
            })
            .catch((err) => {
                handleError(err)
            })
    }

    /**
     * Submit handler
     * @param {object} event - Event object
     */
    handleSubmit(event) {
        event.preventDefault()

        let crudObject = cloneDeep(this.state.crudObject)

        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const titleSingular = dimensieConstants.TITLE_SINGULAR
        const params = new URL(document.location).searchParams
        const modus = params.get("modus")
        const isWijzigVigerend = modus === "wijzig_vigerend"

        /** Check if all the required fields are filled in */
        if (
            checkContainsRequiredUnfilledField(
                crudObject,
                dimensieConstants,
                titleSingular,
                isWijzigVigerend
            )
        ) {
            return
        }

        /** Check if the ending validity date is before the starting validity date */
        if (isEndDateBeforeStartDate(crudObject)) {
            scrollToElement(
                `form-field-${titleSingular.toLowerCase()}-eind_geldigheid`
            )
            toastNotification({ type: "end date before start date" })

            return
        }

        /** Check if the start date is in a valid range */
        if (!crudObject.Besluit_Datum) {        
        const [
            startDateIsInValidRange,
            endDateIsInValidRange,
        ] = isDateInAValidRange(crudObject)

        const beginGeldigheidIsNotEmpty =
            crudObject.Begin_Geldigheid !== "1753-01-01" &&
            crudObject.Begin_Geldigheid !== null &&
            crudObject.Begin_Geldigheid !== ""

        const eindGeldigheidIsNotEmpty =
            crudObject.Eind_Geldigheid !== "10000-01-01" &&
            crudObject.Eind_Geldigheid !== null &&
            crudObject.Eind_Geldigheid !== ""

        if (!startDateIsInValidRange && beginGeldigheidIsNotEmpty) {
            scrollToElement(
                `form-field-${titleSingular.toLowerCase()}-begin_geldigheid`
            )
            toastNotification({ type: "start date valid range" })

            return
        } else if (!endDateIsInValidRange && eindGeldigheidIsNotEmpty) {
            scrollToElement(
                `form-field-${titleSingular.toLowerCase()}-eind_geldigheid`
            )
            toastNotification({ type: "end date valid range" })

            return
            }
        }

        /** Prepare CRUD Object for the API */
        crudObject = formatGeldigheidDatesForAPI(crudObject)
        crudObject = removeEmptyCRUDProperties(crudObject)

        /** If the user is editing an existing object we PATCH it, else we POST it to create a new object */
        const typeOfRequest = this.state.edit ? "PATCH" : "POST"

        if (typeOfRequest === "PATCH") {
            crudObject = this.prepareForRequest(crudObject, "patch")
            this.patchDimensieObject(crudObject)
        } else if (typeOfRequest === "POST") {
            /** If we POST an object to the 'beleidsrelaties' endpoint we need to add these properties */
            if (apiEndpoint === "beleidsrelaties") {
                crudObject.Status = "Open"
                crudObject.Aanvraag_Datum = new Date()
            }

            crudObject = this.prepareForRequest(crudObject, "post")
            this.postDimensieObject(crudObject)
        }
    }

    /**
     * Function to prepare the crudObject for the API
     * @param {object} crudObject - Contains the policy object that holds the updated values
     * @param {string} type - String indicating if it is a 'post' or a 'patch' request
     * @returns {object} - Prepared object for the request
     */
    prepareForRequest(crudObject, type) {
        // Get the connections
        const getConnectionProperties = () => {
            const crudProperties = this.props.dimensieConstants.CRUD_PROPERTIES
            const connectionKeys = Object.keys(crudProperties).filter(
                (key) => crudProperties[key].type === "connection"
            )
            return connectionKeys
        }

        const connectionProperties = getConnectionProperties()

        connectionProperties.forEach((key) => {
            crudObject[key].forEach((connection, index) => {
                crudObject[key][index] = {
                    UUID: connection.Object.UUID,
                    Koppeling_Omschrijving: connection.Koppeling_Omschrijving,
                }
            })
        })

        crudObject?.Werkingsgebieden?.forEach((gebied, index) => {
            crudObject.Werkingsgebieden[index] = { UUID: gebied.Object.UUID }
        })

        if (crudObject.Gebied && crudObject.Gebied.UUID) {
            crudObject.Gebied = crudObject.Gebied.UUID
        }

        if (type === "post") return crudObject

        // Continue prepping the object for a PATCH Request
        const eigenaren = [
            "Eigenaar_1",
            "Eigenaar_2",
            "Opdrachtgever",
            "Portefeuillehouder_1",
            "Portefeuillehouder_2",
        ]

        eigenaren.forEach((eigenaar) => {
            if (!crudObject.hasOwnProperty(eigenaar)) return
            if (
                typeof crudObject[eigenaar] === "object" &&
                crudObject[eigenaar] !== null
            ) {
                crudObject[eigenaar] = crudObject[eigenaar].UUID
            }
        })

        return crudObject
    }

    /**
     *
     * @param {string} propertyName - Property name of the connection
     * @param {object} object - Policy object for the connection
     * @param {string} omschrijving - Description of the connection
     * @param {function} callback - Callback that is passed the updated object
     */
    voegKoppelingRelatieToe(propertyName, object, omschrijving, callback) {
        const nieuwObject = {
            Koppeling_Omschrijving: omschrijving,
            Object: {
                UUID: object.UUID,
                Titel: object.Titel,
                Type: object.Type,
            },
        }

        let nieuwCrudObject = this.state.crudObject

        if (typeof nieuwCrudObject[propertyName] === "string") {
            nieuwCrudObject[propertyName] = []
        }

        nieuwCrudObject[propertyName].push(nieuwObject)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => {
                toastNotification({ type: "connection added" })
                callback(nieuwCrudObject)
            }
        )
    }

    /**
     * Function to update a connection
     * @param {object} koppelingObject - Connection object
     * @param {string} nieuweOmschrijving - New description of the connection
     * @param {function} callback - Callback that is passed the updated object
     */
    wijzigKoppelingRelatie(koppelingObject, nieuweOmschrijving, callback) {
        let nieuwCrudObject = this.state.crudObject

        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            (item) => item.Object.UUID === koppelingObject.item.Object.UUID
        )

        nieuwCrudObject[koppelingObject.propertyName][
            index
        ].Koppeling_Omschrijving = nieuweOmschrijving

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => {
                toastNotification({ type: "connection modified" })
                callback(nieuwCrudObject)
            }
        )
    }

    /**
     * Function to remove a connection
     * @param {object} koppelingObject - Connection object
     */
    verwijderKoppelingRelatie(koppelingObject) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            (item) => item.Object.UUID === koppelingObject.item.Object.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName].splice(index, 1)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toastNotification({ type: "connection deleted" })
        )
    }

    /**
     * Function to initialize an empty crudObject when the user is POST'ing a new policy object
     * @param {undefined|object} responseObjectFromAPI - Undefined when the user is creating a new policy object, an object when the user is editing an existing object
     */
    createAndSetCrudObject(responseObjectFromAPI) {
        const dimensieConstants = this.props.dimensieConstants
        const crudProperties = makeCrudProperties(dimensieConstants)

        let params = new URL(document.location).searchParams
        let modus = params.get("modus")

        let crudObject = makeCrudObject({
            crudProperties: crudProperties,
            dimensieConstants: dimensieConstants,
            existingObj: responseObjectFromAPI,
            modus: modus,
        })

        this.setState({
            crudObject: crudObject,
            dataLoaded: true,
        })
    }

    /**
     * Gets the policy object from the API and set it in state as the crudObject
     */
    getAndSetDimensieDataFromApi() {
        const objectID = this.props.match.params.single
        const dimensieConstants = this.props.dimensieConstants
        const titleSingular = dimensieConstants.TITLE_SINGULAR
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        let params = new URL(document.location).searchParams

        const isMaatregelOrBeleidskeuze =
            titleSingular === "Maatregel" || titleSingular === "Beleidskeuze"

        /** If modus equals 'wijzig_vigerend', the user is editing a policy object that has a status of 'vigerend' */
        let modus = params.get("modus")
        const isWijzigVigerendOrOntwerpMaken =
            (modus && modus === "wijzig_vigerend") ||
            (modus && modus === "ontwerp_maken")

        axios
            .get(`${apiEndpoint}/${objectID}`, {
                cancelToken: this.axiosCancelSource.token,
            })
            .then((res) => {
                const responseObject = res.data
                let crudObject = null

                /** Check if user is allowed */
                const isUserAllowed = checkIfUserIsAllowedOnPage({
                    object: responseObject[0],
                    authUser: this.props.authUser,
                })
                if (!isUserAllowed) {
                    toastNotification({
                        type: "user is not authenticated for this page",
                    })
                    this.props.history.push("/muteer/dashboard")
                }

                if (
                    isMaatregelOrBeleidskeuze &&
                    isWijzigVigerendOrOntwerpMaken
                ) {
                    // Get the first object with a status of 'Vigerend'
                    crudObject = responseObject.find(
                        (e) => e.Status === "Vigerend"
                    )
                } else if (
                    titleSingular === "Beleidskeuze" ||
                    titleSingular === "Maatregel"
                ) {
                    crudObject = responseObject.find(
                        (e) => e.Aanpassing_Op === null
                    )
                } else {
                    crudObject = responseObject[0]
                }

                crudObject = formatGeldigheidDatesForUI(crudObject)
                this.createAndSetCrudObject(crudObject)
            })
            .catch((err) => {
                console.warn(err)
                toastNotification("standard error")
            })
    }

    componentDidMount() {
        this.axiosCancelSource = axiosPackage.CancelToken.source()

        if (this.props.match.params.single) {
            /** URL Contains a single parameter, indicating that the user is editing an existing policy object */
            this.setState(
                {
                    edit: true,
                },
                () => {
                    this.getAndSetDimensieDataFromApi()
                }
            )
        } else {
            /** User is creating a new object */
            this.createAndSetCrudObject()
        }
    }

    componentWillUnmount() {
        this.axiosCancelSource.cancel("Axios request canceled.")
    }

    render() {
        const dimensieConstants = this.props.dimensieConstants
        const titleSingular = dimensieConstants.TITLE_SINGULAR
        const titelMeervoud = dimensieConstants.TITLE_PLURAL
        const overzichtSlug = dimensieConstants.SLUG_OVERVIEW
        const objectID = this.props.match.params.single
        const editStatus = this.state.edit
        const crudObject = this.state.crudObject
        const dataLoaded = this.state.dataLoaded
        const objectTitle = this.state.crudObject.Titel
        const handleChange = this.handleChange

        return (
            <div>
                <Helmet>
                    <title>
                        {editStatus
                            ? `Omgevingsbeleid - ${
                                  objectTitle ? objectTitle : ""
                              }`
                            : `Omgevingsbeleid - Voeg een nieuwe ${titleSingular} toe`}
                    </title>
                </Helmet>

                <ContainerCrudHeader
                    dataLoaded={dataLoaded}
                    objectTitle={objectTitle}
                    editStatus={editStatus}
                    titelMeervoud={titelMeervoud}
                    overzichtSlug={overzichtSlug}
                    titleSingular={titleSingular}
                    objectID={objectID}
                />

                {this.state.dataLoaded ? (
                    <ContainerMain>
                        <div className="flex-grow inline-block w-full">
                            <div>
                                <form className="mt-12">
                                    {titleSingular === "Ambitie" ? (
                                        <FormFieldContainerAmbities
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Beleidsmodule" ? (
                                        <FormFieldContainerBeleidsmodules
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Belang" ? (
                                        <FormFieldContainerBelangen
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Beleidsregel" ? (
                                        <FormFieldContainerBeleidsregels
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Beleidskeuze" ? (
                                        <FormFieldContainerBeleidskeuzes
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                            editStatus={editStatus}
                                            voegKoppelingRelatieToe={
                                                this.voegKoppelingRelatieToe
                                            }
                                            wijzigKoppelingRelatie={
                                                this.wijzigKoppelingRelatie
                                            }
                                            verwijderKoppelingRelatie={
                                                this.verwijderKoppelingRelatie
                                            }
                                        />
                                    ) : null}

                                    {titleSingular === "Maatregel" ? (
                                        <FormFieldContainerMaatregelen
                                            editStatus={editStatus}
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Beleidsdoel" ? (
                                        <FormFieldContainerBeleidsdoelen
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Beleidsprestatie" ? (
                                        <FormFieldContainerBeleidsprestaties
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Thema" ? (
                                        <FormFieldContainerThemas
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === "Verordening" ? (
                                        <FormFieldContainerThemas
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    <ButtonSubmitFixed
                                        submit={this.handleSubmit}
                                    />
                                </form>
                            </div>
                        </div>
                    </ContainerMain>
                ) : (
                    <LoaderContent />
                )}
            </div>
        )
    }
}

export default withRouter(MuteerUniversalObjectCRUD)
