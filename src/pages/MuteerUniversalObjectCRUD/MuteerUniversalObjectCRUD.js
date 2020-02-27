import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { format, isBefore } from 'date-fns'
import { Link, withRouter } from 'react-router-dom'
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

// Maakt en returned een array met de bewerkbare properties van het dimensie object
function makeCrudProperties(dimensieConstants) {
    const crudProperties = Object.keys(dimensieConstants.CRUD_PROPERTIES)
    return crudProperties
}

// Function to make an object containing the fields that the user can edit
function makeCrudObject({ crudProperties, dimensieConstants, responseObject }) {
    // Key waarden van de properties die gebruikt worden voor het maken van koppelingen
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

    // Het initiele object wat gereturned zal worden
    // Hierop plaatsen we alle properties die gewijzigd moeten worden
    let crudObject = {}

    if (responseObject) {
        // Als er een response object populaten we het crudObject op basis van de crudProperties met de waarden van het responseObject
        crudProperties.forEach(crudProperty => {
            crudObject[[crudProperty][0]] = responseObject[crudProperty]
        })
    } else {
        // Als er geen responseObject is initializen we de waarde voor elke crudProperty
        crudProperties.forEach(crudProperty => {
            crudObject[crudProperty] =
                dimensieConstants.CRUD_PROPERTIES[crudProperty].initValue
        })
    }

    return crudObject
}

function scrollToElement(elSelector) {
    const el = document.getElementById(elSelector)

    if (!el) return

    const yPosition = el.getBoundingClientRect().top + window.scrollY
    console.log(yPosition)
    window.scroll({
        top: yPosition - 170,
        behavior: 'smooth',
    })

    el.focus()

    el.classList.add('transition-regular', 'border-red-500')
    setTimeout(
        () => el.classList.remove('transition-regular', 'border-red-500'),
        2000
    )
}

function eindDateIsBeforeBeginDate(titelEnkelvoud, crudObject) {
    if (isBefore(crudObject.Eind_Geldigheid, crudObject.Begin_Geldigheid)) {
        const dataObjectProperty = 'Eind_Geldigheid'
        const elSelector = `form-field-${titelEnkelvoud.toLowerCase()}-${dataObjectProperty.toLowerCase()}`
        scrollToElement(elSelector)
        toast(
            'De datum van uitwerkingtreding mag niet eerder zijn dan de datum van inwerkingtreding'
        )
        return true
    }
    return false
}

function checkRequiredFields(crudObject, dimensieConstants, titelEnkelvoud) {
    const status = crudObject.Status
    const crudObjectProperties = Object.keys(crudObject)

    let pageScrolledToElement = false
    let alleVeldenIngevuld = true

    if (titelEnkelvoud === 'Beleidsbeslissing') {
        crudObjectProperties.forEach(property => {
            if (
                dimensieConstants.CRUD_PROPERTIES[property].required.includes(
                    status
                )
            ) {
                checkIfPropertyHasValue(property)
            }
        })
    } else {
        crudObjectProperties.forEach(property => {
            if (dimensieConstants.CRUD_PROPERTIES[property].required) {
                checkIfPropertyHasValue(property)
            }
        })
        if (
            alleVeldenIngevuld &&
            dimensieConstants.CRUD_PROPERTIES.Eind_Geldigheid.required &&
            dimensieConstants.CRUD_PROPERTIES.Begin_Geldigheid.required
        ) {
            const isEindDateBeforeBegin = eindDateIsBeforeBeginDate(
                titelEnkelvoud,
                crudObject
            )
            if (isEindDateBeforeBegin) {
                alleVeldenIngevuld = false
            }
        }
    }

    function checkIfPropertyHasValue(property) {
        const propertyHasValue =
            crudObject[property] !== undefined &&
            crudObject[property] !== null &&
            crudObject[property] !== [] &&
            crudObject[property] !== '' &&
            crudObject[property] !== 'Invalid Date'

        if (!propertyHasValue) {
            // Notificeer de gebruiker
            const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
            toast(dimensieConstants.CRUD_PROPERTIES[property].requiredMessage)
            console.warn(
                `Element met id 'form-field-${titelEnkelvoud.toLowerCase()}-${property.toLowerCase()}' heeft geen waarde`
            )

            // !REFACTOR! Scope creep alleVeldenIngevuld
            // Als er nog niet naar een element is gescrolled, scroll naar het element
            if (!pageScrolledToElement) {
                const elSelector = `form-field-${titelEnkelvoud.toLowerCase()}-${property.toLowerCase()}`
                scrollToElement(elSelector)
                pageScrolledToElement = true
                alleVeldenIngevuld = false
            }
        }
    }

    return alleVeldenIngevuld
}

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
        this.formatGeldigheidDatesForUI = this.formatGeldigheidDatesForUI.bind(
            this
        )
        this.getAndSetDimensieDataFromApi = this.getAndSetDimensieDataFromApi.bind(
            this
        )
    }

    // De data worden opgeslagen in Timestamp objecten. Om deze in de UI weer te geven moeten we deze omzetten naar het formaat 'YYYY-MM-DD'
    formatGeldigheidDatesForUI(crudObject) {
        // Format Begin_Geldigheid
        if (
            crudObject.Begin_Geldigheid !== undefined &&
            crudObject.Begin_Geldigheid !== null
        ) {
            crudObject.Begin_Geldigheid = format(
                crudObject.Begin_Geldigheid,
                'YYYY-MM-DD'
            )
        } else if (crudObject.Begin_Geldigheid === 'Invalid Date') {
            crudObject.Begin_Geldigheid = null
        }

        // Format Eind_Geldigheid
        if (
            crudObject.Eind_Geldigheid !== undefined &&
            crudObject.Eind_Geldigheid !== null
        ) {
            crudObject.Eind_Geldigheid = format(
                crudObject.Eind_Geldigheid,
                'YYYY-MM-DD'
            )
        } else if (crudObject.Eind_Geldigheid === 'Invalid Date') {
            crudObject.Eind_Geldigheid = null
        }

        return crudObject
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

        this.setState(prevState => ({
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
        crudObjectKeys.map(property => {
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
        crudObjectKeys.map(property => {
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

        // crudObject = this.setEmptyValuesToNullCrudObject(crudObject)

        axios
            .post(`${apiEndpoint}`, JSON.stringify(crudObject))
            .then(res => {
                this.props.history.push(
                    `/muteer/${overzichtSlug}/${res.data.ID}`
                )
                toast('Opgeslagen')
            })
            .catch(() => {
                // crudObject = this.setInitialValuesCrudObject(crudObject)
                // Wijzig de data terug naar het format om in het input veld te tonen
                crudObject = this.formatGeldigheidDatesForUI(crudObject)
                this.setState({
                    crudObject: crudObject,
                })
            })
    }

    patchDimensieObject(crudObject) {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const objectID = this.props.match.params.single
        const overzichtSlug = dimensieConstants.SLUG_OVERZICHT

        axios
            .patch(`${apiEndpoint}/${objectID}`, JSON.stringify(crudObject))
            .then(res => {
                this.props.history.push(
                    `/muteer/${overzichtSlug}/${res.data.ID}`
                )
                toast('Opgeslagen')
            })
            .catch(error => {
                crudObject = this.formatGeldigheidDatesForUI(crudObject)
                this.setState(
                    {
                        crudObject: crudObject,
                    },
                    () =>
                        toast(
                            'Er is iets misgegaan, probeer het laten nog eens.'
                        )
                )
            })
    }

    handleSubmit(event) {
        event.preventDefault()

        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD

        let crudObject = this.state.crudObject

        // Converteer de 'YYYY-MM-DD' waarden naar Date objecten
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

        // !REFACTOR! Deze logica mag in de makeCrudObject functie
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

    verwijderKoppelingRelatie(koppelingObject) {
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

    // responseObjectFromAPI wordt meegegeven als parameter wanneer de pagina een 'version' pagina is
    createAndSetCrudObject(responseObjectFromAPI) {
        const dimensieConstants = this.props.dimensieConstants
        const crudProperties = makeCrudProperties(dimensieConstants)
        let crudObject = makeCrudObject({
            crudProperties: crudProperties,
            dimensieConstants: dimensieConstants,
            responseObject: responseObjectFromAPI,
        })

        // crudObject = this.formatGeldigheidDatesForUI(crudObject)

        this.setState({
            crudObject: crudObject,
            dataLoaded: true,
        })
    }

    getAndSetDimensieDataFromApi() {
        const objectID = this.props.match.params.single
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        axios
            .get(`${apiEndpoint}/${objectID}`)
            .then(res => {
                const responseObject = res.data

                // Create and set crudObject in state
                // responseObject[0] is de laatste versie van het dimensie object
                this.createAndSetCrudObject(responseObject[0])
            })
            .catch(error => toast(`Er is iets misgegaan`))
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

        console.log(crudObject)

        return (
            <div>
                <Helmet>
                    <title>
                        {editStatus
                            ? `Omgevingsbeleid - ${objectTitel}`
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
                        <div className="w-full inline-block flex-grow">
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

                                    {titelEnkelvoud === 'Beleidsbeslissing' ? (
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
