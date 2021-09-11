import React from "react"

import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import { useParams, useHistory } from "react-router-dom"
import { Transition } from "@headlessui/react"

// Import Axios instance to connect with the API
import axios from "../../API/axios"

// Import Components
import LoaderContent from "./../../components/LoaderContent"

// Import view containers
import ContainerViewFieldsBeleidsprestatie from "./ContainerFields/ContainerViewFieldsBeleidsprestatie"
import ContainerViewFieldsBeleidsdoelen from "./ContainerFields/ContainerViewFieldsBeleidsdoelen"
import ContainerViewFieldsBeleidskeuze from "./ContainerFields/ContainerViewFieldsBeleidskeuze"
import ContainerViewFieldsBeleidsregel from "./ContainerFields/ContainerViewFieldsBeleidsregel"
import ContainerViewFieldsMaatregel from "./ContainerFields/ContainerViewFieldsMaatregel"
import ContainerViewFieldsAmbitie from "./ContainerFields/ContainerViewFieldsAmbitie"
import ContainerViewFieldsBelang from "./ContainerFields/ContainerViewFieldsBelang"
import ContainerViewFieldsThema from "./ContainerFields/ContainerViewFieldsThema"

import ViewFieldGebiedDuiding from "./ViewFieldGebiedDuiding"
import Werkingsgebied from "./Werkingsgebied"
import BackButton from "./BackButton"
import MetaInfo from "./MetaInfo"
import Heading from "./Heading"

import RelatiesKoppelingen from "../../components/RelatiesKoppelingen"

import { prepareRevisions } from "../../utils/prepareRevisions"

/**
 * A detail page for a dimensie object.
 * Every object has its own fields. For example the dimension Maatregelen has <ContainerViewFieldsMaatregel />)
 * @param {object} dataModel - Contains the dimensieConstants of the object (e.g. titleSingular)
 */
const RaadpleegUniversalObjectDetail = ({ dataModel }) => {
    let { id } = useParams()
    let history = useHistory()

    const [dataObject, setDataObject] = React.useState(null) // The object we want to display
    const [lineageID, setLineageID] = React.useState(null) // Used to get the whole history of the object

    // Contains the history of an object (all the edits)
    const [revisionObjects, setRevisionObjects] = React.useState(null)

    // Boolean if data is loaded
    const [dataLoaded, setDataLoaded] = React.useState(false)

    // Boolean to toggle the large view
    const [
        fullscreenLeafletViewer,
        setFullscreenLeafletViewer,
    ] = React.useState(false)

    const apiEndpointBase = dataModel.API_ENDPOINT
    const titleSingular = dataModel.TITLE_SINGULAR
    const titleSingularPrefix = dataModel.TITLE_SINGULAR_PREFIX
    const apiEndpoint = `version/${apiEndpointBase}/${id}`

    React.useEffect(() => {
        if (!dataLoaded) return
        window.scrollTo(0, 0)
    }, [dataLoaded])

    const handleError = React.useCallback(
        (err) => {
            if (err.response === undefined) {
                console.error(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                return
            } else if (err.response.status === 404) {
                history.push(`/`)
                toast(`${titleSingular} kon niet gevonden worden`)
            } else if (err.response.status === 422) {
                history.push(`/login`)
                toast(
                    `U moet voor nu nog inloggen om deze pagina te kunnen bekijken`
                )
            } else {
                console.error(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            }
        },
        [titleSingular, history]
    )

    const getVersionOfObject = React.useCallback(
        () =>
            axios
                .get(apiEndpoint)
                .then((res) => res.data)
                .catch((err) => {
                    handleError(err)
                }),
        [apiEndpoint, handleError]
    )

    // Initialize useEffect
    React.useEffect(() => {
        setDataLoaded(false)
        getVersionOfObject()
            .then((data) => {
                setDataObject(data)
                return data.ID
            })
            .then((newLineageID) => {
                if (newLineageID === lineageID) {
                    // User is on the same lineageID
                    setDataLoaded(true)
                } else {
                    // The user navigated to a different lineageID
                    setLineageID(newLineageID)
                }
            })
    }, [getVersionOfObject, lineageID])

    const getAndSetRevisionObjects = React.useCallback(() => {
        axios
            .get(`${apiEndpointBase}/${lineageID}`)
            .then((res) => {
                const preppedRevisions = prepareRevisions(res.data)
                setRevisionObjects(preppedRevisions)
                setDataLoaded(true)
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [lineageID, apiEndpointBase])

    // useEffect triggered when there is a new lineageID set
    React.useEffect(() => {
        if (!lineageID && lineageID !== 0) return

        // We only want to show the revisions on the type of Beleidskeuze
        if (titleSingular !== "Beleidskeuze") {
            setDataLoaded(true)
            return
        }

        getAndSetRevisionObjects()
    }, [getAndSetRevisionObjects, lineageID, titleSingular])

    // Returns boolean
    // There are two objects with werkingsgebieden:
    // - Maatregelen
    // - Beleidskeuzes
    const checkIfObjectHasWerkingsgebied = () => {
        if (!dataLoaded || !dataObject) return false

        // Check if there is a werkingsgebied
        if (
            dataObject.Gebied ||
            (dataObject.Werkingsgebieden && dataObject.Werkingsgebieden[0])
        ) {
            return true
        } else {
            return false
        }
    }

    const getWerkingsgbiedUUID = (hasWerkingsGebied) => {
        if (!hasWerkingsGebied) return null

        if (dataObject.Gebied) {
            // Object is a maatregel, which contains the UUID in a string value
            return dataObject.Gebied.UUID
        } else if (
            dataObject.Werkingsgebieden &&
            dataObject.Werkingsgebieden[0]
        ) {
            // Object is a beleidskeuze/beleidskeuze, which holds the werkingsgebieden in an array.
            // We always need the first value in the array
            return dataObject.Werkingsgebieden[0].Object.UUID
        }
    }

    const hasWerkingsGebied = checkIfObjectHasWerkingsgebied()
    const werkingsGebiedUUID = getWerkingsgbiedUUID(hasWerkingsGebied)

    const getTitle = () => {
        if (!dataLoaded) return ""

        return `${
            dataObject ? dataObject.Titel : null
        } (${titleSingular}) - Omgevingsbeleid Provincie Zuid-Holland`
    }

    return (
        <React.Fragment>
            <div
                className="container flex w-full px-6 pb-16 mx-auto mt-8 md:max-w-4xl"
                id="raadpleeg-detail-container-main"
            >
                <Helmet>
                    <title>{getTitle()}</title>
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
                {!dataLoaded ? <LoaderContent /> : null}
                <Transition
                    show={dataLoaded}
                    enter="transition ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="w-full"
                >
                    <div
                        id="raadpleeg-detail-container-content"
                        className={`w-full`}
                    >
                        <div className="container absolute inset-x-0 hidden w-full mx-auto xl:flex">
                            <BackButton />
                        </div>
                        <div className="block xl:hidden">
                            <BackButton />
                        </div>

                        <Heading
                            type={titleSingular}
                            titel={dataObject ? dataObject.Titel : null}
                        />

                        {/* Meta Content */}
                        <MetaInfo
                            titleSingular={titleSingular}
                            dataLoaded={dataLoaded}
                            revisionObjects={revisionObjects}
                            dataObject={dataObject}
                            currentUUID={id}
                        />

                        {/* These contain the fields that need to be displayed for the different objects */}
                        <div
                            className={`mt-8 ${
                                titleSingular === "Beleidskeuze" ? "" : "pb-20"
                            }`}
                            id="raadpleeg-detail-container-main"
                        >
                            {titleSingular === "Beleidskeuze" ? (
                                <ContainerViewFieldsBeleidskeuze
                                    crudObject={dataObject}
                                />
                            ) : titleSingular === "Beleidsregel" ? (
                                <ContainerViewFieldsBeleidsregel
                                    crudObject={dataObject}
                                />
                            ) : titleSingular === "Beleidsprestatie" ? (
                                <ContainerViewFieldsBeleidsprestatie
                                    crudObject={dataObject}
                                />
                            ) : titleSingular === "Maatregel" ? (
                                <ContainerViewFieldsMaatregel
                                    crudObject={dataObject}
                                />
                            ) : titleSingular === "Beleidsdoel" ? (
                                <ContainerViewFieldsBeleidsdoelen
                                    crudObject={dataObject}
                                />
                            ) : titleSingular === "Ambitie" ? (
                                <ContainerViewFieldsAmbitie
                                    crudObject={dataObject}
                                />
                            ) : titleSingular === "Belang" ? (
                                <ContainerViewFieldsBelang
                                    crudObject={dataObject}
                                />
                            ) : titleSingular === "Thema" ? (
                                <ContainerViewFieldsThema
                                    crudObject={dataObject}
                                />
                            ) : null}
                        </div>

                        {hasWerkingsGebied && dataLoaded ? (
                            <Werkingsgebied
                                fullscreenLeafletViewer={
                                    fullscreenLeafletViewer
                                }
                                setFullscreenLeafletViewer={
                                    setFullscreenLeafletViewer
                                }
                                werkingsGebiedUUID={werkingsGebiedUUID}
                            />
                        ) : null}
                        {titleSingular === "Maatregel" &&
                        dataLoaded &&
                        dataObject["Gebied_Duiding"] &&
                        dataObject["Gebied"] ? (
                            <ViewFieldGebiedDuiding
                                gebiedDuiding={dataObject["Gebied_Duiding"]}
                            />
                        ) : null}
                    </div>
                </Transition>
            </div>
            {dataLoaded ? (
                <RelatiesKoppelingen
                    titleSingular={titleSingular}
                    titleSingularPrefix={titleSingularPrefix}
                    dataObject={dataObject}
                />
            ) : null}
        </React.Fragment>
    )
}

export default RaadpleegUniversalObjectDetail
