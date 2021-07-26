import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import { format } from "date-fns"
import nlLocale from "date-fns/locale/nl"
import queryString from "query-string"
import {
    faAngleRight,
    faPrint,
    faCompressArrowsAlt,
    faExpandArrowsAlt,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import LoaderContent from "./../../components/LoaderContent"
import { toast } from "react-toastify"
import { Transition } from "@headlessui/react"

// Import Axios instance to connect with the API
import axios from "../../API/axios"

// Import Components
import ButtonBackToPage from "./../../components/ButtonBackToPage"
import VerordeningenDetailSidebar from "./VerordeningenDetailSidebar"
import LeafletTinyViewer from "./../../components/LeafletTinyViewer"
import RelatiesKoppelingen from "../../components/RelatiesKoppelingen"

function parseIntOrSetToNull(item) {
    if (item === "null") {
        return null
    } else {
        return parseInt(item)
    }
}

function getQueryStringValues(urlParams) {
    const queryStringValues = queryString.parse(urlParams)
    let hoofdstukIndex = parseIntOrSetToNull(queryStringValues.hoofdstuk)
    let nest_1 = parseIntOrSetToNull(queryStringValues.nest_1)
    let nest_2 = parseIntOrSetToNull(queryStringValues.nest_2)
    let nest_3 = parseIntOrSetToNull(queryStringValues.nest_3)
    return [hoofdstukIndex, nest_1, nest_2, nest_3]
}

// REFACTOR for readability

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
        return axios.get(`/verordeningstructuur/${ID}`).then((res) => {
            // Get latest lineage
            const lineage = res.data[res.data.length - 1]
            // this.populateFieldsAndSetState(lineage)
            this.setState({
                lineage: lineage,
            })
        })
    }

    getAndSetVerordeningsObject(UUID) {
        return axios.get(`/version/verordeningen/${UUID}`).then((res) => {
            const verordeningsObject = res.data
            this.setState({
                verordeningsObject: verordeningsObject,
            })
        })
    }

    getAndSetLidObject(UUID) {
        return axios.get(`/version/verordeningen/${UUID}`).then((res) => {
            const lidObject = res.data
            return lidObject
        })
    }

    // Function to traverse to the object in the lineage
    // The traversing is done based on the nested parameters from the URL
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
            verordeningsObjectInLineage &&
            verordeningsObjectInLineage.Children &&
            verordeningsObjectInLineage.Children.length > 0
        ) {
            return Promise.all(
                verordeningsObjectInLineage.Children.map((child) =>
                    this.getAndSetLidObject(child.UUID)
                )
            ).then((ledenObjecten) =>
                this.setState({
                    ledenObjecten: ledenObjecten,
                })
            )
        } else {
            this.setState({
                ledenObjecten: null,
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

                const activeObjectPath = [hoofdstukIndex, nest1, nest2, nest3]

                // Fallback for when an item couldn't be found in the vigerende structure
                if (activeObjectPath[0] === null) {
                    this.props.history.push("/")
                    toast(
                        `Dit onderdeel van de verordening kon niet gevonden worden in de vigerende structuur`
                    )
                }

                this.setState(
                    {
                        activeObjectPath: activeObjectPath,
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
                if (this.state.verordeningsObject.Type === "Artikel") {
                    this.ifPresentGetAndSetLeden(UUID)
                        .then(() => {
                            this.setState({ dataLoaded: true }, () =>
                                window.setTimeout(() => {
                                    window.scrollTo(0, 0)
                                }, 1)
                            )
                        })
                        .catch((err) => {
                            console.log(err)
                            toast(process.env.REACT_APP_ERROR_MSG)
                        })
                } else {
                    this.setState({ dataLoaded: true }, () =>
                        window.setTimeout(() => {
                            window.scrollTo(0, 0)
                        }, 1)
                    )
                }
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    componentDidUpdate(prevProps) {
        window.setTimeout(() => {
            window.scrollTo(0, 0)
        }, 1)

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
                                this.state.verordeningsObject.Type === "Artikel"
                            ) {
                                this.ifPresentGetAndSetLeden(UUID)
                                    .then(() => {
                                        this.setState({
                                            loadingNewObject: false,
                                        })
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                        toast(process.env.REACT_APP_ERROR_MSG)
                                    })
                            } else {
                                this.setState({ loadingNewObject: false })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                            toast(process.env.REACT_APP_ERROR_MSG)
                        })
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

        if (
            dataLoaded &&
            artikel.Gebied !== "00000000-0000-0000-0000-000000000000" &&
            artikel.Gebied !== null
        ) {
            werkingsgebiedBoolean = true
            werkingsGebiedUUID = artikel?.Gebied?.UUID
        }

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

        const show = (dataLoaded && !loadingNewObject && !!artikel) === true

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
                                ? "zoekresultaten"
                                : "startpagina"
                        }
                        url={
                            window.location.hash
                                ? `/zoekresultaten${window.location.hash.substr(
                                      1
                                  )}`
                                : "/"
                        }
                    />
                    <VerordeningenDetailSidebar
                        dataLoaded={this.state.dataLoaded}
                        lineage={this.state.lineage}
                    />
                </div>
                <Transition
                    show={show}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="w-3/4 pr-0 md:pl-8 lg:pl-16"
                >
                    <div
                        id="raadpleeg-detail-container-content text-gray-800"
                        // className={`w-3/4 pr-0 md:pl-8 lg:pl-16`}
                    >
                        <div>
                            <div className="block inline-block w-full mb-8 text-gray-600">
                                {breadcrumb}
                            </div>

                            {/* Artikel Headers */}
                            <span className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue-dark">
                                Artikel {" " + artikel?.Volgnummer}
                            </span>
                            <h1
                                id="raadpleeg-detail-header-one"
                                className="mt-1 text-4xl font-bold text-pzh-blue "
                            >
                                {artikel?.Titel}
                            </h1>

                            {/* Meta Content */}
                            <div
                                className="block mb-8"
                                id="raadpleeg-detail-container-meta-info"
                            >
                                <span className="mr-3 text-sm text-gray-600">
                                    Vigerend sinds{" "}
                                    {artikel?.Begin_Geldigheid
                                        ? format(
                                              new Date(
                                                  artikel?.Begin_Geldigheid
                                              ),
                                              "dd-MM-yyyy",
                                              {
                                                  locale: nlLocale,
                                              }
                                          )
                                        : null}
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
                                className={`leading-7 break-words w-full whitespace-pre-line `}
                            >
                                {artikel?.Inhoud}
                                {this.state.ledenObjecten
                                    ? this.state.ledenObjecten.map((lid) => {
                                          return (
                                              <span
                                                  key={lid?.UUID}
                                                  className="block mb-4 text-sm text-gray-700 whitespace-pre-line"
                                              >
                                                  {lid?.Inhoud}
                                              </span>
                                          )
                                      })
                                    : null}
                            </p>
                        </div>
                        {werkingsgebiedBoolean ? (
                            <div
                                className="w-full mt-5"
                                id="raadpleeg-detail-werkingsgebied"
                            >
                                <div className="flex items-center justify-between pb-3 text-gray-800">
                                    <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                                        Werkingsgebied
                                    </h2>
                                    <span
                                        className="px-2 text-xs cursor-pointer"
                                        onClick={
                                            this.toggleFullscreenLeafletViewer
                                        }
                                    >
                                        Bekijk in het
                                        {this.state.fullscreenLeafletViewer
                                            ? " klein"
                                            : " groot"}
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
                                            this.state.fullscreenLeafletViewer
                                        }
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className="mt-16">
                            <RelatiesKoppelingen
                                titleSingular={"Artikel"}
                                titleSingularPrefix={"het"}
                                dataObject={artikel}
                            />
                        </div>
                    </div>
                </Transition>

                {dataLoaded && !loadingNewObject && artikel ? null : (
                    <LoaderContent />
                )}
            </div>
        )
    }
}

export default withRouter(RaadpleegVerordeningsArtikelDetail)
