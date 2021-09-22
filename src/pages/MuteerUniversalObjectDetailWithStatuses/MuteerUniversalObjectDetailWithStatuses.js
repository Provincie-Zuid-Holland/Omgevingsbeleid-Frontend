import React from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import { faPlus } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Helmet } from "react-helmet"
import { toast } from "react-toastify"

// Import Components
import LoaderContent from "./../../components/LoaderContent"
import ButtonBackToPage from "../../components/ButtonBackToPage"
import EigenaarsDriehoek from "../../components/EigenaarsDriehoek"
import ContainerMain from "../../components/ContainerMain"

import ContainerDetail from "./ContainerDetail"
import StatusHistory from "./StatusHistory"

// Import Axios instance to connect with the API
import axios from "../../API/axios"

/**
 * A detail page of a dimension object with a status
 * This differs from the normal MuteerUniversalObjectDetail page,
 * as it can have a 'vigerend' object and a checked out (anything other status then vigerend) status.
 * It also contains a visual flow of the history of statusses, a way to change the status of objects and
 * the functionality to change an object of vigerend without checking it out.
 * @param {Object} dimensieConstants - Contains the variables of the dimension
 */
const MuteerUniversalObjectDetailWithStatuses = ({ dimensieConstants }) => {
    const location = useLocation()
    const { single, version } = useParams()

    const [pageType, setPageType] = React.useState(
        version ? "version" : "detail"
    )
    const [dataObject, setDataObject] = React.useState(null)
    const [dimensionHistory, setDimensionHistory] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const [isAConceptInProgress, setIsAConceptInProgress] = React.useState(null)
    const [vigerendeDimensieObject, setVigerendeDimensieObject] =
        React.useState(null)

    /**
     * As each change is saved in the history of the dimension, its possible to have multiple object after another with the same status
     * In this function we filter out these duplicates.
     * We go from [{status: 'Ontwerp GS Concept', id: 1}, {status: 'Ontwerp GS Concept', id: 2}, {status: 'Ontwerp GS', id: 3}]
     * To [{status: 'Ontwerp GS Concept', id: 2}, {status: 'Ontwerp GS', id: 3}],
     * @param {array} dimensionHistory - Contains the original history
     * @returns {array} the dimension history with duplicate statusses filtered out
     * */
    const generateDimensionHistory = (dimensionHistory) => {
        // We reverse the array so that we have the objects in ascending order of creation
        // We need to reverse it in order to filter based on the object statusses as explained above
        const filteredDimensionHistory = dimensionHistory
            .reverse()
            .filter((dimensieObject, index) => {
                const isLastItem = index + 1 === dimensionHistory.length
                if (
                    !isLastItem &&
                    dimensieObject.Status !== dimensionHistory[index + 1].Status
                ) {
                    // If item after does item has the same status
                    return true
                } else if (index === 0 && isLastItem) {
                    // If the dimensionHistory length is 1
                    return true
                } else if (isLastItem) {
                    // If it is the last (and thus the latest) item in the array
                    return true
                } else {
                    // Else we filter out the element
                    return false
                }
            })
            .reverse() // We then reverse it back, so that we have an descending order of creation

        return filteredDimensionHistory
    }

    /**
     * Gets the data from the API
     */
    const getAndSetDimensieDataFromApi = React.useCallback(() => {
        const getApiEndpoint = () => {
            const apiEndpoint = dimensieConstants.API_ENDPOINT
            if (pageType === "detail") {
                return `${apiEndpoint}/${single}`
            } else if (pageType === "version") {
                return `/version/${apiEndpoint}/${version}`
            }
        }

        const apiEndpoint = getApiEndpoint()

        axios
            .get(apiEndpoint)
            .then((res) => {
                let dataObjectFromAPI = null

                if (pageType === "detail") {
                    dataObjectFromAPI = res.data[0]
                } else if (pageType === "version") {
                    dataObjectFromAPI = res.data
                }
                setDataObject(dataObjectFromAPI)

                const generatedDimensionHistory = generateDimensionHistory(
                    res.data
                )
                setDimensionHistory(generatedDimensionHistory)
                setIsLoading(false)
            })
            .catch((err) => {
                toast(process.env.REACT_APP_ERROR_MSG)
                console.log(err)
            })
    }, [dimensieConstants, single, pageType, version])

    /**
     * Patch object with API and push the new object into the local state
     */
    const patchStatus = (crudObject, newStatus) => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        const objectID = crudObject.ID

        axios
            .patch(
                `${apiEndpoint}/${objectID}`,
                JSON.stringify({
                    Status: newStatus,
                })
            )
            .then((res) => {
                setDimensionHistory([res.data, ...dimensionHistory])
                toast(`Status succesvol gewijzigd naar ${newStatus}`)
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    /**
     * @returns {boolean} If there is a checked out object in the lineage, return true
     */
    const checkForConceptInProgress = React.useCallback(
        (vigerendeDimensieObjectIndex) => {
            let isAConceptInProgress = false
            if (!dimensionHistory) return isAConceptInProgress

            const isVigerendObject =
                dimensionHistory.findIndex((e) => e.Status === "Vigerend") !==
                -1

            const isConceptAfterVigerendObject =
                isVigerendObject && vigerendeDimensieObjectIndex !== 0

            const isVigerendObjectInLineageOfLengthOne =
                isVigerendObject &&
                vigerendeDimensieObjectIndex === dimensionHistory.length - 1

            if (
                (isConceptAfterVigerendObject &&
                    !isVigerendObjectInLineageOfLengthOne) ||
                !isVigerendObject
            ) {
                isAConceptInProgress = true
            }

            return isAConceptInProgress
        },
        [dimensionHistory]
    )

    /**
     * @returns {array} Containing the object and the index
     */
    const getVigerendDimensionObjectAndIndex = React.useCallback(() => {
        if (!dimensionHistory) return [null, null]

        const object = dimensionHistory.find((e) => e.Status === "Vigerend")
        const index = dimensionHistory.findIndex((e) => e.Status === "Vigerend")

        if (index === -1) {
            return [null, null]
        } else {
            return [object, index]
        }
    }, [dimensionHistory])

    /** Effect when user switch from a version to a detail page and vice versa. Resets and initializes state. Will also fire on mount */
    React.useEffect(() => {
        if (pageType === version) return
        setPageType(version ? "version" : "detail")
        setDataObject(null)
        setIsLoading(true)
        getAndSetDimensieDataFromApi()
    }, [version, getAndSetDimensieDataFromApi, pageType])

    /** Update variables after dimensionHistory changes */
    React.useEffect(() => {
        const [object, index] = getVigerendDimensionObjectAndIndex()
        const conceptInProgress = checkForConceptInProgress(index)

        setIsAConceptInProgress(conceptInProgress)
        setVigerendeDimensieObject(object)
    }, [
        dimensionHistory,
        checkForConceptInProgress,
        getVigerendDimensionObjectAndIndex,
    ])

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

    return (
        <ContainerMain>
            <Helmet>
                <title>
                    Omgevingsbeleid{" "}
                    {dataObject && dataObject.Titel
                        ? " - " + dataObject.Titel
                        : ""}
                </title>
            </Helmet>

            {/* Dimensie Container */}
            <div className="inline-block w-full">
                <GenerateBackToButton
                    hash={location.hash}
                    dataObject={dataObject}
                    overzichtSlug={overzichtSlug}
                    pageType={pageType}
                />

                {!isLoading ? (
                    <div className="flex pb-24">
                        <div
                            className={`${
                                overzichtSlug !== "beleidskeuzes" ||
                                overzichtSlug !== "maatregelen"
                                    ? "w-full"
                                    : "w-9/12"
                            } pr-8`}
                        >
                            {/* Button to make a new design */}
                            {pageType === "detail" && !isAConceptInProgress ? (
                                <div className="h-10 mt-5 ">
                                    <Link
                                        className="flex items-center w-1/2 mt-5"
                                        to={`/muteer/${overzichtSlug}/edit/${single}?modus=ontwerp_maken${
                                            location.hash === "#mijn-beleid"
                                                ? "#mijn-beleid"
                                                : ""
                                        }`}
                                        id={`href-ontwerp-maken`}
                                    >
                                        <span className="relative flex items-center justify-end w-8 h-10 pb-5 mr-2 border-r-2 border-gray-300">
                                            <div className="absolute flex items-center justify-center w-8 h-8 text-center bg-gray-300 rounded-full -right-4">
                                                <FontAwesomeIcon
                                                    className="relative text-gray-600"
                                                    icon={faPlus}
                                                />
                                            </div>
                                        </span>
                                        <span className="inline pl-5 -mt-5 text-sm text-gray-700 cursor-pointer hover:underline">
                                            Ontwerp maken
                                        </span>
                                    </Link>
                                </div>
                            ) : null}
                            {/* Container of the object that has a status of 'vigerend' */}
                            {vigerendeDimensieObject ? (
                                <ContainerDetail
                                    setDimensionHistory={setDimensionHistory}
                                    setDataObject={setDataObject}
                                    dimensionHistory={dimensionHistory}
                                    patchStatus={patchStatus}
                                    dataObject={vigerendeDimensieObject}
                                    pageType={pageType}
                                    overzichtSlug={overzichtSlug}
                                    titleSingular={titleSingular}
                                    isLoading={isLoading}
                                />
                            ) : null}

                            {/* Contains the container detail of the checked out object, and the UI of the flow of statusses */}
                            {!isLoading && pageType === "detail" ? (
                                <StatusHistory
                                    setDimensionHistory={setDimensionHistory}
                                    setDataObject={setDataObject}
                                    patchStatus={patchStatus}
                                    pageType={pageType}
                                    overzichtSlug={overzichtSlug}
                                    titleSingular={titleSingular}
                                    isLoading={isLoading}
                                    dataObject={dataObject}
                                    dimensionHistory={dimensionHistory}
                                    vigerendeDimensieObject={
                                        vigerendeDimensieObject
                                    }
                                />
                            ) : null}
                        </div>

                        {!isLoading && dataObject ? (
                            <EigenaarsDriehoek
                                dataObject={
                                    vigerendeDimensieObject
                                        ? vigerendeDimensieObject
                                        : dataObject
                                }
                            />
                        ) : null}
                    </div>
                ) : (
                    <LoaderContent />
                )}
            </div>
        </ContainerMain>
    )
}

// Generate Back Button for Detail or Version page
function GenerateBackToButton({ overzichtSlug, pageType, hash, dataObject }) {
    if (pageType === "detail") {
        if (hash === "#mijn-beleid") {
            return (
                <ButtonBackToPage
                    terugNaar={` mijn beleid`}
                    url={`/muteer/mijn-beleid`}
                />
            )
        } else {
            return (
                <ButtonBackToPage
                    terugNaar={` overzicht`}
                    url={`/muteer/${overzichtSlug}`}
                />
            )
        }
    } else if (pageType === "version") {
        const dataObjectID = dataObject.ID
        return (
            <ButtonBackToPage
                terugNaar={`huidige versie`}
                url={`/muteer/${overzichtSlug}/${dataObjectID}`}
            />
        )
    } else {
        return null
    }
}

export default MuteerUniversalObjectDetailWithStatuses
