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

// Import Axios instance to connect with the API
import axios from '../../API/axios'

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

// Generate list for revisies
function RevisieList({ dataObject, overzichtSlug, hash }) {
    return (
        <div>
            <div className="w-24 h-6 border-r-2 flex items-center justify-end border-gray-300 pt-5 mr-2 " />
            <ul className="revisie-list relative">
                {dataObject.map((item, index) => {
                    return (
                        <li key={item.UUID}>
                            <div className="flex items-center justify-between">
                                <Link
                                    id={`revisie-item-${index}`}
                                    to={makeURLForRevisieObject(
                                        overzichtSlug,
                                        item.ID,
                                        item.UUID,
                                        hash
                                    )}
                                    className="flex items-end h-6 relative mr-2 hover:underline"
                                >
                                    <span className="text-xs text-gray-600 pr-5 w-24 text-right pr-4">
                                        {format(
                                            new Date(item.Modified_Date),
                                            'D MMM YYYY'
                                        )}
                                    </span>
                                    <div className="revisie-list-bolletje relative w-3 h-3 text-center bg-gray-300 rounded-full" />
                                    <span className="text-xs text-gray-600 pr-5 w-24 pl-4">
                                        Revisie
                                    </span>
                                </Link>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// Link naar detail pagina's van de revisies
function makeURLForRevisieObject(overzichtSlug, objectID, objectUUID, hash) {
    if (hash === '#mijn-beleid') {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}#mijn-beleid`
    } else {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}`
    }
}

class MuteerUniversalObjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataObject: null,
            pageType: this.returnPageType(),
            dataReceived: false,
        }

        this.returnPageType = this.returnPageType.bind(this)
        this.getAndSetDimensieDataFromApi = this.getAndSetDimensieDataFromApi.bind(
            this
        )
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

                this.setState({ dataObject: dataObject, dataReceived: true })
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
                            {pageType === 'detail' ? (
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
                                        <span className="relative w-24 h-10 border-r-2 flex items-center justify-end border-gray-300 pb-5 mr-2">
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

                            <ContainerDetailMain
                                dataObject={dataObject}
                                ambitie_id={this.props.match.params.single}
                                pageType={pageType}
                                overzichtSlug={overzichtSlug}
                                titelEnkelvoud={titelEnkelvoud}
                                dataReceived={dataReceived}
                            />

                            {/* Revisie List */}
                            {dataReceived && pageType === 'detail' ? (
                                <RevisieList
                                    dataObject={this.state.dataObject}
                                    overzichtSlug={overzichtSlug}
                                    hash={this.props.location.hash}
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
