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

/**
 * @param {object} dimensieConstants - Contains all the variables of the dimension (e.g. Maatregelen). The dimensieContants come from the constant files export src/constants/dimensies.js.
 * @returns a detail page where a dimension object can be displayed
 */
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
            .then((res) => {
                const dataObject = res.data

                // Detail pages krijgen een array met objecten die we sorten
                // Version pages krijgen enkel een object terug
                if (this.state.pageType === 'detail') {
                    dataObject.sort(function (a, b) {
                        return (
                            new Date(b.Modified_Date) -
                            new Date(a.Modified_Date)
                        )
                    })
                }

                this.setState({ dataObject: dataObject, dataReceived: true })
            })
            .catch((err) => {
                if (err.response !== undefined) {
                    this.setState(
                        {
                            dataReceived: true,
                        },
                        () => {
                            if (err.response.status === 404) {
                                this.props.history.push(
                                    `/muteer/${this.props.overzichtSlug}`
                                )
                                console.log(err)
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
                        () => {
                            console.log(err)
                            toast(process.env.REACT_APP_ERROR_MSG)
                        }
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
        const titleSingular = dimensieConstants.TITLE_SINGULAR
        const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

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
                <div className="inline-block w-full">
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
                                        className="flex items-center w-1/2 mt-5"
                                        to={
                                            this.props.location.hash ===
                                            '#mijn-beleid'
                                                ? `/muteer/${overzichtSlug}/edit/${this.props.match.params.single}#mijn-beleid`
                                                : `/muteer/${overzichtSlug}/edit/${this.props.match.params.single}`
                                        }
                                        id={`href-ontwerp-maken`}
                                    >
                                        <span className="relative flex items-center justify-end w-24 h-10 pb-5 mr-2 border-r-2 border-gray-300">
                                            <div className="absolute w-8 h-8 pt-1 text-center bg-gray-300 rounded-full -right-4">
                                                <FontAwesomeIcon
                                                    className="relative text-gray-600"
                                                    icon={faPlus}
                                                />
                                            </div>
                                        </span>
                                        <span className="inline pl-5 -mt-5 text-sm text-gray-700 cursor-pointer hover:underline">
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
                                titleSingular={titleSingular}
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
    dataObject.shift() // remove First object, as we already got that in the parent element view

    return (
        <div>
            <div className="flex items-center justify-end w-24 h-6 pt-5 mr-2 border-r-2 border-gray-300 " />
            <ul className="relative revisie-list">
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
                                    className="relative flex items-end h-6 mr-2 hover:underline"
                                >
                                    <span
                                        className="w-24 pr-4 pr-5 text-xs text-right text-gray-600"
                                        title="Laatst gewijzigd op"
                                    >
                                        {format(
                                            new Date(item.Modified_Date),
                                            'd MMM yyyy'
                                        )}
                                    </span>
                                    <div className="relative w-3 h-3 text-center bg-gray-300 rounded-full revisie-list-bolletje" />
                                    <span className="w-24 pl-4 pr-5 text-xs text-gray-600">
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

export default withRouter(MuteerUniversalObjectDetail)
