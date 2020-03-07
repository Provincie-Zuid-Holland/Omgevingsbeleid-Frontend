import React, { Component } from 'react'
import { format } from 'date-fns'
import { Link, withRouter } from 'react-router-dom'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'
import EigenaarsDriehoek from '../../components/EigenaarsDriehoek'
import ContainerMain from './../../components/ContainerMain'
import ContainerDetailMain from '../../components/ContainerDetailMain'

import StatusHistorie from './StatusHistorie'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Utils
import deleteUnkownProperties from './../../utils/deleteUnkownProperties'
import cloneDeep from 'lodash.clonedeep'

// Generate Back Button for Detail or Version page
function GenerateBackToButton({ overzichtSlug, pageType, hash, dataObject }) {
    if (pageType === 'detail') {
        if (hash === '#mijn-beleid') {
            return (
                <ButtonBackToPage
                    terugNaar={` mijn beleid`}
                    url={`/muteer/mijn-beleid`}
                />
            )
        } else {
            return (
                <ButtonBackToPage
                    terugNaar={` overzicht`}
                    url={`/muteer/${overzichtSlug}`}
                />
            )
        }
    } else if (pageType === 'version') {
        const dataObjectID = dataObject.ID
        return (
            <ButtonBackToPage
                terugNaar={`huidige versie`}
                url={`/muteer/${overzichtSlug}/${dataObjectID}`}
            />
        )
    }
}

class MuteerUniversalObjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataObject: null,
            pageType: this.returnPageType(),
            dataReceived: false,
            dimensieHistorieSet: false,
        }

        this.returnPageType = this.returnPageType.bind(this)
        this.getAndSetDimensieDataFromApi = this.getAndSetDimensieDataFromApi.bind(
            this
        )
        this.generateStatusHistorie = this.generateStatusHistorie.bind(this)
        this.patchStatus = this.patchStatus.bind(this)
    }

    // Set het property pageType naar 'detail' of 'version'
    // 'detail' is een algemene pagina van het object, gebaseerd op het ID
    // 'version' is een specifieke pagina van het object, gebaseerd op het UUID
    returnPageType() {
        let pageType = 'detail'
        if (this.props.match.params.version) {
            pageType = 'version'
        }
        return pageType
    }

    // returned het api endpoint op basis van het pagina type
    getApiEndpoint() {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        if (this.state.pageType === 'detail') {
            const objectID = this.props.match.params.single
            return `${apiEndpoint}/${objectID}`
        } else if (this.state.pageType === 'version') {
            const objectUUID = this.props.match.params.version
            return `${apiEndpoint}/version/${objectUUID}`
        }
    }

    generateStatusHistorie() {
        let dimensieHistorie = cloneDeep(this.state.dataObject)
        // Momenteel is de dimensieHistorie met index [0] de laatste en index [-1] de laatste.
        // Dit willen we omdraaien zodat wanneer we over de array heen mappen we de chronologische volgorde hebben
        dimensieHistorie = dimensieHistorie.reverse()

        // De dimensies worden bevatten verschillende Status waarden. We willen elke voor elke status wijiziging de laatste versie met die status in een array pushen. Deze array wordt vervolgens gebruikt om de UI mee op te bouwen en het verloop van de wijzigingen binnen het dimensie object te tonen.
        let dimensieObjectStatusArray = []
        let vigerendeDimensieObject = null

        // We pushen een dimensieObject naar de dimensieObjectStatusArray door te mappen over de dimensieHistorie, waarbij we kijken of het volgende object in de dimensieHistorie een andere status heeft dan de huidige status. Indien dat zo is pushen we het object in de array.
        dimensieHistorie.forEach((dimensieObject, index) => {
            // Als de status anders is dan het volgende object in de dimensieHistorie pushen we deze in de Array
            if (
                index + 1 !== dimensieHistorie.length &&
                dimensieObject.Status !== dimensieHistorie[index + 1].Status
            ) {
                // Als het dimensieObject de Status waarde 'Vigerend' of 'Gepubliceerd heeft wijze we dit dimensieObject toe aan de variabele 'vigerendeDimensieObject'.
                if (
                    dimensieObject.Status === 'Vigerend' ||
                    dimensieObject.Status === 'Gepubliceerd'
                ) {
                    vigerendeDimensieObject = dimensieObject
                } else {
                    dimensieObjectStatusArray.push(dimensieObject)
                }
            } else if (index === 0 && index + 1 === dimensieHistorie.length) {
                if (
                    dimensieObject.Status === 'Vigerend' ||
                    dimensieObject.Status === 'Gepubliceerd'
                ) {
                    vigerendeDimensieObject = dimensieObject
                } else {
                    dimensieObjectStatusArray.push(dimensieObject)
                }
            }
        })

        dimensieHistorie = dimensieHistorie.reverse()

        this.setState(
            {
                dimensieHistorie: dimensieObjectStatusArray,
                dimensieHistorieSet: true,
                vigerendeDimensieObject: vigerendeDimensieObject,
            },
            () => {
                console.log('Dimensie historie set')
                console.log(this.state)
            }
        )
    }

    getAndSetDimensieDataFromApi() {
        const apiEndpoint = this.getApiEndpoint()

        // Connect With the API
        axios
            .get(apiEndpoint)
            .then(res => {
                const dataObject = res.data

                // Detail pages krijgen een array met objecten die we sorten
                // Version pages krijgen enkel een object terug
                if (this.state.pageType === 'detail') {
                    dataObject.sort(function(a, b) {
                        return (
                            new Date(b.Modified_Date) -
                            new Date(a.Modified_Date)
                        )
                    })
                }

                this.setState(
                    { dataObject: dataObject, dataReceived: true },
                    () => this.generateStatusHistorie()
                )
            })
            .catch(error => {
                if (error.response !== undefined) {
                    this.setState(
                        {
                            dataReceived: true,
                        },
                        () => {
                            if (error.response.status === 404) {
                                this.props.history.push(
                                    `/muteer/${this.props.overzichtSlug}`
                                )
                                toast(
                                    `Deze ${this.props.dataModel.variables.Titel_Enkelvoud.toLowerCase()} kon niet gevonden worden`
                                )
                            }
                        }
                    )
                } else {
                    this.setState(
                        {
                            dataReceived: true,
                        },
                        () => toast(`Er is iets misgegaan`)
                    )
                }
            })
    }

    patchStatus(crudObject, newStatus) {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const overzichtSlug = dimensieConstants.SLUG_OVERZICHT
        const objectID = crudObject.ID

        crudObject.Status = newStatus
        crudObject = deleteUnkownProperties(crudObject)

        axios
            .patch(`${apiEndpoint}/${objectID}`, JSON.stringify(crudObject))
            .then(res => {
                toast(`Status succesvol gewijzigd naar ${crudObject.Status}`)
                this.getAndSetDimensieDataFromApi()
            })
            .catch(error =>
                toast('Er is iets misgegaan, probeer het laten nog eens.')
            )
    }

    componentDidMount() {
        this.getAndSetDimensieDataFromApi()
    }

    // Handle switch van 'detail' naar 'version' pagina
    componentDidUpdate(prevProps) {
        if (this.returnPageType() !== this.state.pageType) {
            this.setState(
                {
                    dataObject: null,
                    pageType: this.returnPageType(),
                    dataReceived: false,
                },
                () => {
                    this.getAndSetDimensieDataFromApi()
                }
            )
        }
    }

    render() {
        // Variables to give as props
        const dimensieConstants = this.props.dimensieConstants
        const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
        const overzichtSlug = dimensieConstants.SLUG_OVERZICHT

        const pageType = this.state.pageType
        const dataReceived = this.state.dataReceived

        // Als de huidige pagina een 'detail' pagina is zal het dataObject een array zijn
        // Hiervan willen we altijd de laatste versie, die bevindt zich op index [0]
        // Als de pagina een 'version' pagina is, is het dataObject een object
        // Else the dataObject will be a single Object
        let dataObject = {}
        if (dataReceived && pageType === 'detail') {
            dataObject = this.state.dataObject[0]
        } else if (dataReceived && pageType === 'version') {
            dataObject = this.state.dataObject
        }

        return (
            <ContainerMain>
                <Helmet>
                    <title>
                        Omgevingsbeleid{' '}
                        {dataObject.Titel ? ' - ' + dataObject.Titel : ''}
                    </title>
                </Helmet>

                {/* Dimensie Container */}
                <div className="w-full inline-block">
                    <GenerateBackToButton
                        hash={this.props.location.hash}
                        dataObject={dataObject}
                        overzichtSlug={overzichtSlug}
                        pageType={pageType}
                    />

                    <div className="flex">
                        <div
                            className={`${
                                overzichtSlug !== 'beleidsbeslissingen'
                                    ? 'w-full'
                                    : 'w-9/12'
                            } pr-8`}
                        >
                            {pageType === 'detail' &&
                            this.state.dimensieHistorie &&
                            this.state.dimensieHistorie.length === 0 ? (
                                <div className="h-10 mt-5 ">
                                    <Link
                                        className="flex items-center mt-5 w-1/2"
                                        to={
                                            this.props.location.hash ===
                                            '#mijn-beleid'
                                                ? `/muteer/${overzichtSlug}/edit/${this.props.match.params.single}#mijn-beleid`
                                                : `/muteer/${overzichtSlug}/edit/${this.props.match.params.single}`
                                        }
                                        id={`href-ontwerp-maken`}
                                    >
                                        <span className="relative w-6 h-10 border-r-2 flex items-center justify-end border-gray-300 pb-5 mr-2">
                                            <div className="w-8 h-8 pt-1 absolute text-center bg-gray-300 rounded-full -right-4">
                                                <FontAwesomeIcon
                                                    className="text-gray-600 relative"
                                                    icon={faPlus}
                                                />
                                            </div>
                                        </span>
                                        <span className="text-sm inline text-gray-700 -mt-5 pl-5 cursor-pointer hover:underline">
                                            Ontwerp maken
                                        </span>
                                    </Link>
                                </div>
                            ) : null}

                            {this.state.vigerendeDimensieObject !== null ? (
                                <ContainerDetailMain
                                    patchStatus={this.patchStatus}
                                    dataObject={
                                        this.state.vigerendeDimensieObject
                                            ? this.state.vigerendeDimensieObject
                                            : {}
                                    }
                                    pageType={pageType}
                                    overzichtSlug={overzichtSlug}
                                    titelEnkelvoud={titelEnkelvoud}
                                    dataReceived={dataReceived}
                                />
                            ) : null}

                            {/* Status Historie, hier zit ook een containerDetailMain in met de laatst gewijzigde versie */}
                            {dataReceived &&
                            this.state.dimensieHistorieSet &&
                            pageType === 'detail' ? (
                                <StatusHistorie
                                    patchStatus={this.patchStatus}
                                    pageType={pageType}
                                    overzichtSlug={overzichtSlug}
                                    titelEnkelvoud={titelEnkelvoud}
                                    dataReceived={dataReceived}
                                    dataObject={this.state.dataObject}
                                    overzichtSlug={overzichtSlug}
                                    dimensieHistorie={
                                        this.state.dimensieHistorie
                                    }
                                    vigerendeDimensieObject={
                                        this.state.vigerendeDimensieObject
                                    }
                                />
                            ) : null}
                        </div>

                        {dataReceived &&
                        dataObject &&
                        (dataObject.Opdrachtgever !== undefined ||
                            dataObject.Eigenaar_1 !== undefined ||
                            dataObject.Eigenaar_2 !== undefined ||
                            dataObject.Portefeuillehouder_1 !== undefined ||
                            dataObject.Portefeuillehouder_2 !== undefined) ? (
                            <EigenaarsDriehoek dataObject={dataObject} />
                        ) : null}
                    </div>
                </div>
            </ContainerMain>
        )
    }
}

export default withRouter(MuteerUniversalObjectDetail)
