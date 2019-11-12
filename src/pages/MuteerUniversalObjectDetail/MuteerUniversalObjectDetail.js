import React, { Component } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet'

// Import Components
import ContainerMain from './../../components/ContainerMain'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import EigenaarsDriehoekItem from './EigenaarsDriehoekItem'
import ContainerDetailMain from './ContainerDetailMain'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Generate Back Button for Detail or Version page
function GenerateBackToButton(props) {
    const overzichtSlug = props.overzichtSlug
    const pageType = props.pageType
    const hoofdOnderdeelSlug = props.hoofdOnderdeelSlug
    const apiTest = props.apiTest

    if (pageType === 'detail') {
        return (
            <ButtonBackToPage
                terugNaar={` overzicht`}
                // url={`/${hoofdOnderdeel}/${overzichtSlug}`}
                url={
                    apiTest === true
                        ? `/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}`
                        : `/muteer/${overzichtSlug}`
                }
            />
        )
    } else if (pageType === 'version') {
        const dataObjectID = props.dataObject.ID
        return (
            <ButtonBackToPage
                terugNaar={`huidige versie`}
                url={
                    apiTest === true
                        ? `/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}/${dataObjectID}`
                        : `/muteer/${overzichtSlug}/${dataObjectID}`
                }
            />
        )
    }
}

function RevisieOverzicht(props) {
    return (
        <div className="block group py-2 no-underline">
            <h4 className="text-gray-800 font-bold text-sm">Revisies</h4>
            <ul className="text-gray-700 text-sm">
                {props.revisieObject.slice(1).map((revisieObject, index) => (
                    <li key={revisieObject.UUID}>
                        <Link
                            className="text-blue"
                            to={`/${props.overzichtSlug}/${revisieObject.ID}/${revisieObject.UUID}`}
                        >
                            {format(
                                new Date(revisieObject.Modified_Date),
                                'D MMM YYYY'
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function EditButton(props) {
    const overzichtSlug = props.overzichtSlug
    const objectID = props.objectID

    return (
        <Link
            to={`/api-test/${overzichtSlug}/edit/${objectID}`}
            className="font-bold py-2 px-4 text-sm rounded bg-blue-200 text-blue-700"
        >
            Edit
        </Link>
    )
}

class MuteerUniversalObjectDetail extends Component {
    constructor(props) {
        super(props)
        this.returnPageType = this.returnPageType.bind(this)
        this.getDataFromApi = this.getDataFromApi.bind(this)
        this.makeURLForNewObject = this.makeURLForNewObject.bind(this)
        this.makeURLForRevisieObject = this.makeURLForRevisieObject.bind(this)
        this.state = {
            dataObject: null,
            pageType: this.returnPageType(),
            dataReceived: false,
        }
    }

    // Met d to set the page type: detail/version
    returnPageType() {
        let pageType = 'detail'
        if (this.props.match.params.version) {
            pageType = 'version'
        }
        return pageType
    }

    // Method to create the API endpoint, based on the page type
    getDataFromApi() {
        const ApiEndpointBase = this.props.dataModel.variables.Api_Endpoint
        let apiEndpoint = ''

        if (this.state.pageType === 'detail') {
            let detail_id = this.props.match.params.single
            apiEndpoint = `${ApiEndpointBase}/${detail_id}`
        } else if (this.state.pageType === 'version') {
            let version_id = this.props.match.params.version
            apiEndpoint = `${ApiEndpointBase}/version/${version_id}`
        }

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
                    }
                    this.setState({
                        dataReceived: true,
                    })
                } else {
                    console.log(error)
                }
            })
    }

    makeURLForRevisieObject(overzichtSlug, objectID, apiTest, objectUUID) {
        if (apiTest) {
            // return `/api-test/${overzichtSlug}/edit/${objectID}`
            return `/muteer/api-test/${overzichtSlug}/${objectID}/${objectUUID}`
        } else {
            // return `/muteer/${overzichtSlug}/edit/${objectID}`
            return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}`
        }
    }

    makeURLForNewObject(overzichtSlug, objectID, apiTest) {
        if (apiTest) {
            return `/muteer/api-test/${overzichtSlug}/edit/${objectID}`
        } else {
            return `/muteer/${overzichtSlug}/edit/${objectID}`
        }
    }

    render() {
        // Variables to give as props
        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud
        const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
        const hoofdOnderdeelSlug = this.props.hoofdOnderdeelSlug
        const apiTest = this.props.apiTest
        const pageType = this.state.pageType

        // False if data is loading, true if there is a response
        let dataReceived = this.state.dataReceived

        // Create dataObject and revisieObject to pass down to the sidebar
        let dataObject = {}
        let revisieObject = {}

        // If the page is a detail page the dataObject will be an array.
        // Else the dataObject will be a single Object
        if (dataReceived && pageType === 'detail') {
            dataObject = this.state.dataObject[0]
            revisieObject = this.state.dataObject
        } else if (dataReceived && pageType === 'version') {
            dataObject = this.state.dataObject
        }

        console.log(dataObject)

        return (
            <ContainerMain>
                {dataObject.Titel ? (
                    <Helmet>
                        <title>Omgevingsbeleid - {dataObject.Titel}</title>
                    </Helmet>
                ) : null}

                {/* Main Menu - Sidebar
                <MainSidebar /> */}

                {/* Dimensie Container */}
                <div className="w-full inline-block">
                    <GenerateBackToButton
                        dataObject={dataObject}
                        titelEnkelvoud={titelEnkelvoud}
                        overzichtSlug={overzichtSlug}
                        hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                        apiTest={apiTest}
                        pageType={pageType}
                    />

                    <div className="flex">
                        {/* <RevisieOverzicht revisieObject={revisieObject} /> */}

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
                                        to={`/muteer/${this.props.overzichtSlug}/edit/${this.props.match.params.single}`}
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
                                        <span
                                            to={`/muteer/${this.props.overzichtSlug}/edit/${this.props.match.params.single}`}
                                            className="text-sm inline text-gray-700 -mt-5 pl-5 cursor-pointer hover:underline"
                                        >
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

                            {dataReceived && pageType === 'detail' ? (
                                <div>
                                    <div className="w-24 h-6 border-r-2 flex items-center justify-end border-gray-300 pt-5 mr-2 " />
                                    <ul className="revisie-list relative">
                                        {this.state.dataObject.map(
                                            (item, index) => {
                                                return (
                                                    <li key={index}>
                                                        <div className="flex items-center justify-between">
                                                            <Link
                                                                id={`revisie-item-${index}`}
                                                                to={this.makeURLForRevisieObject(
                                                                    overzichtSlug,
                                                                    item.ID,
                                                                    apiTest,
                                                                    item.UUID
                                                                )}
                                                                className="flex items-end h-6 relative mr-2 hover:underline"
                                                            >
                                                                <span className="text-xs text-gray-600 pr-5 w-24 text-right pr-4">
                                                                    {format(
                                                                        new Date(
                                                                            item.Modified_Date
                                                                        ),
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
                                            }
                                        )}
                                    </ul>
                                </div>
                            ) : null}
                        </div>

                        {this.state.dataObject &&
                        this.state.dataObject[0] &&
                        (this.state.dataObject[0].Opdrachtgever !== undefined ||
                            this.state.dataObject[0].Eigenaar_1 !== undefined ||
                            this.state.dataObject[0].Eigenaar_2 !== undefined ||
                            this.state.dataObject[0].Portefeuillehouder_1 !==
                                undefined ||
                            this.state.dataObject[0].Portefeuillehouder_2 !==
                                undefined) ? (
                            <React.Fragment>
                                <div className="w-3/12">
                                    <h2 className="mb-2 font-serif text-gray-700">
                                        Eigenaarsdriehoek
                                    </h2>
                                    {this.state.dataObject[0].Opdrachtgever !==
                                        null &&
                                    this.state.dataObject[0].Opdrachtgever !==
                                        undefined ? (
                                        <EigenaarsDriehoekItem
                                            eigenaarType="Opdrachtgever"
                                            UUID={
                                                this.state.dataObject[0]
                                                    .Opdrachtgever
                                            }
                                        />
                                    ) : null}
                                    {this.state.dataObject[0].Eigenaar_1 !==
                                        null &&
                                    this.state.dataObject[0].Eigenaar_1 !==
                                        undefined ? (
                                        <EigenaarsDriehoekItem
                                            eigenaarType="Eigenaar 1"
                                            UUID={
                                                this.state.dataObject[0]
                                                    .Eigenaar_1
                                            }
                                        />
                                    ) : null}
                                    {this.state.dataObject[0].Eigenaar_2 !==
                                        null &&
                                    this.state.dataObject[0].Eigenaar_2 !==
                                        undefined ? (
                                        <EigenaarsDriehoekItem
                                            eigenaarType="Eigenaar 2"
                                            UUID={
                                                this.state.dataObject[0]
                                                    .Eigenaar_2
                                            }
                                        />
                                    ) : null}
                                    {this.state.dataObject[0]
                                        .Portefeuillehouder_1 !== null &&
                                    this.state.dataObject[0]
                                        .Portefeuillehouder_1 !== undefined ? (
                                        <EigenaarsDriehoekItem
                                            eigenaarType="Portefeuillehouder 1"
                                            UUID={
                                                this.state.dataObject[0]
                                                    .Portefeuillehouder_1
                                            }
                                        />
                                    ) : null}
                                    {this.state.dataObject[0]
                                        .Portefeuillehouder_2 !== null &&
                                    this.state.dataObject[0]
                                        .Portefeuillehouder_2 !== undefined ? (
                                        <EigenaarsDriehoekItem
                                            eigenaarType="Portefeuillehouder 2"
                                            UUID={
                                                this.state.dataObject[0]
                                                    .Portefeuillehouder_2
                                            }
                                        />
                                    ) : null}
                                </div>
                            </React.Fragment>
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

export default MuteerUniversalObjectDetail
