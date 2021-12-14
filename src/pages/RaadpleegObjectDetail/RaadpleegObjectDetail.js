import React from "react"
import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

// Import Axios instance to connect with the API
import axios from "../../API/axios"

// Import Components
import LoaderContent from "../../components/LoaderContent"

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
import BackButton from "../../components/BackButton"
import MetaInfo from "./MetaInfo"
import RevisieListItem from "./RevisieListItem"
import TableOfContents from "./TableOfContents"

import RelatiesKoppelingen from "../../components/RelatiesKoppelingen"
import Container from "../../components/Container"
import Heading from "../../components/Heading"
import Text from "../../components/Text"
import PopUpRevisionContainer from "../../components/PopUpRevisionContainer"
import Footer from "../../components/Footer"

import { prepareRevisions } from "../../utils/prepareRevisions"
import getVigerendText from "../../utils/getVigerendText"
import handleError from "../../utils/handleError"

/**
 * A detail page for a dimensie object.
 * Every object has its own fields. For example the dimension Maatregelen has <ContainerViewFieldsMaatregel />)
 * @param {object} dataModel - Contains the dimensieConstants of the object (e.g. titleSingular)
 */
const RaadpleegObjectDetail = ({ dataModel }) => {
    let { id } = useParams()

    const [dataObject, setDataObject] = React.useState(null) // The object we want to display
    const [lineageID, setLineageID] = React.useState(null) // Used to get the whole history of the object

    // Contains the history of an object (all the edits)
    const [revisionObjects, setRevisionObjects] = React.useState(null)

    // Boolean if data is loaded
    const [dataLoaded, setDataLoaded] = React.useState(false)

    const apiEndpointBase = dataModel.API_ENDPOINT
    const titleSingular = dataModel.TITLE_SINGULAR
    const titleSingularPrefix = dataModel.TITLE_SINGULAR_PREFIX

    /** Scroll to top */
    React.useEffect(() => {
        if (!dataLoaded) return
        window.scrollTo(0, 0)
    }, [dataLoaded])

    /** Initialize data */
    React.useEffect(() => {
        if (id === dataObject?.UUID) return

        const getVersionOfObject = () =>
            axios
                .get(`version/${apiEndpointBase}/${id}`)
                .then((res) => res.data)
                .catch((err) => {
                    handleError(err)
                })

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
    }, [apiEndpointBase, id, lineageID, dataObject])

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

    if (!dataLoaded) return <LoaderContent />

    return (
        <React.Fragment>
            <RaadpleegObjectDetailHead
                titleSingular={titleSingular}
                dataObject={dataObject}
            />
            <Container id="raadpleeg-detail-container-main" className="mb-32">
                <RaadpleegObjectDetailSidebar
                    titleSingular={titleSingular}
                    revisionObjects={revisionObjects}
                    dataObject={dataObject}
                />
                <RaadpleegObjectDetailMain
                    dataLoaded={dataLoaded}
                    dataObject={dataObject}
                    titleSingular={titleSingular}
                    revisionObjects={revisionObjects}
                />
                <TableOfContents />
            </Container>
            {dataLoaded ? (
                <RelatiesKoppelingen
                    titleSingular={titleSingular}
                    titleSingularPrefix={titleSingularPrefix}
                    dataObject={dataObject}
                />
            ) : null}
            <Footer />
        </React.Fragment>
    )
}

const RaadpleegObjectDetailMain = ({
    dataLoaded,
    dataObject,
    titleSingular,
    revisionObjects,
}) => {
    let { id } = useParams()

    // Boolean to toggle the large view
    const [fullscreenLeafletViewer, setFullscreenLeafletViewer] =
        React.useState(false)

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

    return (
        <main className="col-span-6 lg:mt-8 lg:col-span-4">
            <div>
                <Heading
                    level="3"
                    className="font-bold"
                    color="text-pzh-blue-dark"
                >
                    {titleSingular}
                </Heading>
                <Heading level="1" color="text-pzh-blue" className="mt-4">
                    {dataObject ? dataObject.Titel : null}
                </Heading>
            </div>

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
                    <ContainerViewFieldsBeleidskeuze crudObject={dataObject} />
                ) : titleSingular === "Beleidsregel" ? (
                    <ContainerViewFieldsBeleidsregel crudObject={dataObject} />
                ) : titleSingular === "Beleidsprestatie" ? (
                    <ContainerViewFieldsBeleidsprestatie
                        crudObject={dataObject}
                    />
                ) : titleSingular === "Maatregel" ? (
                    <ContainerViewFieldsMaatregel crudObject={dataObject} />
                ) : titleSingular === "Beleidsdoel" ? (
                    <ContainerViewFieldsBeleidsdoelen crudObject={dataObject} />
                ) : titleSingular === "Ambitie" ? (
                    <ContainerViewFieldsAmbitie crudObject={dataObject} />
                ) : titleSingular === "Belang" ? (
                    <ContainerViewFieldsBelang crudObject={dataObject} />
                ) : titleSingular === "Thema" ? (
                    <ContainerViewFieldsThema crudObject={dataObject} />
                ) : null}
            </div>

            {hasWerkingsGebied && dataLoaded ? (
                <Werkingsgebied
                    fullscreenLeafletViewer={fullscreenLeafletViewer}
                    setFullscreenLeafletViewer={setFullscreenLeafletViewer}
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
        </main>
    )
}

const RaadpleegObjectDetailSidebar = ({
    titleSingular,
    dataObject,
    revisionObjects,
}) => {
    let { id } = useParams()
    const vigerendText = getVigerendText({ dataObject, prefix: true })

    return (
        <aside
            id="raadpleeg-detail-container-content"
            className="col-span-6 pt-4 lg:col-span-1 lg:pt-8"
        >
            <BackButton />
            <div>
                <Text
                    type="span"
                    className="block font-bold"
                    color="text-pzh-blue-dark"
                >
                    Type
                </Text>
                <Text type="span" color="text-pzh-blue-dark" className="block">
                    {titleSingular}
                </Text>
            </div>
            <div className="mt-4">
                <Text
                    type="span"
                    className="block font-bold"
                    color="text-pzh-blue-dark"
                >
                    Status
                </Text>
                <Text type="span" color="text-pzh-blue-dark" className="block">
                    {vigerendText}
                </Text>
            </div>
            {revisionObjects?.length > 0 ? (
                <div className="mt-4">
                    <Text
                        type="span"
                        className="block font-bold"
                        color="text-pzh-blue-dark"
                    >
                        Revisies
                    </Text>
                    <PopUpRevisionContainer
                        dataObject={dataObject}
                        titleSingular={titleSingular}
                        revisionObjects={revisionObjects}
                    >
                        {revisionObjects.map((item, index) => (
                            <RevisieListItem
                                currentUUID={id}
                                item={item}
                                key={item.UUID}
                            />
                        ))}
                    </PopUpRevisionContainer>
                </div>
            ) : null}
        </aside>
    )
}

const RaadpleegObjectDetailHead = ({ dataObject, titleSingular }) => {
    const getTitle = () => {
        if (!dataObject) return ""
        return `${dataObject.Titel} (${titleSingular}) - Omgevingsbeleid Provincie Zuid-Holland`
    }

    return (
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
    )
}

export default RaadpleegObjectDetail
