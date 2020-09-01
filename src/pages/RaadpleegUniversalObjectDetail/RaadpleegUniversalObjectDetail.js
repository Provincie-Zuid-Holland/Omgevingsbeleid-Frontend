import React, { Component } from 'react'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet'
import nlLocale from 'date-fns/locale/nl'
import {
    faArrowLeft,
    faExternalLinkAlt,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
// import PDFDocument from './PDFDocument'
import RelatieComponent from './RelatieComponent'
import LeafletTinyViewer from './../../components/LeafletTinyViewer'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import PopUpRevisieContainer from './../../components/PopUpRevisieContainer'
import LoaderContent from './../../components/LoaderContent'
import LoaderSmallSpan from './../../components/LoaderSmallSpan'

// Import view containers
import ContainerViewFieldsBeleidsbeslissing from './ContainerFields/ContainerViewFieldsBeleidsbeslissing'
import ContainerViewFieldsBeleidsregel from './ContainerFields/ContainerViewFieldsBeleidsregel'
import ContainerViewFieldsMaatregel from './ContainerFields/ContainerViewFieldsMaatregel'
import ContainerViewFieldsOpgave from './ContainerFields/ContainerViewFieldsOpgave'
import ContainerViewFieldsAmbitie from './ContainerFields/ContainerViewFieldsAmbitie'
import ContainerViewFieldsBelang from './ContainerFields/ContainerViewFieldsBelang'
import ContainerViewFieldsThema from './ContainerFields/ContainerViewFieldsThema'
import RelatiesKoppelingen from './RelatiesKoppelingen'

function RevisieListItem(props) {
    return (
        <li className="py-2">
            <span
                className={`inline-block w-4 h-4 bg-${props.color}-500 rounded-full mt-1 absolute`}
            />
            <span
                className={`pl-6 text-sm ${props.current ? 'font-bold' : null}`}
            >
                {props.content}
            </span>
        </li>
    )
}

class RaadpleegUniversalObjectDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataObject: null,
            revisieObjecten: null,
            dataLoaded: false,
            fullscreenLeafletViewer: false,
            downloadPDF: false,
        }
        this.toggleFullscreenLeafletViewer = this.toggleFullscreenLeafletViewer.bind(
            this
        )
        this.toggleDownloadPDF = this.toggleDownloadPDF.bind(this)
        this.initializeComponent = this.initializeComponent.bind(this)
    }

    toggleDownloadPDF() {
        this.setState({
            downloadPDF: !this.state.downloadPDF,
        })
    }

    toggleFullscreenLeafletViewer() {
        this.setState({
            fullscreenLeafletViewer: !this.state.fullscreenLeafletViewer,
        })
    }

    initializeComponent() {
        const ApiEndpointBase = this.props.dataModel.API_ENDPOINT
        let detail_id = this.props.match.params.id
        let apiEndpoint = `${ApiEndpointBase}/version/${detail_id}`

        axios
            .get(apiEndpoint)
            .then((res) => {
                const dataObject = res.data
                const revisieObjecten = res.data
                this.setState({
                    dataObject: dataObject,
                    revisieObjecten: revisieObjecten,
                    dataLoaded: true,
                })
            })
            .catch((err) => {
                if (err.response !== undefined) {
                    if (err.response.status === 404) {
                        this.props.history.push(`/`)
                        toast(
                            `Deze ${this.props.dataModel.TITEL_ENKELVOUD.toLowerCase()} kon niet gevonden worden`
                        )
                    } else if (err.response.status === 422) {
                        this.props.history.push(`/login`)
                        toast(
                            `U moet voor nu nog inloggen om deze pagina te kunnen bekijken`
                        )
                    } else {
                        console.log(err)
                        toast(process.env.REACT_APP_ERROR_MSG)
                    }
                } else {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                }
            })
    }

    componentDidMount() {
        this.initializeComponent()
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.initializeComponent()
            window.scrollTo(0, 0)
        }
    }

    render() {
        const dataObject = this.state.dataObject
        const dataLoaded = this.state.dataLoaded
        let werkingsgebiedBoolean = false

        // Werkingsgebieden zijn er bij de volgende objecten:
        // - Beleidsbeslissing
        if (
            dataObject !== null &&
            (dataObject.Gebied ||
                (dataObject.WerkingsGebieden && dataObject.WerkingsGebieden[0]))
        ) {
            werkingsgebiedBoolean = true
        } else {
            werkingsgebiedBoolean = false
        }

        let werkingsGebiedUUID = null

        // !REFACTOR! -> Dit zou 1 property moeten zijn
        if (werkingsgebiedBoolean && dataObject.Gebied) {
            werkingsGebiedUUID = dataObject.Gebied
        } else if (
            werkingsgebiedBoolean &&
            dataObject.WerkingsGebieden &&
            dataObject.WerkingsGebieden[0]
        ) {
            werkingsGebiedUUID = dataObject.WerkingsGebieden[0].UUID
        }

        const titelEnkelvoud = this.props.dataModel.TITEL_ENKELVOUD

        let searchQuery = null

        const urlParams = new URLSearchParams(window.location.search)
        const fromPage = urlParams.get('fromPage')

        // !Refactor! -> hash to searchParam
        if (window.location.hash) {
            searchQuery = window.location.hash.substr(1)
        }

        return (
            <React.Fragment>
                <div
                    className="container flex w-full px-6 mx-auto mt-8 mb-16 md:max-w-4xl"
                    id="raadpleeg-detail-container-main"
                >
                    <Helmet>
                        <style type="text/css">{`
                    @media print {
                        #raadpleeg-detail-sidebar,
                        #raadpleeg-detail-werkingsgebied,
                        #navigation-main,
                        #raadpleeg-detail-container-meta-info {
                            display: none;
                        }
                        #raadpleeg-detail-container-main {
                            margin-top: 0px;
                        }
                        #raadpleeg-detail-container-content {
                            width: 100%;
                        }
                        #raadpleeg-detail-header-one {
                            margin-bottom: 2rem;
                        }
                    }                     
                `}</style>
                    </Helmet>
                    {dataLoaded ? (
                        <div
                            id="raadpleeg-detail-container-content"
                            className={`w-full pt-6`}
                        >
                            <div className="container absolute inset-x-0 hidden w-full px-6 mx-auto xl:flex">
                                <div className="pl-3">
                                    <BackButton
                                        fromPage={fromPage}
                                        searchQuery={searchQuery}
                                    />
                                </div>
                            </div>
                            <div className="block xl:hidden">
                                <BackButton
                                    fromPage={fromPage}
                                    searchQuery={searchQuery}
                                />
                            </div>
                            {/* Artikel Headers */}
                            <Heading
                                type={this.props.dataModel.TITEL_ENKELVOUD}
                                titel={dataObject.Titel}
                            />

                            {/* Meta Content */}
                            <MetaInfo
                                dataLoaded={dataLoaded}
                                revisieObjecten={this.state.revisieObjecten}
                                dataObject={dataObject}
                            />

                            <div className="mt-8">
                                {/* Inhoud Sectie */}
                                {titelEnkelvoud === 'Beleidskeuze' ? (
                                    <ContainerViewFieldsBeleidsbeslissing
                                        crudObject={dataObject}
                                    />
                                ) : null}
                                {titelEnkelvoud === 'Beleidsregel' ? (
                                    <ContainerViewFieldsBeleidsregel
                                        crudObject={dataObject}
                                    />
                                ) : null}
                                {titelEnkelvoud === 'Maatregel' ? (
                                    <ContainerViewFieldsMaatregel
                                        crudObject={dataObject}
                                    />
                                ) : null}
                                {titelEnkelvoud === 'Opgave' ? (
                                    <ContainerViewFieldsOpgave
                                        crudObject={dataObject}
                                    />
                                ) : null}
                                {/*  */}
                                {titelEnkelvoud === 'Ambitie' ? (
                                    <ContainerViewFieldsAmbitie
                                        crudObject={dataObject}
                                    />
                                ) : null}
                                {titelEnkelvoud === 'Belang' ? (
                                    <ContainerViewFieldsBelang
                                        crudObject={dataObject}
                                    />
                                ) : null}
                                {titelEnkelvoud === 'Thema' ? (
                                    <ContainerViewFieldsThema
                                        crudObject={dataObject}
                                    />
                                ) : null}
                            </div>

                            {werkingsgebiedBoolean ? (
                                <Werkingsgebied
                                    fullscreenLeafletViewer={
                                        this.state.fullscreenLeafletViewer
                                    }
                                    toggleFullscreenLeafletViewer={
                                        this.toggleFullscreenLeafletViewer
                                    }
                                    werkingsGebiedUUID={werkingsGebiedUUID}
                                />
                            ) : null}
                        </div>
                    ) : (
                        <LoaderContent />
                    )}
                </div>
                {/* <RelatieComponent
                    crudObject={dataObject}
                    urlParam={this.props.match.params.id}
                /> */}
                {dataLoaded && titelEnkelvoud === 'Beleidskeuze' ? (
                    <RelatiesKoppelingen beleidskeuze={dataObject} />
                ) : null}
            </React.Fragment>
        )
    }
}

const BackButton = ({ fromPage, searchQuery }) => {
    return (
        <Link
            to={
                searchQuery
                    ? `/zoekresultaten${searchQuery}`
                    : fromPage
                    ? fromPage
                    : '/'
            }
            className={`text-gray-500 mb-4 inline-block hover:underline`}
            id="button-back-to-previous-page"
        >
            <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
            <span>Terug</span>
        </Link>
    )
}

const Werkingsgebied = ({
    fullscreenLeafletViewer,
    toggleFullscreenLeafletViewer,
    werkingsGebiedUUID,
}) => {
    return (
        <div className="w-full mt-8" id="raadpleeg-detail-werkingsgebied">
            <div className="flex items-center justify-between pb-3 text-gray-800">
                <h2 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                    Werkingsgebied
                </h2>
                <span
                    className="px-2 text-xs cursor-pointer"
                    onClick={toggleFullscreenLeafletViewer}
                >
                    Bekijk in het groot
                    <FontAwesomeIcon
                        className="ml-2 text-gray-700"
                        icon={faExternalLinkAlt}
                    />
                </span>
            </div>

            <div
                className="overflow-hidden rounded-lg"
                id={`full-screen-leaflet-container-${fullscreenLeafletViewer}`}
            >
                <LeafletTinyViewer
                    gebiedType="Werkingsgebieden"
                    gebiedUUID={werkingsGebiedUUID}
                    fullscreen={fullscreenLeafletViewer}
                />
            </div>
        </div>
    )
}

const Heading = ({ type, titel }) => {
    return (
        <React.Fragment>
            <span className="block text-xl font-bold opacity-25 text-primary-super-dark">
                {type}
            </span>
            <h1
                id="raadpleeg-detail-header-one"
                className="mt-1 text-4xl font-semibold text-primary-super-dark "
            >
                {titel}
            </h1>
        </React.Fragment>
    )
}

const MetaInfo = ({ revisieObjecten, dataObject }) => {
    return (
        <div className="block mt-2" id="raadpleeg-detail-container-meta-info">
            <span className="mr-3 text-sm text-gray-800 opacity-75">
                {dataObject['Begin_Geldigheid']
                    ? 'Vigerend sinds ' +
                      format(
                          new Date(dataObject['Begin_Geldigheid']),
                          'd MMMM yyyy',
                          { locale: nlLocale }
                      )
                    : 'Er is nog geen begin geldigheid'}
            </span>

            {revisieObjecten && revisieObjecten.length > 0 ? (
                <React.Fragment>
                    <span className="mr-3 text-sm text-gray-600">&bull;</span>
                    <PopUpRevisieContainer
                        aantalRevisies={revisieObjecten.length - 1}
                    >
                        {revisieObjecten.map((item, index) => (
                            <RevisieListItem
                                key={dataObject.UUID}
                                content={
                                    dataObject['Begin_Geldigheid'] !== null
                                        ? format(
                                              new Date(
                                                  dataObject['Begin_Geldigheid']
                                              ),
                                              'd MMM yyyy',
                                              {
                                                  locale: nlLocale,
                                              }
                                          )
                                        : 'Er is nog geen begin geldigheid'
                                }
                                color={index === 0 ? 'orange' : 'blue'}
                                current={index === 0 ? true : false}
                            />
                        ))}
                    </PopUpRevisieContainer>
                </React.Fragment>
            ) : null}
        </div>
    )
}

export default RaadpleegUniversalObjectDetail
