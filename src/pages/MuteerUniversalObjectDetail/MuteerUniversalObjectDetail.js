import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

// Import Axios instance to connect with the API
import axios from '../../apiNew/axios'
// Import Components
import { ContainerDetailMain, ContainerMain } from '../../components/Container'
import EigenaarsDriehoek from '../../components/EigenaarsDriehoek'
import { checkIfUserIsAllowedOnPage } from '../../utils/checkIfUserIsAllowedOnPage'
import ButtonBackToPage from './../../components/ButtonBackToPage'

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
        this.getAndSetDimensieDataFromApi =
            this.getAndSetDimensieDataFromApi.bind(this)
    }

    /** pageType 'detail' is based on a UUID, 'version' is based on the the ID of a policy object*/
    returnPageType() {
        let pageType = 'detail'
        if (this.props.match.params.version) {
            pageType = 'version'
        }
        return pageType
    }

    /**
     * @returns {string} - Returns the API endpoint to get the lineage or the version based on the pageType
     */
    getApiEndpoint() {
        const dimensieConstants = this.props.dimensieConstants
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        if (this.state.pageType === 'detail') {
            const objectID = this.props.match.params.single
            return `${apiEndpoint}/${objectID}`
        } else if (this.state.pageType === 'version') {
            const objectUUID = this.props.match.params.version
            return `/version/${apiEndpoint}/${objectUUID}`
        }
    }

    /**
     * Iniate policy object(s) from the API
     */
    getAndSetDimensieDataFromApi() {
        const apiEndpoint = this.getApiEndpoint()
        axios
            .get(apiEndpoint)
            .then(res => {
                const dataObject = res.data
                const authUser = this.props.authUser

                /** Check if user is authenticated to visit current page */
                const isUserAllowed = checkIfUserIsAllowedOnPage({
                    object: dataObject,
                    authUser: authUser,
                })

                if (!isUserAllowed) {
                    toast(
                        'Je bent niet geauthenticeerd om deze pagina te bekijken'
                    )
                    this.props.history.push('/muteer/dashboard')
                }

                /** Sort the objects if the pageType is 'detail' (which contains whole history of an object) */
                if (this.state.pageType === 'detail') {
                    /** pageType is of 'detail' */
                    this.setState({
                        dataObject: dataObject.sort(function (a, b) {
                            return (
                                new Date(b.Modified_Date) -
                                new Date(a.Modified_Date)
                            )
                        }),
                        dataReceived: true,
                    })
                } else {
                    /** pageType is of 'version' */
                    this.setState({
                        dataObject: dataObject,
                        dataReceived: true,
                    })
                }
            })
            .catch(err => {
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

    /** Update state when the user switches from pageType */
    componentDidUpdate() {
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
        const dimensieConstants = this.props.dimensieConstants
        const titleSingular = dimensieConstants.TITLE_SINGULAR
        const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

        const pageType = this.state.pageType
        const dataReceived = this.state.dataReceived

        /**
         * dataObject is currently a array when the pageType is of version,
         * and a object when the pageType is detail. TODO: Refactor this into better state.
         */
        let dataObject = {}
        if (dataReceived && pageType === 'detail') {
            dataObject = this.state.dataObject[0]
        } else if (dataReceived && pageType === 'version') {
            dataObject = this.state.dataObject
        }

        const displayEigenaarsDriehoek =
            dataReceived &&
            dataObject &&
            (dataObject.Opdrachtgever !== undefined ||
                dataObject.Eigenaar_1 !== undefined ||
                dataObject.Eigenaar_2 !== undefined ||
                dataObject.Portefeuillehouder_1 !== undefined ||
                dataObject.Portefeuillehouder_2 !== undefined)

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
                                overzichtSlug !== 'beleidskeuzes'
                                    ? 'w-full'
                                    : 'w-9/12'
                            } pr-8`}>
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
                                        id={`href-ontwerp-maken`}>
                                        <span className="relative flex items-center justify-end w-24 h-10 pb-5 mr-2 border-r-2 border-gray-300">
                                            <div className="absolute flex items-center justify-center w-8 h-8 text-center bg-gray-300 rounded-full -right-4">
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

                            {/* List of Revisions */}
                            {dataReceived && pageType === 'detail' ? (
                                <RevisieList
                                    dataObject={this.state.dataObject}
                                    overzichtSlug={overzichtSlug}
                                    hash={this.props.location.hash}
                                />
                            ) : null}
                        </div>

                        {displayEigenaarsDriehoek ? (
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
                                    className="relative flex items-end h-6 mr-2 hover:underline">
                                    <span
                                        className="w-24 pr-4 pr-5 text-xs text-right text-gray-600"
                                        title="Laatst gewijzigd op">
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
