import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

// Import Components
import ContainerCrudHeader from './ContainerCrudHeader'
import LoaderContent from './../../components/LoaderContent'
import ButtonSubmitFixed from './../../components/ButtonSubmitFixed'
import ContainerMain from './../../components/ContainerMain'

// Import FormFieldContainers
import FormFieldContainerAmbities from './FormFieldContainers/FormFieldContainerAmbities'
import FormFieldContainerBelangen from './FormFieldContainers/FormFieldContainerBelangen'
import FormFieldContainerBeleidsregels from './FormFieldContainers/FormFieldContainerBeleidsregels'
import FormFieldContainerBeleidsbeslissingen from './FormFieldContainers/FormFieldContainerBeleidsbeslissingen'
import FormFieldContainerMaatregelen from './FormFieldContainers/FormFieldContainerMaatregelen'
import FormFieldContainerOpgaven from './FormFieldContainers/FormFieldContainerOpgaven'
import FormFieldContainerThemas from './FormFieldContainers/FormFieldContainerThemas'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Import Utilities
import makeCrudProperties from './../../utils/makeCrudProperties'
import makeCrudObject from './../../utils/makeCrudObject'
import checkRequiredFields from './../../utils/checkRequiredFields'
import formatGeldigheidDatesForUI from './../../utils/formatGeldigheidDatesForUI'
import formatGeldigheidDatesForAPI from './../../utils/formatGeldigheidDatesForAPI'

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
        this.handleSubmit = this.handleSubmit.bind(this)
        this.voegKoppelingRelatieToe = this.voegKoppelingRelatieToe.bind(this)
        this.wijzigKoppelingRelatie = this.wijzigKoppelingRelatie.bind(this)
        this.verwijderKoppelingRelatie = this.verwijderKoppelingRelatie.bind(
            this
        )
        this.getAndSetDimensieDataFromApi = this.getAndSetDimensieDataFromApi.bind(
            this
        )

        this.formatGeldigheidDatesForUI = formatGeldigheidDatesForUI.bind(this)
        this.formatGeldigheidDatesForAPI = formatGeldigheidDatesForAPI.bind(
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

    setInitialValuesCrudObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants

        // Check voor elke property op het crudObject of die gelijk is aan de initValue
        // Indien dat het geval is, zet de waarde op null
        const crudObjectKeys = Object.keys(crudObject)
        crudObjectKeys.forEach((property) => {
            if (
                crudObject[property] === null &&
                crudObject[property] !==
                    dimensieConstants.CRUD_PROPERTIES[property].initValue
            ) {
                crudObject[property] =
                    dimensieConstants.CRUD_PROPERTIES[property].initValue
            }
        })
        return crudObject
    }

    setEmptyValuesToNullCrudObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants

        // Check voor elke property op het crudObject of die gelijk is aan de initValue
        // Indien dat het geval is, zet de waarde op null
        const crudObjectKeys = Object.keys(crudObject)
        crudObjectKeys.forEach((property) => {
            if (
                crudObject[property] ===
                dimensieConstants.CRUD_PROPERTIES[property].initValue
            ) {
                crudObject[property] = null
            }
        })
        return crudObject
    }

    postDimensieObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const overzichtSlug = dimensieConstants.SLUG_OVERZICHT

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
                crudObject = this.formatGeldigheidDatesForUI(crudObject)
                this.setState({
                    crudObject: crudObject,
                })
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    patchDimensieObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const objectID = this.props.match.params.single
        const overzichtSlug = dimensieConstants.SLUG_OVERZICHT

        axios
            .patch(`${apiEndpoint}/${objectID}`, JSON.stringify(crudObject))
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
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                crudObject = this.formatGeldigheidDatesForUI(crudObject)
                this.setState({
                    crudObject: crudObject,
                })
            })
    }

    handleSubmit(event) {
        event.preventDefault()

        const removeEmptyFields = (obj) => {
            Object.keys(obj).forEach((property) => {
                if (obj[property] === null || obj[property] === undefined) {
                    delete obj[property]
                }
            })
            return obj
        }

        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD

        let crudObject = this.state.crudObject

        // Converteer de 'yyyy-MM-DD' waarden naar Date objecten
        // Of Verwijder de begin_ of eind_geldigheid properties als ze geen waarde hebben
        crudObject = this.formatGeldigheidDatesForAPI(crudObject)

        // Check of de verplichte velden zijn ingevuld als het een beleidsbeslissing is
        // !REFACTOR! - velden check voor andere dimensies (Bespreken STUM)
        const alleVeldenIngevuld = checkRequiredFields(
            crudObject,
            dimensieConstants,
            titelEnkelvoud
        )

        crudObject = removeEmptyFields(crudObject)

        if (!alleVeldenIngevuld) {
            this.setState({
                crudObject: this.formatGeldigheidDatesForUI(crudObject),
            })
            return
        }

        // If the user is editing an object PATCH, else POST
        if (this.state.edit) {
            this.patchDimensieObject(crudObject)
        } else {
            // Als het dimensie object een beleidsrelatie is wijzigen we de volgende properties
            if (apiEndpoint === 'beleidsrelaties') {
                crudObject.Status = 'Open'
                crudObject.Aanvraag_Datum = new Date()
            }

            this.postDimensieObject(crudObject)
        }
    }

    voegKoppelingRelatieToe(propertyName, object, omschrijving) {
        const nieuwObject = {
            UUID: object.UUID,
            Omschrijving: omschrijving,
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
            () => toast('Koppeling toegevoegd')
        )
    }

    wijzigKoppelingRelatie(koppelingObject, nieuweOmschrijving) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            (item) => item.UUID === koppelingObject.item.UUID
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

    verwijderKoppelingRelatie(koppelingObject) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            (item) => item.UUID === koppelingObject.item.UUID
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
            wijzigVigerend: modus, // modus contains
        })

        this.setState({
            crudObject: crudObject,
            dataLoaded: true,
        })
    }

    getAndSetDimensieDataFromApi() {
        const objectID = this.props.match.params.single
        const dimensieConstants = this.props.dimensieConstants
        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        let params = new URL(document.location).searchParams
        // If modus equals 'wijzig_vigerend', the user is editing a vigerend object
        let modus = params.get('modus')

        axios
            .get(`${apiEndpoint}/${objectID}`)
            .then((res) => {
                const responseObject = res.data
                let crudObject = null

                if (
                    (titelEnkelvoud === 'Maatregel' &&
                        modus &&
                        modus === 'wijzig_vigerend') ||
                    (titelEnkelvoud === 'Beleidskeuze' &&
                        modus &&
                        modus === 'wijzig_vigerend')
                ) {
                    // Get the first object with a status of 'Vigerend'
                    crudObject = responseObject.find(
                        (e) => e.Status === 'Vigerend'
                    )
                } else if (
                    titelEnkelvoud === 'Beleidskeuze' ||
                    titelEnkelvoud === 'Maatregel'
                ) {
                    // Probleem:
                    // - Wanneer we een beleidskeuze opslaan in een tussentijdsproces popt deze bovenop de stack
                    // - Deze willen we overslaan bij het editen, maar er is geen mogelijkheid om onderscheid te maken
                    //   tussen een vigerende versie die

                    // crudObject = responseObject.find(
                    //     (e) => e.Status !== 'Vigerend'
                    // )

                    crudObject = responseObject[0]
                } else {
                    crudObject = responseObject[0]
                }

                crudObject = formatGeldigheidDatesForUI(crudObject)
                this.createAndSetCrudObject(crudObject)
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    componentDidMount() {
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

    render() {
        const dimensieConstants = this.props.dimensieConstants
        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
        const titelMeervoud = dimensieConstants.TITEL_MEERVOUD
        const overzichtSlug = dimensieConstants.SLUG_OVERZICHT

        const objectID = this.props.match.params.single

        const editStatus = this.state.edit
        const crudObject = this.state.crudObject
        const dataLoaded = this.state.dataLoaded
        const objectTitel = this.state.crudObject.Titel

        const handleChange = this.handleChange

        return (
            <div>
                <Helmet>
                    <title>
                        {editStatus
                            ? `Omgevingsbeleid - ${
                                  objectTitel ? objectTitel : ''
                              }`
                            : `Omgevingsbeleid - Voeg een nieuwe ${titelEnkelvoud} toe`}
                    </title>
                </Helmet>

                <ContainerCrudHeader
                    dataLoaded={dataLoaded}
                    objectTitel={objectTitel}
                    editStatus={editStatus}
                    titelMeervoud={titelMeervoud}
                    overzichtSlug={overzichtSlug}
                    titelEnkelvoud={titelEnkelvoud}
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
                                    {titelEnkelvoud === 'Ambitie' ? (
                                        <FormFieldContainerAmbities
                                            titelEnkelvoud={titelEnkelvoud}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titelEnkelvoud === 'Belang' ? (
                                        <FormFieldContainerBelangen
                                            titelEnkelvoud={titelEnkelvoud}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titelEnkelvoud === 'Beleidsregel' ? (
                                        <FormFieldContainerBeleidsregels
                                            titelEnkelvoud={titelEnkelvoud}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titelEnkelvoud === 'Beleidskeuze' ? (
                                        <FormFieldContainerBeleidsbeslissingen
                                            titelEnkelvoud={titelEnkelvoud}
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

                                    {titelEnkelvoud === 'Maatregel' ? (
                                        <FormFieldContainerMaatregelen
                                            titelEnkelvoud={titelEnkelvoud}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titelEnkelvoud === 'Opgave' ? (
                                        <FormFieldContainerOpgaven
                                            titelEnkelvoud={titelEnkelvoud}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titelEnkelvoud === 'Thema' ? (
                                        <FormFieldContainerThemas
                                            titelEnkelvoud={titelEnkelvoud}
                                            crudObject={crudObject}
                                            handleChange={handleChange}
                                        />
                                    ) : null}

                                    {titelEnkelvoud === 'Verordening' ? (
                                        <FormFieldContainerThemas
                                            titelEnkelvoud={titelEnkelvoud}
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
