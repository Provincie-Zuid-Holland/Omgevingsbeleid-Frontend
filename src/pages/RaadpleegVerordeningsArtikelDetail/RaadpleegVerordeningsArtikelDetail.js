import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import queryString from 'query-string'
import {
    faAngleRight,
    faPrint,
    faExternalLinkAlt,
    faCompressArrowsAlt,
    faExpandArrowsAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clonedeep from 'lodash.clonedeep'
import LoaderContent from './../../components/LoaderContent'
import { toast } from 'react-toastify'

// Import Axios instance to connect with the API
import axios from '../../API/axios'

// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'
import VerordeningenDetailSidebar from './VerordeningenDetailSidebar'
import LeafletTinyViewer from './../../components/LeafletTinyViewer'

// !REFACTOR! -> Wordt nu op meerdere plekken gebruikt, move naar utils
function parseIntOrSetToNull(item) {
    if (item === 'null') {
        return null
    } else {
        return parseInt(item)
    }
}

// !REFACTOR! -> Wordt nu op meerdere plekken gebruikt, move naar utils
function getQueryStringValues(urlParams) {
    const queryStringValues = queryString.parse(urlParams)
    let hoofdstukIndex = parseIntOrSetToNull(queryStringValues.hoofdstuk)
    let nest_1 = parseIntOrSetToNull(queryStringValues.nest_1)
    let nest_2 = parseIntOrSetToNull(queryStringValues.nest_2)
    let nest_3 = parseIntOrSetToNull(queryStringValues.nest_3)
    return [hoofdstukIndex, nest_1, nest_2, nest_3]
}

class RaadpleegVerordeningsArtikelDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataObject: null,
            loadingNewObject: false,
            dataLoaded: false,
            activeObjectPath: null,
            fullscreenLeafletViewer: false,
        }

        this.toggleFullscreenLeafletViewer = this.toggleFullscreenLeafletViewer.bind(
            this
        )
    }

    toggleFullscreenLeafletViewer() {
        this.setState({
            fullscreenLeafletViewer: !this.state.fullscreenLeafletViewer,
        })
    }

    getBreadcrumb({ hoofdstukNummer, hoofdstukTitel }) {
        const activeObjectPath = this.state.activeObjectPath
        const lineageStructuur = this.state.lineage.Structuur
        let breadcrumb = null

        if (activeObjectPath[3] !== null) {
            breadcrumb = (
                <React.Fragment>
                    <span>{`${hoofdstukNummer}. ${hoofdstukTitel}`}</span>
                    <FontAwesomeIcon className="mx-2" icon={faAngleRight} />
                    <span>{`${
                        lineageStructuur.Children[activeObjectPath[0]].Children[
                            activeObjectPath[1]
                        ].Volgnummer
                    } ${
                        lineageStructuur.Children[activeObjectPath[0]].Children[
                            activeObjectPath[1]
                        ].Titel
                    }`}</span>
                    <FontAwesomeIcon className="mx-2" icon={faAngleRight} />
                    <span>{`
                    ${
                        lineageStructuur.Children[activeObjectPath[0]].Children[
                            activeObjectPath[1]
                        ].Children[activeObjectPath[2]].Volgnummer
                    } 
                    ${
                        lineageStructuur.Children[activeObjectPath[0]].Children[
                            activeObjectPath[1]
                        ].Children[activeObjectPath[2]].Titel
                    }`}</span>
                </React.Fragment>
            )
        } else if (activeObjectPath[2] !== null) {
            breadcrumb = (
                <React.Fragment>
                    <span>{`${hoofdstukNummer}. ${hoofdstukTitel}`}</span>
                    <FontAwesomeIcon className="mx-2" icon={faAngleRight} />
                    <span>{`${
                        lineageStructuur.Children[activeObjectPath[0]].Children[
                            activeObjectPath[1]
                        ].Volgnummer
                    } ${
                        lineageStructuur.Children[activeObjectPath[0]].Children[
                            activeObjectPath[1]
                        ].Titel
                    }`}</span>
                </React.Fragment>
            )
        }
        return breadcrumb
    }

    getAndSetLineage(ID) {
        return axios.get(`/verordeningstructuur/${ID}`).then(res => {
            // Get latest lineage
            const lineage = res.data[res.data.length - 1]
            // this.populateFieldsAndSetState(lineage)
            this.setState({
                lineage: lineage,
            })
        })
    }

    getAndSetVerordeningsObject(UUID) {
        return axios.get(`/verordeningen/version/${UUID}`).then(res => {
            // Get latest lineage
            const verordeningsObject = res.data
            // this.populateFieldsAndSetState(lineage)
            this.setState({
                verordeningsObject: verordeningsObject,
            })
        })
    }

    getAndSetLidObject(UUID) {
        return axios.get(`/verordeningen/version/${UUID}`).then(res => {
            // Get latest lineage
            const lidObject = res.data
            return lidObject
        })
    }

    getActiveObjectInLineage() {
        const lineage = this.state.lineage
        const activeObjectPath = this.state.activeObjectPath
        const [hoofdstukIndex, nest_1, nest_2, nest_3] = activeObjectPath

        if (nest_3 !== null) {
            return lineage.Structuur.Children[hoofdstukIndex].Children[nest_1]
                .Children[nest_2].Children[nest_3]
        } else if (nest_2 !== null) {
            return lineage.Structuur.Children[hoofdstukIndex].Children[nest_1]
                .Children[nest_2]
        } else if (nest_1 !== null) {
            return lineage.Structuur.Children[hoofdstukIndex].Children[nest_1]
        }
    }

    ifPresentGetAndSetLeden(UUID) {
        const verordeningsObjectInLineage = this.getActiveObjectInLineage(UUID)

        if (
            verordeningsObjectInLineage.Children &&
            verordeningsObjectInLineage.Children.length > 0
        ) {
            return Promise.all(
                verordeningsObjectInLineage.Children.map(child =>
                    this.getAndSetLidObject(child.UUID)
                )
            ).then(ledenObjecten =>
                this.setState({
                    ledenObjecten: ledenObjecten,
                })
            )
        } else {
            this.setState({
                ledenObjecten: null
            })
            return Promise.resolve()
        }
    }

    IfPresentGetAndSetUrlParams() {
        const urlParams = this.props.location.search
        return new Promise((resolve, reject) => {
            if (urlParams) {
                let [
                    hoofdstukIndex,
                    nest1,
                    nest2,
                    nest3,
                ] = getQueryStringValues(urlParams)

                this.setState(
                    {
                        activeObjectPath: [hoofdstukIndex, nest1, nest2, nest3],
                    },
                    () => resolve()
                )
            } else {
                resolve()
            }
        })
    }

    componentDidMount() {
        // Get Data from API
        const ID = this.props.match.params.lineageID
        const UUID = this.props.match.params.objectUUID

        // If there are URL paramaters, get and set them in State
        // We use the URL parameters to see which verordeningsObject is active in the verordeningsStructure

        Promise.all([
            this.getAndSetLineage(ID),
            this.IfPresentGetAndSetUrlParams(),
            this.getAndSetVerordeningsObject(UUID),
        ])
            .then(() => {
                if (this.state.verordeningsObject.Type === 'Artikel') {
                    this.ifPresentGetAndSetLeden(UUID)
                        .then(() => this.setState({ dataLoaded: true }))
                        .catch(err => toast('Er is iets verkeerd gegaan'))
                } else {
                    this.setState({ dataLoaded: true })
                }
            })
            .catch(err => toast('Er is iets verkeerd gegaan'))
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.match.params.objectUUID !==
            this.props.match.params.objectUUID
        ) {
            this.setState(
                {
                    loadingNewObject: true,
                },
                () => {
                    const UUID = this.props.match.params.objectUUID

                    Promise.all([
                        this.IfPresentGetAndSetUrlParams(),
                        this.getAndSetVerordeningsObject(UUID),
                    ])
                        .then(() => {
                            if (
                                this.state.verordeningsObject.Type === 'Artikel'
                            ) {
                                this.ifPresentGetAndSetLeden(UUID)
                                    .then(() =>
                                        this.setState({
                                            loadingNewObject: false,
                                        })
                                    )
                                    .catch(err =>
                                        toast('Er is iets verkeerd gegaan')
                                    )
                            } else {
                                this.setState({ loadingNewObject: false })
                            }
                        })
                        .catch(err => toast('Er is iets verkeerd gegaan'))
                }
            )
        }
    }

    render() {
        const dataLoaded = this.state.dataLoaded
        const loadingNewObject = this.state.loadingNewObject
        const activeObjectPath = this.state.activeObjectPath

        let hoofdstukNummer = null
        let hoofdstukTitel = null
        let artikel = this.state.verordeningsObject

        let werkingsgebiedBoolean = false
        let werkingsGebiedUUID = null

        // !REFACTOR! Dit zou null mogen zijn
        if (
            dataLoaded &&
            artikel.Werkingsgebied !== '00000000-0000-0000-0000-000000000000' &&
            artikel.Werkingsgebied !== null
        ) {
            werkingsgebiedBoolean = true
            werkingsGebiedUUID = artikel.Werkingsgebied
        }

        console.log('werkingsGebiedUUID')
        console.log(werkingsGebiedUUID)

        let breadcrumb = null

        if (dataLoaded && activeObjectPath) {
            hoofdstukNummer = this.state.lineage.Structuur.Children[
                activeObjectPath[0]
            ].Volgnummer

            hoofdstukTitel = this.state.lineage.Structuur.Children[
                activeObjectPath[0]
            ].Titel

            breadcrumb = this.getBreadcrumb({
                hoofdstukNummer: hoofdstukNummer,
                hoofdstukTitel: hoofdstukTitel,
            })
        }

        return (
            <div
                className="container flex px-6 pb-20 mx-auto"
                id="raadpleeg-detail-container-main"
            >
                <div className="w-1/4">
                    {/* If there is a searchQuery hash in the URl, return this in the ?query= parameter. Substring catches everything after the '#' */}
                    <ButtonBackToPage
                        terugNaar={
                            window.location.hash
                                ? 'zoekresultaten'
                                : 'startpagina'
                        }
                        url={
                            window.location.hash
                                ? `/zoekresultaten${window.location.hash.substr(
                                      1
                                  )}`
                                : '/'
                        }
                    />
                    <VerordeningenDetailSidebar
                        dataLoaded={this.state.dataLoaded}
                        lineage={this.state.lineage}
                    />
                </div>
                {dataLoaded ? (
                    artikel !== null ? (
                        <React.Fragment>
                            {loadingNewObject ? <LoaderContent /> : null}
                            <div
                                id="raadpleeg-detail-container-content text-gray-800"
                                className={`w-3/4 pr-0 md:pr-24 md:pl-8 lg:pr-48 lg:pl-16`}
                            >
                                <div>
                                    <div className="block inline-block w-full mb-8 text-gray-600">
                                        {breadcrumb}
                                    </div>

                                    {/* Artikel Headers */}
                                    <span className="block font-serif text-gray-800 text-l">
                                        Artikel {' ' + artikel.Volgnummer}
                                    </span>
                                    <h1
                                        id="raadpleeg-detail-header-one"
                                        className="mt-2 text-gray-800 heading-serif-2xl"
                                    >
                                        {artikel.Titel}
                                    </h1>

                                    {/* Meta Content */}
                                    <div
                                        className="block mb-8"
                                        id="raadpleeg-detail-container-meta-info"
                                    >
                                        <span className="mr-3 text-sm text-gray-600">
                                            Vigerend sinds{' '}
                                            {format(
                                                new Date(
                                                    artikel.Begin_Geldigheid
                                                ),
                                                'DD-MMMM-YYYY',
                                                {
                                                    locale: nlLocale,
                                                }
                                            )}
                                        </span>
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
                                    <p
                                        className={`text-gray-700 text-sm mb-4 whitespace-pre-line`}
                                    >
                                        {artikel.Inhoud}

                                        {this.state.ledenObjecten
                                            ? this.state.ledenObjecten.map(
                                                  lid => {
                                                      return (
                                                          <span
                                                              key={lid.UUID}
                                                              className="block mb-4 text-sm text-gray-700 whitespace-pre-line"
                                                          >
                                                              {lid.Inhoud}
                                                          </span>
                                                      )
                                                  }
                                              )
                                            : null}
                                    </p>
                                </div>
                                {werkingsgebiedBoolean ? (
                                    <div
                                        className="w-full mt-5"
                                        id="raadpleeg-detail-werkingsgebied"
                                    >
                                        <div className="flex items-center justify-between pb-3 text-gray-800">
                                            <h2 className="block mb-2 font-serif text-lg tracking-wide text-gray-700">
                                                Werkingsgebied
                                            </h2>
                                            <span
                                                className="px-2 text-xs cursor-pointer"
                                                onClick={
                                                    this
                                                        .toggleFullscreenLeafletViewer
                                                }
                                            >
                                                Bekijk in het
                                                {this.state
                                                    .fullscreenLeafletViewer
                                                    ? ' klein'
                                                    : ' groot'}
                                                <FontAwesomeIcon
                                                    className="ml-2 text-gray-700"
                                                    icon={
                                                        this.state
                                                            .fullscreenLeafletViewer
                                                            ? faCompressArrowsAlt
                                                            : faExpandArrowsAlt
                                                    }
                                                />
                                            </span>
                                        </div>

                                        <div
                                            className="overflow-hidden rounded-lg"
                                            id={`full-screen-leaflet-container-${this.state.fullscreenLeafletViewer}`}
                                        >
                                            <LeafletTinyViewer
                                                gebiedType="Werkingsgebieden"
                                                gebiedUUID={werkingsGebiedUUID}
                                                fullscreen={
                                                    this.state
                                                        .fullscreenLeafletViewer
                                                }
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </React.Fragment>
                    ) : (
                        <span className="inline-block w-3/4 italic text-gray-700">
                            Selecteer een artikel
                        </span>
                    )
                ) : (
                    <LoaderContent />
                )}
            </div>
        )
    }
}

export default withRouter(RaadpleegVerordeningsArtikelDetail)
