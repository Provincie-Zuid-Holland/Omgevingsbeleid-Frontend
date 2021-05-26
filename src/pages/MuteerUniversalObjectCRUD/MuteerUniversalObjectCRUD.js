import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import cloneDeep from 'lodash.clonedeep'
import * as axiosPackage from 'axios'

// Import Components
import ContainerCrudHeader from './ContainerCrudHeader'
import LoaderContent from './../../components/LoaderContent'
import ButtonSubmitFixed from './../../components/ButtonSubmitFixed'
import ContainerMain from './../../components/ContainerMain'

// Import FormFieldContainers
import FormFieldContainerAmbities from './FormFieldContainers/FormFieldContainerAmbities'
import FormFieldContainerBelangen from './FormFieldContainers/FormFieldContainerBelangen'
import FormFieldContainerBeleidsregels from './FormFieldContainers/FormFieldContainerBeleidsregels'
import FormFieldContainerBeleidskeuzes from './FormFieldContainers/FormFieldContainerBeleidskeuzes'
import FormFieldContainerMaatregelen from './FormFieldContainers/FormFieldContainerMaatregelen'
import FormFieldContainerBeleidsdoelen from './FormFieldContainers/FormFieldContainerBeleidsdoelen'
import FormFieldContainerThemas from './FormFieldContainers/FormFieldContainerThemas'
import FormFieldContainerBeleidsprestaties from './FormFieldContainers/FormFieldContainerBeleidsprestaties'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Import Utilities
import eindDateIsBeforeBeginDate from './../../utils/eindDateIsBeforeBeginDate'
import makeCrudProperties from './../../utils/makeCrudProperties'
import makeCrudObject from './../../utils/makeCrudObject'
import checkRequiredFields from './../../utils/checkRequiredFields'
import formatGeldigheidDatesForUI from './../../utils/formatGeldigheidDatesForUI'
import formatGeldigheidDatesForAPI from './../../utils/formatGeldigheidDatesForAPI'

/**
 * @param {object} authUser - contains the logged in user object
 * @param {object} dimensieConstants - Contains all the variables of the dimension (e.g. Maatregelen). The dimensieContants come from the constant files export src/constants/dimensies.js.
 * @returns a page where the user can create new or edit existing dimension objects (e.g. Maatregelen)
 */
class MuteerUniversalObjectCRUD extends Component {
    constructor(props) {
        super(props)

        // 'edit' bevat een boolean. Deze is true wanneer de gebruiker een bestaand object bewerkt en false wanneer de gebruiker een nieuw object toevoegd.
        // 'crudObject' bevat de properties die de gebruiker kan bewerken, zoals de Titel
        // 'dataLoaded' bevat een boolean die aangeeft of alle initiele data is geladen
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

    // Algemene change handler
    // metaInfo en dataProp parameter bevatten informatie van het react-select <Select /> component
    // Deze moeten anders afgehandeld worden dan een normaal event
    handleChange(event, metaInfo, dataProp) {
        let value
        let name

        if (metaInfo && metaInfo.action === 'clear') {
            // Als de waarde van metaInfo.action 'clear' is moet de value van deze property naar null gezet worden. Dit event wordt getriggerd zodra een gebruiker op het 'X' icoon klikt in het react-select component
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

    postDimensieObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

        axios
            .post(`${apiEndpoint}`, JSON.stringify(crudObject))
            .then((res) => {
                this.props.history.push(
                    `/muteer/${overzichtSlug}/${res.data.ID}${
                        this.props.location.hash === '#mijn-beleid'
                            ? '#mijn-beleid'
                            : ''
                    }`
                )
                toast('Opgeslagen')
            })
            .catch((err) => {
                crudObject = formatGeldigheidDatesForUI(crudObject)
                this.setState({
                    crudObject: crudObject,
                })
                console.warn(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

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
                        this.props.location.hash === '#mijn-beleid'
                            ? '#mijn-beleid'
                            : ''
                    }`
                )
                toast('Opgeslagen')
            })
            .catch((err) => {
                if (axiosPackage.isCancel(err)) {
                    console.warn('Request cancelled...')
                } else {
                    console.warn(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                    crudObject = formatGeldigheidDatesForUI(crudObject)
                    this.setState({
                        crudObject: crudObject,
                    })
                }
            })
    }

    handleSubmit(event) {
        event.preventDefault()

        const checkDates = (crudObject, titleSingular) => {
            if (
                crudObject.Begin_Geldigheid !== null &&
                crudObject.Begin_Geldigheid !== '' &&
                crudObject.Eind_Geldigheid !== null &&
                crudObject.Eind_Geldigheid !== ''
            ) {
                const isEindDateBeforeBegin = eindDateIsBeforeBeginDate(
                    titleSingular,
                    {
                        Begin_Geldigheid: new Date(crudObject.Begin_Geldigheid),
                        Eind_Geldigheid: new Date(crudObject.Eind_Geldigheid),
                    }
                )

                return isEindDateBeforeBegin
            }
        }

        const removeEmptyFields = (obj) => {
            const skipProperties = [
                'Gebied',
                'Begin_Geldigheid',
                'Eind_Geldigheid',
            ]
            Object.keys(obj).forEach((property) => {
                if (skipProperties.includes(property)) return
                if (obj[property] === null || obj[property] === undefined) {
                    delete obj[property]
                }
            })
            return obj
        }

        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const titleSingular = dimensieConstants.TITLE_SINGULAR

        let crudObject = cloneDeep(this.state.crudObject)

        const containsRequiredUnfilledField = checkRequiredFields(
            crudObject,
            dimensieConstants,
            titleSingular
        )
        if (containsRequiredUnfilledField) return

        const isEindDateBeforeBegin = checkDates(crudObject, titleSingular)
        if (isEindDateBeforeBegin) return

        // Create date objects out of string values ('yyyy-MM-DD')
        crudObject = formatGeldigheidDatesForAPI(crudObject)
        crudObject = removeEmptyFields(crudObject)

        // PATCH or POST based on the edit state
        if (this.state.edit) {
            crudObject = this.prepareForRequest(crudObject, 'patch')
            this.patchDimensieObject(crudObject)
        } else {
            // If we POST an object to the 'beleidsrelaties' endpoint we need to add these properties
            if (apiEndpoint === 'beleidsrelaties') {
                crudObject.Status = 'Open'
                crudObject.Aanvraag_Datum = new Date()
            }

            crudObject = this.prepareForRequest(crudObject, 'post')
            this.postDimensieObject(crudObject)
        }
    }

    // Remove .Title properties from Connection objects
    prepareForRequest(crudObject, type) {
        // Get the connections
        const getConnectionProperties = () => {
            const crudProperties = this.props.dimensieConstants.CRUD_PROPERTIES
            const connectionKeys = Object.keys(crudProperties).filter(
                (key) => crudProperties[key].type === 'connection'
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

        if (type === 'post') return crudObject

        // Continue prepping the object for a PATCH Request

        if (crudObject.Gebied && crudObject.Gebied.UUID) {
            crudObject.Gebied = crudObject.Gebied.UUID
        }

        const eigenaren = [
            'Eigenaar_1',
            'Eigenaar_2',
            'Opdrachtgever',
            'Portefeuillehouder_1',
            'Portefeuillehouder_2',
        ]

        eigenaren.forEach((eigenaar) => {
            if (!crudObject.hasOwnProperty(eigenaar)) return
            if (
                typeof crudObject[eigenaar] === 'object' &&
                crudObject[eigenaar] !== null
            ) {
                crudObject[eigenaar] = crudObject[eigenaar].UUID
            }
        })

        crudObject?.Werkingsgebieden?.forEach((gebied, index) => {
            crudObject.Werkingsgebieden[index] = { UUID: gebied.Object.UUID }
        })

        return crudObject
    }

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

        if (typeof nieuwCrudObject[propertyName] === 'string') {
            nieuwCrudObject[propertyName] = []
        }

        nieuwCrudObject[propertyName].push(nieuwObject)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => {
                toast('Koppeling toegevoegd')
                callback(nieuwCrudObject)
            }
        )
    }

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
                toast('Koppeling gewijzigd')
                callback(nieuwCrudObject)
            }
        )
    }

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
            () => toast('Koppeling verwijderd')
        )
    }

    // responseObjectFromAPI wordt meegegeven als parameter wanneer de pagina een 'version' pagina is
    createAndSetCrudObject(responseObjectFromAPI) {
        const dimensieConstants = this.props.dimensieConstants
        const crudProperties = makeCrudProperties(dimensieConstants)

        let params = new URL(document.location).searchParams
        let modus = params.get('modus')

        let crudObject = makeCrudObject({
            crudProperties: crudProperties,
            dimensieConstants: dimensieConstants,
            responseObject: responseObjectFromAPI,
            modus: modus,
        })

        this.setState({
            crudObject: crudObject,
            dataLoaded: true,
        })
    }

    getAndSetDimensieDataFromApi() {
        const objectID = this.props.match.params.single
        const dimensieConstants = this.props.dimensieConstants
        const titleSingular = dimensieConstants.TITLE_SINGULAR
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        let params = new URL(document.location).searchParams

        // If modus equals 'wijzig_vigerend', the user is editing a vigerend object
        let modus = params.get('modus')

        const isMaatregelOrBeleidskeuze =
            titleSingular === 'Maatregel' || titleSingular === 'Beleidskeuze'

        const isWijzigVigerendOrOntwerpMaken =
            (modus && modus === 'wijzig_vigerend') ||
            (modus && modus === 'ontwerp_maken')

        axios
            .get(`${apiEndpoint}/${objectID}`, {
                cancelToken: this.axiosCancelSource.token,
            })
            .then((res) => {
                const responseObject = res.data
                let crudObject = null

                if (
                    isMaatregelOrBeleidskeuze &&
                    isWijzigVigerendOrOntwerpMaken
                ) {
                    // Get the first object with a status of 'Vigerend'
                    crudObject = responseObject.find(
                        (e) => e.Status === 'Vigerend'
                    )
                } else if (
                    titleSingular === 'Beleidskeuze' ||
                    titleSingular === 'Maatregel'
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
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    componentDidMount() {
        this.axiosCancelSource = axiosPackage.CancelToken.source()

        if (this.props.match.params.single) {
            // Als er een waarde in de single parameter zit bewerkt de gebruiker een bestaand object
            this.setState(
                {
                    edit: true,
                },
                () => {
                    this.getAndSetDimensieDataFromApi()
                }
            )
        } else {
            // Anders maakt de gebruiker een nieuw object aan
            this.createAndSetCrudObject()
        }
    }

    componentWillUnmount() {
        this.axiosCancelSource.cancel('Axios request canceled.')
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
                                  objectTitle ? objectTitle : ''
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
                                <form
                                    className="mt-12"
                                    onSubmit={this.handleSubmit}
                                >
                                    {titleSingular === 'Ambitie' ? (
                                        <FormFieldContainerAmbities
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === 'Belang' ? (
                                        <FormFieldContainerBelangen
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === 'Beleidsregel' ? (
                                        <FormFieldContainerBeleidsregels
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === 'Beleidskeuze' ? (
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

                                    {titleSingular === 'Maatregel' ? (
                                        <FormFieldContainerMaatregelen
                                            editStatus={editStatus}
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === 'Beleidsdoel' ? (
                                        <FormFieldContainerBeleidsdoelen
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === 'Beleidsprestatie' ? (
                                        <FormFieldContainerBeleidsprestaties
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === 'Thema' ? (
                                        <FormFieldContainerThemas
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titleSingular === 'Verordening' ? (
                                        <FormFieldContainerThemas
                                            titleSingular={titleSingular}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    <ButtonSubmitFixed />
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
