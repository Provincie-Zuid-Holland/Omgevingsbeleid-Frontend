import React from "react"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

// Import Axios instance to connect with the API
import axios from "../../API/axios"

import LoaderContent from "../../components/LoaderContent"
import RelatiesKoppelingen from "../../components/RelatiesKoppelingen"
import Container from "../../components/Container"
import Footer from "../../components/Footer"

import RaadpleegObjectDetailHead from "./RaadpleegObjectDetailHead"
import RaadpleegObjectDetailSidebar from "./RaadpleegObjectDetailSidebar"
import RaadpleegObjectDetailMain from "./RaadpleegObjectDetailMain"
import TableOfContents from "./TableOfContents"

import { prepareRevisions } from "../../utils/prepareRevisions"
import handleError from "../../utils/handleError"

/**
 * A detail page for policy objects.
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

export default RaadpleegObjectDetail
