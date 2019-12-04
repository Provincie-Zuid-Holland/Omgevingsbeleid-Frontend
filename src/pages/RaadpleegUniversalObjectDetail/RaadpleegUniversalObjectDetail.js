import React, { Component } from 'react'
import { format } from 'date-fns'
import { Helmet } from 'react-helmet'
import nlLocale from 'date-fns/locale/nl'
import {
    faEllipsisV,
    faAngleRight,
    faAngleLeft,
    faClock,
    faTimes,
    faFileDownload,
    faPrint,
    faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { PDFDownloadLink } from '@react-pdf/renderer'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
import ContentTekst from './ContentTekst'
import PDFDocument from './PDFDocument'
import LeafletTinyViewer from './../../components/LeafletTinyViewer'
import LeafletLargeViewer from './LeafletLargeViewer'
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

    componentDidMount() {
        // Nodig voor API Call:
        // Type object nodig
        // Object ID nodig

        const ApiEndpointBase = this.props.dataModel.variables.Api_Endpoint
        let apiEndpoint = ''

        // @@ Stuk code voor Version view implementatie @@
        // if (this.state.pageType === 'detail') {
        //     let detail_id = this.props.match.params.single
        //     apiEndpoint = `${ApiEndpointBase}/${detail_id}`
        // } else if (this.state.pageType === 'version') {
        //     let version_id = this.props.match.params.version
        //     apiEndpoint = `${ApiEndpointBase}/version/${version_id}`
        // }

        let detail_id = this.props.match.params.id
        apiEndpoint = `${ApiEndpointBase}/${detail_id}`

        // Connect With the API
        axios
            .get(apiEndpoint)
            .then(res => {
                const dataObject = res.data[0]
                const revisieObjecten = res.data
                this.setState(
                    {
                        dataObject: dataObject,
                        revisieObjecten: revisieObjecten,
                        dataLoaded: true,
                    },
                    () => console.log(this.state)
                )
            })
            .catch(error => {
                if (error.response !== undefined) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('access_token')
                        this.props.history.push('/login')
                    } else if (error.response.status === 404) {
                        this.props.history.push(`/`)
                        toast(
                            `Deze ${this.props.dataModel.variables.Titel_Enkelvoud.toLowerCase()} kon niet gevonden worden`
                        )
                    } else if (error.response.status === 422) {
                        this.props.history.push(`/login`)
                        toast(
                            `U moet voor nu nog inloggen om deze pagina te kunnen bekijken`
                        )
                    }
                    this.setState({
                        dataLoaded: true,
                    })
                } else {
                    this.setState({
                        dataLoaded: true,
                    })
                    toast(`Er is iets misgegaan`)
                }
            })
    }

    render() {
        const dataObject = this.state.dataObject
        const dataLoaded = this.state.dataLoaded
        let werkingsgebiedBoolean = false

        // Werkingsgebieden zijn er bij de volgende objecten:
        // - Beleidsbeslissing
        console.log(dataObject)
        if (
            dataObject !== null &&
            (dataObject.Gebied ||
                (dataObject.WerkingsGebieden && dataObject.WerkingsGebieden[0]))
        ) {
            console.log('Ja')
            werkingsgebiedBoolean = true
        } else {
            console.log('Nee')
            werkingsgebiedBoolean = false
        }

        let werkingsGebiedUUID = null

        if (werkingsgebiedBoolean && dataObject.Gebied) {
            werkingsGebiedUUID = dataObject.Gebied
        } else if (
            werkingsgebiedBoolean &&
            dataObject.WerkingsGebieden &&
            dataObject.WerkingsGebieden[0]
        ) {
            werkingsGebiedUUID = dataObject.WerkingsGebieden[0].UUID
        }

        const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud

        return (
            <div
                className="container mx-auto flex px-6 pb-8 mt-8"
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
                <div className="w-1/4" id="raadpleeg-detail-sidebar">
                    {!this.state.fullscreenLeafletViewer ? (
                        <React.Fragment>
                            <ButtonBackToPage terugNaar="startpagina" url="/" />
                            <h2 className="text-gray-800 mt-6 text-l font-serif block">
                                Gerelateerde{' '}
                                {this.props.dataModel.variables.Titel_Meervoud}
                            </h2>
                            <ul className="mt-4 pr-8">
                                <li className="mt-2 text-gray-700">
                                    <span className="text-sm block">
                                        Hier komen gerelateerde{' '}
                                        {
                                            this.props.dataModel.variables
                                                .Titel_Meervoud
                                        }
                                    </span>
                                </li>
                            </ul>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <span
                                onClick={this.toggleFullscreenLeafletViewer}
                                className="text-l mb-2 inline-block text-gray-600 cursor-pointer pr-5"
                            >
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faAngleLeft}
                                />
                                <span>Terug naar artikelpagina</span>
                            </span>
                        </React.Fragment>
                    )}
                </div>
                {dataLoaded ? (
                    <div
                        id="raadpleeg-detail-container-content"
                        className={werkingsgebiedBoolean ? `w-2/4` : `w-3/4`}
                    >
                        {/* Artikel Headers */}
                        <span className="text-l font-serif block text-gray-800">
                            {this.props.dataModel.variables.Titel_Enkelvoud}
                        </span>
                        <h1
                            id="raadpleeg-detail-header-one"
                            className="mt-2 heading-serif-2xl text-gray-800"
                        >
                            {dataObject.Titel}
                        </h1>

                        {/* Meta Content */}
                        <div
                            className="mb-8 block"
                            id="raadpleeg-detail-container-meta-info"
                        >
                            {/* <span className="text-gray-600 text-sm mr-3">
                                Vigerend sinds{' '}
                                {format(
                                    new Date(dataObject.Begin_Geldigheid),
                                    'D MMM YYYY'
                                )}
                            </span> */}
                            {dataLoaded ? (
                                <span className="text-gray-600 text-sm mr-3">
                                    {dataObject['Begin_Geldigheid'] !== null
                                        ? format(
                                              new Date(
                                                  dataObject['Begin_Geldigheid']
                                              ),
                                              'D MMMM YYYY',
                                              { locale: nlLocale }
                                          )
                                        : 'Er is nog geen begin geldigheid'}
                                </span>
                            ) : (
                                <span className="mt-2 block">
                                    <LoaderSmallSpan />
                                </span>
                            )}
                            {this.state.revisieObjecten &&
                            this.state.revisieObjecten.length > 0 ? (
                                <React.Fragment>
                                    <span className="text-gray-600 text-sm mr-3">
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
                                                                      'D MMM YYYY',
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
                                                                      'D MMM YYYY',
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
                            <span className="text-gray-600 text-sm mr-3">
                                &bull;
                            </span>
                            <span
                                onClick={this.toggleDownloadPDF}
                                className="text-gray-600 text-sm mr-3 cursor-pointer"
                            >
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faFileDownload}
                                />
                                Download als PDF
                            </span>
                            {this.state.downloadPDF ? (
                                <PopUpAnimatedContainer small={true}>
                                    <React.Fragment>
                                        <span
                                            className="text-gray-800 p-4 absolute right-0 top-0 cursor-pointer"
                                            onClick={this.toggleDownloadPDF}
                                        >
                                            <FontAwesomeIcon
                                                className="mr-2"
                                                icon={faTimes}
                                            />
                                        </span>
                                        <PDFDownloadLink
                                            document={
                                                <PDFDocument
                                                    dataObject={dataObject}
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                    titel={dataObject.Titel}
                                                />
                                            }
                                            className="text-gray-600 text-sm mr-3"
                                            fileName="test.pdf"
                                        >
                                            {({ blob, url, loading, error }) =>
                                                loading ? (
                                                    <React.Fragment>
                                                        <FontAwesomeIcon
                                                            className="mr-2"
                                                            icon={
                                                                faFileDownload
                                                            }
                                                        />
                                                        PDF Genereren...
                                                    </React.Fragment>
                                                ) : (
                                                    <div className="p-4 text-center">
                                                        <div>
                                                            Hier kunt u
                                                            binnenkort het PDF
                                                            bestand downloaden .{' '}
                                                            {/* De PDF is
                                                            gegenereerd. Klik
                                                            hier om deze te
                                                            downloaden. */}
                                                        </div>
                                                        {/* <span className="text-white inline-block bg-green-600 px-4 py-2 rounded mt-4">
                                                            <FontAwesomeIcon
                                                                className="mr-2"
                                                                icon={
                                                                    faFileDownload
                                                                }
                                                            />
                                                            Download
                                                        </span> */}
                                                    </div>
                                                )
                                            }
                                        </PDFDownloadLink>
                                    </React.Fragment>
                                </PopUpAnimatedContainer>
                            ) : null}
                            <span className="text-gray-600 text-sm mr-3">
                                &bull;
                            </span>
                            <span
                                className="text-gray-600 text-sm mr-3 cursor-pointer"
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
                    </div>
                ) : (
                    <LoaderContent />
                )}
                {dataLoaded && werkingsgebiedBoolean ? (
                    <div
                        className="w-1/4 pl-8"
                        id="raadpleeg-detail-werkingsgebied"
                    >
                        <div className="flex justify-between items-center text-gray-800 pb-3">
                            <h2 className="text-l font-serif">
                                Werkingsgebied
                            </h2>
                            {dataLoaded ? (
                                <span
                                    className="text-xs cursor-pointer px-2"
                                    onClick={this.toggleFullscreenLeafletViewer}
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
                            id={`full-screen-leaflet-container-${this.state.fullscreenLeafletViewer}`}
                        >
                            <LeafletTinyViewer
                                gebiedType="Werkingsgebieden"
                                gebiedUUID={werkingsGebiedUUID}
                                fullscreen={this.state.fullscreenLeafletViewer}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }
}

export default RaadpleegUniversalObjectDetail
