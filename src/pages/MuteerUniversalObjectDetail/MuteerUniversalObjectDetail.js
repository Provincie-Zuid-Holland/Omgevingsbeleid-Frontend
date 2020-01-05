import React, { Component } from 'react'
import { format } from 'date-fns'
import { Link, withRouter } from 'react-router-dom'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'
import EigenaarsDriehoek from './EigenaarsDriehoek'
import ContainerMain from './../../components/ContainerMain'
import ContainerDetailMain from './ContainerDetailMain'

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
        this.returnPageType = this.returnPageType.bind(this)
        this.getDataFromApi = this.getDataFromApi.bind(this)
        this.state = {
            dataObject: null,
            pageType: this.returnPageType(),
            dataReceived: false,
        }
    }

    // Method to set the page type: detail/version
    returnPageType() {
        let pageType = 'detail'
        if (this.props.match.params.version) {
            pageType = 'version'
        }
        return pageType
    }

    generateApiEndpoint() {
        const ApiEndpointBase = this.props.dataModel.variables.Api_Endpoint
        if (this.state.pageType === 'detail') {
            const detail_id = this.props.match.params.single
            return `${ApiEndpointBase}/${detail_id}`
        } else if (this.state.pageType === 'version') {
            const version_id = this.props.match.params.version
            return `${ApiEndpointBase}/version/${version_id}`
        }
    }

    // Method to create the API endpoint, based on the page type
    getDataFromApi() {
        const apiEndpoint = this.generateApiEndpoint()

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
                    if (error.response.status === 401) {
                        localStorage.removeItem('access_token')
                        this.props.history.push('/login')
                    } else if (error.response.status === 404) {
                        this.props.history.push(
                            `/muteer/${this.props.overzichtSlug}`
                        )
                        toast(
                            `Deze ${this.props.dataModel.variables.Titel_Enkelvoud.toLowerCase()} kon niet gevonden worden`
                        )
                    }
                    this.setState({
                        dataReceived: true,
                    })
                } else {
                    toast(`Er is iets misgegaan`)
                }
            })
    }

    render() {
        // Variables to give as props
        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud
        const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
        const pageType = this.state.pageType

        // False if data is loading, true if a response is received
        let dataReceived = this.state.dataReceived

        // If the page is a detail page the dataObject will be an array.
        // We always want the first item from this array
        // Else the dataObject will be a single Object
        let dataObject = {}
        if (dataReceived && pageType === 'detail') {
            dataObject = this.state.dataObject[0]
        } else if (dataReceived && pageType === 'version') {
            dataObject = this.state.dataObject
        }

        return (
            <ContainerMain>
                {dataObject.Titel ? (
                    <Helmet>
                        <title>Omgevingsbeleid - {dataObject.Titel}</title>
                    </Helmet>
                ) : null}

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
                                                ? `/muteer/${this.props.overzichtSlug}/edit/${this.props.match.params.single}#mijn-beleid`
                                                : `/muteer/${this.props.overzichtSlug}/edit/${this.props.match.params.single}`
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
                                    hash={this.props.location.hash}
                                />
                            ) : null}
                        </div>

                        {dataReceived &&
                        this.state.dataObject[0] &&
                        (this.state.dataObject[0].Opdrachtgever !== undefined ||
                            this.state.dataObject[0].Eigenaar_1 !== undefined ||
                            this.state.dataObject[0].Eigenaar_2 !== undefined ||
                            this.state.dataObject[0].Portefeuillehouder_1 !==
                                undefined ||
                            this.state.dataObject[0].Portefeuillehouder_2 !==
                                undefined) ? (
                            <EigenaarsDriehoek
                                dataObject={this.state.dataObject[0]}
                            />
                        ) : null}
                    </div>
                </div>
            </ContainerMain>
        )
    }

    // On initial mount, set pagetype and get data from API
    componentDidMount() {
        this.getDataFromApi()
    }

    // Handle switch from 'detail <-> version'
    componentDidUpdate(prevProps) {
        if (this.returnPageType() !== this.state.pageType) {
            this.setState(
                {
                    dataObject: null,
                    pageType: this.returnPageType(),
                    dataReceived: false,
                },
                () => {
                    this.getDataFromApi()
                }
            )
        }
    }
}

export default withRouter(MuteerUniversalObjectDetail)
