import React, { Component } from 'react'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet'
import nlLocale from 'date-fns/locale/nl'
import {
    faAngleLeft,
    faTimes,
    faFileDownload,
    faPrint,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'

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
import PopUpAnimatedContainer from './../../components/PopUpAnimatedContainer'

// Import view containers
import ContainerViewFieldsBeleidsbeslissing from './ContainerFields/ContainerViewFieldsBeleidsbeslissing'
import ContainerViewFieldsBeleidsregel from './ContainerFields/ContainerViewFieldsBeleidsregel'
import ContainerViewFieldsMaatregel from './ContainerFields/ContainerViewFieldsMaatregel'
import ContainerViewFieldsOpgave from './ContainerFields/ContainerViewFieldsOpgave'
import ContainerViewFieldsAmbitie from './ContainerFields/ContainerViewFieldsAmbitie'
import ContainerViewFieldsBelang from './ContainerFields/ContainerViewFieldsBelang'
import ContainerViewFieldsThema from './ContainerFields/ContainerViewFieldsThema'
import ContainerViewFieldsVerordeningsobject from './ContainerFields/ContainerViewFieldsVerordeningsobject'

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

// !REFACTOR! -> File opschonen
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

        // Connect With the API
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
            .catch((error) => {
                if (error.response !== undefined) {
                    if (error.response.status === 404) {
                        this.props.history.push(`/`)
                        toast(
                            `Deze ${this.props.dataModel.TITEL_ENKELVOUD.toLowerCase()} kon niet gevonden worden`
                        )
                    } else if (error.response.status === 422) {
                        this.props.history.push(`/login`)
                        toast(
                            `U moet voor nu nog inloggen om deze pagina te kunnen bekijken`
                        )
                    } else {
                        toast(`Er is iets misgegaan`)
                    }
                } else {
                    toast(`Er is iets misgegaan`)
                }
            })
    }

    componentDidMount() {
        this.initializeComponent()
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.initializeComponent()
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
            <div
                className="container flex px-6 pb-20 mx-auto mt-8"
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
                        className={`w-full`}
                    >
                        {searchQuery ? (
                            <ButtonBackToPage
                                terugNaar="zoekresultaten"
                                url={`/zoekresultaten${searchQuery}`}
                            />
                        ) : fromPage ? (
                            <ButtonBackToPage
                                terugNaar="vorige pagina"
                                url={fromPage}
                            />
                        ) : (
                            <ButtonBackToPage terugNaar="startpagina" url="/" />
                        )}
                        {/* Artikel Headers */}
                        <span className="block font-serif text-gray-800 text-l">
                            {this.props.dataModel.TITEL_ENKELVOUD}
                        </span>
                        <h1
                            id="raadpleeg-detail-header-one"
                            className="mt-2 text-gray-800 heading-serif-2xl"
                        >
                            {dataObject.Titel}
                        </h1>
                        {/* Meta Content */}
                        <div
                            className="block mb-8"
                            id="raadpleeg-detail-container-meta-info"
                        >
                            {dataLoaded ? (
                                <span className="mr-3 text-sm text-gray-600">
                                    {dataObject['Begin_Geldigheid'] !== null
                                        ? format(
                                              new Date(
                                                  dataObject['Begin_Geldigheid']
                                              ),
                                              'd MMMM yyyy',
                                              { locale: nlLocale }
                                          )
                                        : 'Er is nog geen begin geldigheid'}
                                </span>
                            ) : (
                                <span className="block mt-2">
                                    <LoaderSmallSpan />
                                </span>
                            )}
                            {this.state.revisieObjecten &&
                            this.state.revisieObjecten.length > 0 ? (
                                <React.Fragment>
                                    <span className="mr-3 text-sm text-gray-600">
                                        &bull;
                                    </span>
                                    <PopUpRevisieContainer
                                        aantalRevisies={
                                            this.state.revisieObjecten.length -
                                            1
                                        }
                                    >
                                        {this.state.revisieObjecten.map(
                                            (item, index) =>
                                                index === 0 ? (
                                                    <RevisieListItem
                                                        key={dataObject.UUID}
                                                        content={
                                                            dataObject[
                                                                'Begin_Geldigheid'
                                                            ] !== null
                                                                ? format(
                                                                      new Date(
                                                                          dataObject[
                                                                              'Begin_Geldigheid'
                                                                          ]
                                                                      ),
                                                                      'd MMM yyyy',
                                                                      {
                                                                          locale: nlLocale,
                                                                      }
                                                                  )
                                                                : 'Er is nog geen begin geldigheid'
                                                        }
                                                        color="orange"
                                                        current={true}
                                                    />
                                                ) : (
                                                    <RevisieListItem
                                                        key={dataObject.UUID}
                                                        content={
                                                            dataObject[
                                                                'Begin_Geldigheid'
                                                            ] !== null
                                                                ? format(
                                                                      new Date(
                                                                          dataObject[
                                                                              'Begin_Geldigheid'
                                                                          ]
                                                                      ),
                                                                      'd MMM yyyy',
                                                                      {
                                                                          locale: nlLocale,
                                                                      }
                                                                  )
                                                                : 'Er is nog geen begin geldigheid'
                                                        }
                                                        color="blue"
                                                    />
                                                )
                                        )}
                                    </PopUpRevisieContainer>
                                </React.Fragment>
                            ) : null}
                            <span className="mr-3 text-sm text-gray-600">
                                &bull;
                            </span>
                            <span
                                className="mr-3 text-sm text-gray-600 cursor-pointer"
                                onClick={() => window.print()}
                            >
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faPrint}
                                />
                                Afdrukken
                            </span>
                        </div>

                        {/* Inhoud Sectie */}
                        {titelEnkelvoud === 'Beleidsbeslissing' ? (
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
                            <ContainerViewFieldsThema crudObject={dataObject} />
                        ) : null}

                        {dataLoaded && werkingsgebiedBoolean ? (
                            <div
                                className="w-full mt-5"
                                id="raadpleeg-detail-werkingsgebied"
                            >
                                <div className="flex items-center justify-between pb-3 text-gray-800">
                                    <h2 className="block mb-2 font-serif text-lg tracking-wide text-gray-700">
                                        Werkingsgebied
                                    </h2>
                                    {dataLoaded ? (
                                        <span
                                            className="px-2 text-xs cursor-pointer"
                                            onClick={
                                                this
                                                    .toggleFullscreenLeafletViewer
                                            }
                                        >
                                            Bekijk in het groot
                                            <FontAwesomeIcon
                                                className="ml-2 text-gray-700"
                                                icon={faExternalLinkAlt}
                                            />
                                        </span>
                                    ) : null}
                                </div>

                                <div
                                    className="overflow-hidden rounded-lg"
                                    id={`full-screen-leaflet-container-${this.state.fullscreenLeafletViewer}`}
                                >
                                    <LeafletTinyViewer
                                        gebiedType="Werkingsgebieden"
                                        gebiedUUID={werkingsGebiedUUID}
                                        fullscreen={
                                            this.state.fullscreenLeafletViewer
                                        }
                                    />
                                </div>
                            </div>
                        ) : null}

                        {titelEnkelvoud === 'Beleidsbeslissing' ? (
                            <RelatieComponent
                                crudObject={dataObject}
                                urlParam={this.props.match.params.id}
                            />
                        ) : null}
                    </div>
                ) : (
                    <LoaderContent />
                )}
            </div>
        )
    }
}

export default RaadpleegUniversalObjectDetail
