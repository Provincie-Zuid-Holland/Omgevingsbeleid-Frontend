import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

// Import Components
import ContainerCrudFields from './ContainerCrudFields'
import ContainerMain from './../../components/ContainerMain'
import ButtonSubmitFixed from './../../components/ButtonSubmitFixed'
import ContainerFormSection from './../../components/ContainerFormSection'
import FormFieldTextInput from './../../components/FormFieldTextInput'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import LoaderContent from './../../components/LoaderContent'
import FormFieldDate from './../../components/FormFieldDate'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Create Context
import APIcontext from './APIContext'

// Import Utilities
import makeCrudProperties from './../../utils/makeCrudProperties'
import makeCrudObject from './../../utils/makeCrudObject'
import checkRequiredFields from './../../utils/checkRequiredFields'
import formatGeldigheidDatesForUI from './../../utils/formatGeldigheidDatesForUI'

class MuteerVerordeningenStructuurCRUD extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dataLoaded: false,
            crudObject: {},
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setEditorState = this.setEditorState.bind(this)
        this.voegKoppelingRelatieToe = this.voegKoppelingRelatieToe.bind(this)
        this.createAndSetCrudObject = this.createAndSetCrudObject.bind(this)
        this.wijzigKoppelingRelatie = this.wijzigKoppelingRelatie.bind(this)
        this.verwijderKoppelingRelatieToe = this.verwijderKoppelingRelatieToe.bind(
            this
        )
        this.formatGeldigheidDatesForUI = formatGeldigheidDatesForUI.bind(this)
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
                    // crudObject = this.setInitialValuesCrudObject(crudObject)
                    // Wijzig de data terug naar het format om in het input veld te tonen
                    crudObject = this.formatGeldigheidDatesForUI(crudObject)
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
                    // crudObject = this.setInitialValuesCrudObject(crudObject)
                    // Wijzig de data terug naar het format om in het input veld te tonen
                    crudObject = this.formatGeldigheidDatesForUI(crudObject)
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

    // responseObjectFromAPI wordt meegegeven als parameter wanneer de pagina een 'version' pagina is
    createAndSetCrudObject(responseObjectFromAPI) {
        const dimensieConstants = this.props.dimensieConstants
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
                                {dataLoaded
                                    ? editStatus
                                        ? `Wijzig de verordening`
                                        : `Voeg een nieuwe verordening toe`
                                    : null}
                            </h1>
                        </div>
                    </div>
                </div>
                {dataLoaded ? (
                    <ContainerMain>
                        <div className="w-full inline-block flex-grow">
                            <form
                                className="mt-12"
                                onSubmit={this.handleSubmit}
                            >
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Verordening"
                                        beschrijving={`Geef de verordening een passende titel.`}
                                    >
                                        <FormFieldTextInput
                                            handleChange={handleChange}
                                            fieldValue={crudObject['Titel']}
                                            fieldLabel="Titel"
                                            dataObjectProperty="Titel"
                                            pValue="Vul hier uw titel in"
                                            titelEnkelvoud={titelEnkelvoud}
                                        />
                                    </ContainerFormSection>
                                    <ContainerFormSection titel="Aanvullende informatie">
                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            <FormFieldDate
                                                handleChange={handleChange}
                                                fieldValue={
                                                    crudObject[
                                                        'Begin_Geldigheid'
                                                    ]
                                                }
                                                fieldLabel="Datum inwerkingtreding"
                                                notRequired={true}
                                                dataObjectProperty="Begin_Geldigheid"
                                                pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                titelEnkelvoud={titelEnkelvoud}
                                                openUitwerkingstrede={true}
                                            />

                                            {/* Eind Geldigheid */}

                                            <FormFieldDate
                                                handleChange={handleChange}
                                                notRequired={true}
                                                fieldValue={
                                                    crudObject[
                                                        'Eind_Geldigheid'
                                                    ]
                                                }
                                                openUitwerkingstrede={true}
                                                fieldLabel="Datum uitwerkingtreding"
                                                dataObjectProperty="Eind_Geldigheid"
                                                pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>

                                {/* Submit */}
                                <div className="fixed bottom-0 right-0 px-6">
                                    <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                                        <input
                                            id="form-submit"
                                            className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline"
                                            type="submit"
                                            value="Opslaan"
                                        ></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </ContainerMain>
                ) : (
                    <LoaderContent />
                )}
            </div>
        )
    }
}

export default withRouter(MuteerVerordeningenStructuurCRUD)
