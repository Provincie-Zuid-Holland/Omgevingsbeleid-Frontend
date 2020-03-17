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
import clonedeep from 'lodash.clonedeep'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
import LeafletTinyViewer from './../../components/LeafletTinyViewer'
import ButtonBackToPage from './../../components/ButtonBackToPage'
import PopUpRevisieContainer from './../../components/PopUpRevisieContainer'
import LoaderContent from './../../components/LoaderContent'
import LoaderSmallSpan from './../../components/LoaderSmallSpan'
import PopUpAnimatedContainer from './../../components/PopUpAnimatedContainer'

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

class RaadpleegVerordeningsArtikelDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataObject: null,
            revisieObjecten: null,
            dataLoaded: false,
            fullscreenLeafletViewer: false,
        }
        this.toggleFullscreenLeafletViewer = this.toggleFullscreenLeafletViewer.bind(
            this
        )
        this.initializeComponent = this.initializeComponent.bind(this)

        // Wordt gebruikt om de items in de verkregen verordeningsstructuur te populaten
        this.populateFieldsAndSetState = this.populateFieldsAndSetState.bind(
            this
        )
    }

    populateFieldsAndSetState(lineage) {
        lineage.Status = 'TEST'

        let amountOfRequests = 0
        let amountOfRequestsSolved = 0

        const that = this

        function getDataAndPopulateObject(child) {
            amountOfRequests++

            axios
                .get(`/verordeningen/version/${child.UUID}`)
                .then(res => {
                    const object = res.data
                    child.ID = object.ID
                    child.Begin_Geldigheid = object.Begin_Geldigheid
                    child.Eind_Geldigheid = object.Eind_Geldigheid
                    child.Created_By = object.Created_By
                    child.Created_Date = object.Created_Date
                    child.Modified_By = object.Modified_By
                    child.Modified_Date = object.Modified_Date
                    child.Titel = object.Titel
                    child.Inhoud = object.Inhoud
                    child.Status = object.Status
                    child.Type = object.Type
                    child.Volgnummer = object.Volgnummer
                    child.Werkingsgebied = object.Werkingsgebied
                    child.Eigenaar_1 = object.Eigenaar_1
                    child.Eigenaar_2 = object.Eigenaar_2
                    child.Portefeuillehouder_1 = object.Portefeuillehouder_1
                    child.Portefeuillehouder_2 = object.Portefeuillehouder_2
                    child.Opdrachtgever = object.Opdrachtgever

                    amountOfRequestsSolved++

                    if (amountOfRequests === amountOfRequestsSolved) {
                        that.setState({
                            dataLoaded: true,
                            lineage: clonedeep(lineage),
                            lineageCopy: clonedeep(lineage),
                        })
                    }
                })
                .catch(err => console.log(err))
        }

        function recursiveGetDataForChildren(child) {
            getDataAndPopulateObject(child)

            const hasChildren = child.Children.length > 0
            if (!hasChildren) return
            child.Children.map(childOfChild => {
                getDataAndPopulateObject(childOfChild)

                const hasChildren = childOfChild.Children.length > 0
                if (!hasChildren) return
                childOfChild.Children.map((recChild, index) => {
                    getDataAndPopulateObject(recChild)

                    const hasChildren = recChild.Children.length > 0
                    if (!hasChildren) return
                    recursiveGetDataForChildren(recChild)
                })
            })
        }

        lineage.Structuur.Children.map((child, index) => {
            const hasChildren = child.Children.length > 0
            if (hasChildren) {
                recursiveGetDataForChildren(child)
            } else {
                getDataAndPopulateObject(child)
            }
        })

        if (lineage.Structuur.Children.length === 0) {
            this.setState({
                dataLoaded: true,
                lineage: lineage,
            })
        }
    }

    toggleFullscreenLeafletViewer() {
        this.setState({
            fullscreenLeafletViewer: !this.state.fullscreenLeafletViewer,
        })
    }

    initializeComponent() {
        const ApiEndpointBase = this.props.dataModel.API_ENDPOINT
        let apiEndpoint = `${ApiEndpointBase}/${detail_id}`
        let detail_id = this.props.match.params.id

        // Connect With the API
        axios
            .get(apiEndpoint)
            .then(res => {
                const dataObject = res.data[0]
                const revisieObjecten = res.data
                this.setState({
                    dataObject: dataObject,
                    revisieObjecten: revisieObjecten,
                    dataLoaded: true,
                })
            })
            .catch(error => {
                this.setState({
                    dataLoaded: false,
                })
                toast(`Er is iets misgegaan`)
            })
    }

    componentDidMount() {
        const ID = this.props.match.params.lineageID

        // Get Lineage
        axios
            .get(`/verordeningstructuur/${ID}`)
            .then(res => {
                // Get latest lineage
                const lineage = res.data[res.data.length - 1]
                this.populateFieldsAndSetState(lineage)
            })
            .catch(err => {
                console.log(err)
            })
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

        let hashBool = false
        let searchQuery = null
        if (window.location.hash) {
            hashBool = true
            searchQuery = window.location.hash.substr(1)
        }

        return (
            <div
                className="container mx-auto flex px-6 pb-20 mt-8"
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
                            {hashBool ? (
                                <ButtonBackToPage
                                    terugNaar="zoekresultaten"
                                    url={`/zoekresultaten?query=${searchQuery}`}
                                />
                            ) : (
                                <ButtonBackToPage
                                    terugNaar="startpagina"
                                    url="/"
                                />
                            )}
                            <h2 className="text-gray-800 mt-6 text-l font-serif block">
                                Gerelateerde{' '}
                                {this.props.dataModel.TITEL_MEERVOUD}
                            </h2>
                            <ul className="mt-4 pr-8">
                                <li className="mt-2 text-gray-700">
                                    <span className="text-sm block">
                                        Hier komen gerelateerde{' '}
                                        {this.props.dataModel.TITEL_MEERVOUD}
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
                            {this.props.dataModel.TITEL_ENKELVOUD}
                        </span>
                        <h1
                            id="raadpleeg-detail-header-one"
                            className="mt-2 heading-serif-2xl text-gray-800"
                        >
                            {console.log(dataObject)}
                            {dataObject.Titel}
                        </h1>
                        {/* Meta Content */}
                        <div
                            className="mb-8 block"
                            id="raadpleeg-detail-container-meta-info"
                        >
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

export default RaadpleegVerordeningsArtikelDetail
