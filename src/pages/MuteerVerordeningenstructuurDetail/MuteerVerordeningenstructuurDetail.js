import React from 'react'
import { Helmet } from 'react-helmet'
import {
    Link,
    withRouter,
    useParams,
    useHistory,
    useLocation,
} from 'react-router-dom'
import { toast } from 'react-toastify'
import clonedeep from 'lodash.clonedeep'

import {
    faPlus,
    faArrowsAltV,
    faSpinner,
    faAngleLeft,
    faChevronDown,
    faChevronUp,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import VerordeningContext from './VerordeningContext'

// Import Componenents
import ContainerMain from './../../components/ContainerMain'
import LoaderContent from './../../components/LoaderContent'
import Transition from './../../components/Transition'

// Utils
import formatGeldigheidDatesForUI from './../../utils/formatGeldigheidDatesForUI'

// DragAndDrop Components
import DragAndDropFirstLevel from './DragAndDropFirstLevel'
import DragAndDropSecondLevel from './DragAndDropSecondLevel'
import DragAndDropHoofdstukken from './DragAndDropHoofdstukken'
import VerordeningenDetailSidebar from './VerordeningenDetailSidebar'
import AddSectionsSidebar from './AddSectionsSidebar'

// Object Fields for inline editing

import Werkingsgebied from './ContainerCrudFields/Werkingsgebied'
import Artikel from './ContainerCrudFields/Artikel'
// import Leden from './ContainerCrudFields/Leden'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Reorder items in array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

// TODO: I refactored the DragAndDrop components, remove the old components

const MuteerVerordeningenstructuurDetail = () => {
    // This component has two views. The overview of all the chapters (e.g. activeChapter === Null) and a view that shows the activeChapter (e.g. activeChapter === 0). This view is conditional based on the value of activeChapter.
    // This component is quite complex, as it holds the whole structure and provides the user with several ways to edit that structure

    // [dataLoaded] - Contains a Boolean that is true when all API calls are done
    const [dataLoaded, setDataLoaded] = React.useState(false)
    // [patchingInProgress] - Contains a Boolean that is true when we are patching
    const [patchingInProgress, setPatchingInProgress] = React.useState(false)

    // [lineage] - Contains the whole structure of the regulations
    const [lineage, setLineage] = React.useState(null)

    // [lineageCopy] - A copy of the regulation structure. We use this to undo changes when the user is changing the order and cancels them.
    const [lineageCopy, setLineageCopy] = React.useState(null)

    // [users] - Contains the users, which we pass to the component to edit regulation objects
    const [users, setUsers] = React.useState(null)

    // [activeChapter] - The first layer of objects in the lineage are Chapters. This value contains the active chapter OR it contains an Null value, which means there is no chapter active
    const [activeChapter, setActiveChapter] = React.useState(null)

    // [editOrderMode] - Contains a boolean to represent the mode to edit the order of object
    const [editOrderMode, setEditOrderMode] = React.useState(false)

    // [addSectionMode] - Contains a boolean to represent the mode to add new objects
    const [addSectionMode, setAddSectionMode] = React.useState(false)

    // [UUIDBeingEdited] - Contains a UUID of the object that the user is editing. This can be a Chapter, a Group or a Paragraph
    const [UUIDBeingEdited, setUUIDBeingEdited] = React.useState(null)

    // [indexArrayToUUIDBeingEdited] - This contains an array the path to the specific item in the lineage. The first item is always the chapter followed by subsequent levels from there.
    const [
        indexArrayToUUIDBeingEdited,
        setIndexArrayToUUIDBeingEdited,
    ] = React.useState(null)

    // This state value is used to see when we need to Patch the lineage
    // See the useEffect below. We use this useEffect to trigger when a new lineage has set
    const [saveNewLineage, setSaveNewLineage] = React.useState(false)
    React.useEffect(() => {
        if (saveNewLineage) {
            setVerordeningsObjectFromGET({
                type: 'cancel',
            })
            setVerordeningsLedenFromGET({
                type: 'cancel',
            })
            saveNewLineageStructure()
            setVolgnummerBeingEdited(null)
            setIndexArrayToUUIDBeingEdited(null)
            setUUIDBeingEdited(null)
            setSaveNewLineage(false)
        }
    }, [lineage])

    // [volgnummerBeingEdited] - Contains the property 'volgnummer' of the object that is edited. This is displayed in the Meta edit content menu
    const [volgnummerBeingEdited, setVolgnummerBeingEdited] = React.useState(
        null
    )

    // [verordeningsObjectFromGET] - Contains the object we get from the GET request on [UUIDBeingEdited]
    const verordeningsObjectFromGETReducer = (state, action) => {
        const newState = { ...state }
        switch (action.type) {
            case 'initialize':
                return action.initObject
            case 'changeValue':
                newState[action.name] = action.value
                return newState
            case 'changeSelectValue':
                if (action.actionMeta.action === 'select-option') {
                    newState[action.property] = action.e.value
                } else if (action.actionMeta.action === 'clear') {
                    newState[action.property] = null
                }
                return newState
            case 'cancel':
                return null
            default:
                return state
        }
    }

    const [
        verordeningsObjectFromGET,
        setVerordeningsObjectFromGET,
    ] = React.useReducer(verordeningsObjectFromGETReducer, null)

    const [
        verordeningsObjectIsLoading,
        setVerordeningsObjectIsLoading,
    ] = React.useState(false)

    // Loading state for [verordeningsLedenFromGET]
    const [
        verordeningsObjectLedenIsLoading,
        setVerordeningsObjectLedenIsLoading,
    ] = React.useState(false)

    // [verordeningsLedenFromGET] - Contains the leden objects in an array if the [verordeningsObjectFromGET] is an Article and has Children
    const verordeningsLedenFromGETReducer = (state, action) => {
        const newState = clonedeep(state)
        switch (action.type) {
            case 'initialize':
                return action.initObject
            case 'changeValue':
                newState[action.index][action.name] = action.value
                return newState
            case 'cancel':
                return null
            default:
                return state
        }
    }

    const [
        verordeningsLedenFromGET,
        setVerordeningsLedenFromGET,
    ] = React.useReducer(verordeningsLedenFromGETReducer, null)

    React.useEffect(() => {
        console.log(verordeningsLedenFromGET)
        if (
            verordeningsLedenFromGET !== null &&
            verordeningsObjectLedenIsLoading
        ) {
            setVerordeningsObjectLedenIsLoading(false)
        }
    }, [verordeningsLedenFromGET])

    // [verordeningsObjectIsLoading] is true, GET request for [UUIDBeingEdited] to get the whole object, then setInState under [verordeningsObjectFromGET] and set [verordeningsObjectIsLoading] to null
    React.useEffect(() => {
        if (UUIDBeingEdited === null) return

        // Function to get the regulation object based on the UUID (UUIDBeingEdited)
        const getVerordeningsObject = (UUIDBeingEdited) => {
            setVerordeningsObjectIsLoading(true)

            return axios
                .get(`/verordeningen/version/${UUIDBeingEdited}?limit=1`)
                .then((res) => {
                    const initObject = formatGeldigheidDatesForUI(res.data)
                    console.log(initObject)
                    setVerordeningsObjectFromGET({
                        type: 'initialize',
                        initObject: initObject,
                    })

                    // If GET Object is of the type 'Artikel' we check if the article has leden with getLedenOfArticle()
                    // If that is the case we need to get them from the API, so we postpone setting setVerordeningsObjectIsLoading(false)
                    // We will do that after getting the leden
                    if (res.data.Type === 'Artikel') {
                        setVerordeningsObjectLedenIsLoading(true)
                        getLedenOfArticle()
                    } else {
                        setVerordeningsObjectIsLoading(false)
                    }
                })
                .catch((err) => {
                    setVerordeningsObjectIsLoading(false)
                })
        }

        getVerordeningsObject(UUIDBeingEdited)
    }, [UUIDBeingEdited])

    // Function used to get the Leden of an article, when the user edits an article
    const getLedenOfArticle = () => {
        const getChildren = () => {
            const index = indexArrayToUUIDBeingEdited
            let objectInLineage = null
            const depthOfObject = index.length

            switch (depthOfObject) {
                case 1:
                    objectInLineage = lineage.Structuur.Children[index[0]]
                    break
                case 2:
                    objectInLineage =
                        lineage.Structuur.Children[index[0]].Children[index[1]]
                    break
                case 3:
                    objectInLineage =
                        lineage.Structuur.Children[index[0]].Children[index[1]]
                            .Children[index[2]]
                    break
                case 4:
                    objectInLineage =
                        lineage.Structuur.Children[index[0]].Children[index[1]]
                            .Children[index[2]].Children[index[3]]
                    break
                default:
                    break
            }

            return objectInLineage.Children
        }

        const ledenOfArtikel = getChildren()
        const artikelHasNoLeden = !ledenOfArtikel || ledenOfArtikel.length === 0

        if (artikelHasNoLeden) {
            setVerordeningsObjectIsLoading(false)
            return
        }

        // Get an array of axios Promises that return the Leden objects
        const getAllLeden = ledenOfArtikel.map((lid) =>
            axios
                .get(`/verordeningen/version/${lid.UUID}`)
                .then((res) => res.data)
                .catch((err) => console.log(err))
        )

        // After all the promises are resolved we set the state
        Promise.all(getAllLeden)
            .then((ledenFromAPI) => {
                setVerordeningsLedenFromGET({
                    type: 'initialize',
                    initObject: ledenFromAPI,
                })
                setVerordeningsObjectIsLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setVerordeningsObjectIsLoading(false)
            })
    }

    // Get lineageID from URL parameter, used in saveNewLineageStructure()
    const { lineageID } = useParams()
    // Get location, used to get params on mount
    const location = useLocation()
    // Get history, used in handleError()
    const history = useHistory()

    // After first render
    React.useEffect(() => {
        // - GET structuur van verordening lineage - Query: /verordeningstructuur/:ID
        // - Populate elk verordeningsobject obv UUID met de version - Query:
        //     - /verordeningen/version/:UUID

        const searchParams = location.search
        if (searchParams) {
            const activeChapterFromURL = searchParams.slice(
                searchParams.search('=') + 1,
                searchParams.length
            )
            setActiveChapter(activeChapterFromURL)
        }

        if (!lineageID || isNaN(lineageID)) {
            handleError('Deze verordening bestaat niet')
            return
        }

        // Get Lineage
        const getLineage = axios
            .get(`/verordeningstructuur/${lineageID}`)
            .then((res) => {
                // Handle empty res
                if (!res.data || !res.data[0]) {
                    handleError('Er ging iets fout, probeer het later opnieuw')
                    return
                }

                // Get latest lineage and set data in state
                const lineage = res.data[res.data.length - 1]
                setLineage(lineage)
                setLineageCopy(lineage)
            })
            .catch((err) => {
                console.log(err)
                handleError('Er ging iets fout, probeer het later opnieuw')
            })

        const getUsers = axios
            .get('/gebruikers')
            .then((res) => {
                const gebruikers = res.data
                setUsers(gebruikers)
            })
            .catch(() =>
                handleError('Er ging iets fout, probeer het later opnieuw')
            )

        Promise.all([getLineage, getUsers]).then(() => setDataLoaded(true))

        // Eventlistener for closing editing modes with the Escape key
        function closeOnEscape(e) {
            if (e.key === 'Escape') {
                setEditOrderMode(false)
                setAddSectionMode(false)
            }
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [])

    // Reorder sections for all four levels
    const onDragEnd = (result) => {
        // onDragEnd gets passed into the Beautiful Drag n Drop components to reorder
        // The reordering is done based on the Type of the result parameter

        // User didn't changed the order, return
        if (!result.destination) {
            return
        }

        // Get source-, destionation-index, active chapter and clone the current lineage
        const sourceIndex = result.source.index
        const destIndex = result.destination.index
        const currentActiveChapter = activeChapter
        const currentLineage = clonedeep(lineage)

        // Reorder on highest level - Me myself and I
        const reorderBaseLevel = () => {
            // Reorder children
            const reorderedChildren = reorder(
                currentLineage.Structuur.Children,
                sourceIndex,
                destIndex
            )

            // Save new state
            currentLineage.Structuur.Children = reorderedChildren
            setLineage(currentLineage)
        }

        // Reorder on the first level - Papa en Mama reordering
        const reorderFirstLevel = () => {
            // Reorder children
            const reorderedChildren = reorder(
                currentLineage.Structuur.Children[currentActiveChapter]
                    .Children,
                sourceIndex,
                destIndex
            )

            // Save new state
            currentLineage.Structuur.Children[
                currentActiveChapter
            ].Children = reorderedChildren
            setLineage(currentLineage)
        }

        // Second level reordering - The kids had some kids
        const reorderSecondLevel = () => {
            // Here is where it can get tricky. This is the second level of ordering.

            // Create an object container all the Children objects
            // We use this object to access the list of items, using the droppableId (see below) as the key
            const itemSubItemMap = lineage.Structuur.Children[
                currentActiveChapter
            ].Children.reduce((accumulator, child) => {
                accumulator[child.UUID] = child.Children
                return accumulator
            }, {})

            // In the UI we map over the Children array and return Drag 'n Drop component for each child
            // The droppableId is the UUID of the child
            const sourceParentId = result.source.droppableId
            const destParentId = result.destination.droppableId

            // Get Children array of source and destination
            const sourceChildren = itemSubItemMap[sourceParentId]
            const destinationChildren = itemSubItemMap[destParentId]

            // Create a copy of the Children of the activeChapter
            // We use this to map over the array, and replace reordered Children arrays
            let childrenOfActiveChapter = clonedeep(
                lineage.Structuur.Children[currentActiveChapter].Children
            )

            // If the sourceParentId === destParentId, the user reordered the second level item in the same first level parent.
            // In that case we have to reorder this array and replace it in the first level parent.
            // If the sourceParentId !== destParentId, the user reorderd the second level item to a different first level parent.
            // In that case we need to remove the item from the original Child array, and add it to the new Array
            if (sourceParentId === destParentId) {
                // Item is dropped in the same parent

                // Reorder children
                const reorderedChildren = reorder(
                    sourceChildren,
                    sourceIndex,
                    destIndex
                )

                // Create a new array by mapping over the childrenOfActiveChapter
                // If the UUID of the mapped child is equal to the sourceParentId we replace the child.Children with the reorderedChildren
                childrenOfActiveChapter = childrenOfActiveChapter.map(
                    (child) => {
                        // ALS het iten.UUID overeenkomt met de sourceParentID, dan moeten we op dit child de Children property vervangen met de nieuw gesorteerde sub items
                        // Anders returnen we enkel de originele value van child
                        if (child.UUID === sourceParentId) {
                            child.Children = reorderedChildren
                        }
                        return child
                    }
                )

                // Save new state
                currentLineage.Structuur.Children[
                    currentActiveChapter
                ].Children = childrenOfActiveChapter
                setLineage(currentLineage)
            } else {
                // The item is dropped in a different parent

                // Create a copy of sourceChildren
                let copySourceChildren = clonedeep(sourceChildren)
                // Remove the dragged item from copySourceChildren which will be returned into [draggedItem]
                const [draggedItem] = copySourceChildren.splice(sourceIndex, 1)

                // Create a copy of destinationChildren
                let copyDestinationChildren = clonedeep(destinationChildren)
                // Add draggedItem to copyDestinationChildren
                copyDestinationChildren.splice(destIndex, 0, draggedItem)

                // Replace Children of the source parent and the destination parent
                childrenOfActiveChapter = childrenOfActiveChapter.map(
                    (item) => {
                        if (item.UUID === sourceParentId) {
                            item.Children = copySourceChildren
                        } else if (item.UUID === destParentId) {
                            item.Children = copyDestinationChildren
                        }
                        return item
                    }
                )

                // Save new state
                currentLineage.Structuur.Children[
                    currentActiveChapter
                ].Children = childrenOfActiveChapter
                setLineage(currentLineage)
            }
        }

        // Yeey! Third level reordering, the final boss - The kids of the kids had some kids
        const reorderThirdLevel = () => {
            // Get the index of the dragged item
            const sourceIndex = result.source.index
            // Get the index of the the destination
            const destIndex = result.destination.index
            // Get the ID of the source parentEl
            const sourceParentId = result.source.droppableId
            // Get the ID of the destination parentEl
            const destinationParentId = result.destination.droppableId

            // Function to that searches through an array of children and searches for an element that has an UUID of sourceParentId
            // Returns parentIndex and the childIndex
            const findParentElAndIndexes = (children, sourceParentId) => {
                let parentIndex = null
                let childIndex = null

                children.forEach((child, indexOfChild) => {
                    if (child.UUID === sourceParentId) {
                        parentIndex = indexOfChild
                    }
                    child.Children.forEach(
                        (childOfChild, indexOfChildOfChild) => {
                            if (child.UUID === sourceParentId) {
                                parentIndex = indexOfChild
                                childIndex = indexOfChildOfChild
                            }
                        }
                    )
                })

                return [parentIndex, childIndex]
            }

            // Get parent element, parent index and childIndex of the source parent
            const [
                sourceParentIndex,
                sourceChildIndex,
            ] = findParentElAndIndexes(
                currentLineage.Structuur.Children[currentActiveChapter]
                    .Children,
                sourceParentId
            )

            // Get parent element, parent index and childIndex of the destination parent
            const [destParentIndex, destChildIndex] = findParentElAndIndexes(
                currentLineage.Structuur.Children[currentActiveChapter]
                    .Children,
                destinationParentId
            )

            // Array containing the children where the user dragged FROM
            const sourceParentElChildrenArray =
                currentLineage.Structuur.Children[currentActiveChapter]
                    .Children[sourceParentIndex].Children[sourceChildIndex]
                    .Children

            // Array containing the children where the user dragged TO
            const destinationParentElChildrenArray =
                currentLineage.Structuur.Children[currentActiveChapter]
                    .Children[destParentIndex].Children[destChildIndex].Children

            if (destinationParentId === sourceParentId) {
                // Item is dropped in the same parent

                const reorderedChildren = reorder(
                    sourceParentElChildrenArray,
                    sourceIndex,
                    destIndex
                )

                // Assign reordered Children in the currentLineage
                currentLineage.Structuur.Children[
                    currentActiveChapter
                ].Children[sourceParentIndex].Children[
                    sourceChildIndex
                ].Children = reorderedChildren

                // Save new state
                setLineage(currentLineage)
            } else {
                // Item is dropped in a different parent

                // Remove item from source array and return it into draggedItem
                const draggedItem = sourceParentElChildrenArray.splice(
                    sourceIndex,
                    1
                )

                // Add the draggedItem into the destination array
                destinationParentElChildrenArray.splice(
                    destIndex,
                    0,
                    draggedItem[0]
                )

                // Assign reordered Children of the source Array in the currentLineage
                currentLineage.Structuur.Children[
                    currentActiveChapter
                ].Children[sourceParentIndex].Children[
                    sourceChildIndex
                ].Children = sourceParentElChildrenArray

                // Assign reordered Children of the destinitation Array in the currentLineage
                currentLineage.Structuur.Children[
                    currentActiveChapter
                ].Children[destParentIndex].Children[
                    destChildIndex
                ].Children = destinationParentElChildrenArray

                // Save new state
                setLineage(currentLineage)
            }
        }

        // Call reorder function based on the type
        switch (result.type) {
            case 'hoofdstukItem':
                reorderBaseLevel()
                return
            case 'firstLevel':
                reorderFirstLevel()
                return
            case 'secondLevel':
                reorderSecondLevel()
                return
            case 'thirdLevel':
                reorderThirdLevel()
                return
            default:
                break
        }
    }

    // Function to patch a regulation object.
    // This object is represented in State under the verordeningsObjectFromGET state variable
    // This object can be of any type. If the object is an 'Artikel' we check if it has leden, as we have then have to patch them too
    const patchRegulationObject = () => {
        const IDToPatch = verordeningsObjectFromGET.ID

        // Func to strip away the extra properties in order to patch it
        const cleanUpProperties = (object) => {
            // Remove values that are not accepted by the API
            delete object.Begin_Geldigheid
            delete object.Eind_Geldigheid
            delete object.Created_By
            delete object.Created_Date
            delete object.Modified_By
            delete object.Modified_Date
            delete object.UUID
            delete object.ID

            // Remove properties with a value of null
            Object.keys(object).forEach(
                (key) => object[key] === null && delete object[key]
            )

            return object
        }

        // PATCH function that returns a promise
        const patchRegulationObject = (patchObject) => {
            return axios.patch(`verordeningen/${IDToPatch}`, patchObject)
        }

        // After patching the object we need to get the returned UUID and save it in the lineage
        // We will use the state value indexArrayToUUIDBeingEdited for this
        const patchNewUUIDInLineage = ({ object, patchLeden }) => {
            // In order to put the object on the lineage, we need to strip all the properties except for Inhoud, Titel, Type,UUID and Volgnummer
            const stripPropertiesForLineage = (object) => {
                let strippedObject = {
                    Inhoud: object.Inhoud,
                    Titel: object.Titel,
                    Type: object.Type,
                    UUID: object.UUID,
                    Volgnummer: object.Volgnummer,
                }
                if (patchLeden) {
                    strippedObject.Children = object.Children
                }
                return strippedObject
            }
            const strippedObject = stripPropertiesForLineage(object)

            console.log(strippedObject)

            // The max depth can be 4
            const index = indexArrayToUUIDBeingEdited
            const depthOfObject = index.length

            const newLineage = clonedeep(lineage)
            let objectInLineage = null
            let strippedObjectWithChildren = null

            switch (depthOfObject) {
                case 1:
                    objectInLineage = newLineage.Structuur.Children[index[0]]
                    strippedObjectWithChildren = Object.assign(
                        objectInLineage,
                        strippedObject
                    )
                    newLineage.Structuur.Children[
                        index[0]
                    ] = strippedObjectWithChildren
                    break
                case 2:
                    objectInLineage =
                        newLineage.Structuur.Children[index[0]].Children[
                            index[1]
                        ]

                    strippedObjectWithChildren = Object.assign(
                        objectInLineage,
                        strippedObject
                    )

                    newLineage.Structuur.Children[index[0]].Children[
                        index[1]
                    ] = strippedObjectWithChildren
                    break
                case 3:
                    objectInLineage =
                        newLineage.Structuur.Children[index[0]].Children[
                            index[1]
                        ].Children[index[2]]
                    strippedObjectWithChildren = Object.assign(
                        objectInLineage,
                        strippedObject
                    )
                    newLineage.Structuur.Children[index[0]].Children[
                        index[1]
                    ].Children[index[2]] = strippedObjectWithChildren
                    break
                case 4:
                    objectInLineage =
                        newLineage.Structuur.Children[index[0]].Children[
                            index[1]
                        ].Children[index[2]].Children[index[3]]
                    strippedObjectWithChildren = Object.assign(
                        objectInLineage,
                        strippedObject
                    )
                    newLineage.Structuur.Children[index[0]].Children[
                        index[1]
                    ].Children[index[2]].Children[
                        index[3]
                    ] = strippedObjectWithChildren
                    break
                default:
                    break
            }

            // Save new lineage
            setSaveNewLineage(true)
            setLineage(newLineage)
        }

        const newRegulationObject = cleanUpProperties(verordeningsObjectFromGET)

        // Check if object if of type Artikel and if it has Leden
        const isArticle = newRegulationObject.Type === 'Artikel'
        const hasChildren =
            verordeningsLedenFromGET && verordeningsLedenFromGET.length > 0

        // Execute
        patchRegulationObject(newRegulationObject).then((res) => {
            let patchedRegulationObject = res.data

            // If object is an article
            if (isArticle && hasChildren) {
                const patchPromisesLeden = verordeningsLedenFromGET.map(
                    (lid) => {
                        const lidID = lid.ID
                        const cleanedUpLid = cleanUpProperties(lid)
                        return axios
                            .patch(`verordeningen/${lidID}`, cleanedUpLid)
                            .then((res) => {
                                const object = res.data
                                return {
                                    Inhoud: object.Inhoud,
                                    Type: object.Type,
                                    UUID: object.UUID,
                                    Titel: object.Titel,
                                    Children: [],
                                    Volgnummer: object.Volgnummer,
                                }
                            })
                    }
                )

                Promise.all(patchPromisesLeden)
                    .then((patchedLeden) => {
                        patchedRegulationObject.Children = patchedLeden
                        console.log(patchedLeden)
                        console.log(patchedRegulationObject)
                        patchNewUUIDInLineage({
                            object: patchedRegulationObject,
                            patchLeden: true,
                        })
                    })
                    .catch(() =>
                        toast(
                            'Er is iets misgegaan, probeer het later nog eens'
                        )
                    )
            } else {
                patchNewUUIDInLineage({
                    object: patchedRegulationObject,
                    patchLeden: false,
                })
            }
        })
    }

    const saveNewLineageStructure = () => {
        // Disable crudDropdown in titles
        setVerordeningsObjectIsLoading(true)

        // Display loader overlay
        setPatchingInProgress(true)

        function removePropertiesFromLineageStructuur(lineage) {
            const structuurObject = clonedeep(lineage.Structuur)
            return removeProperties(structuurObject.Children)
        }

        // To Patch the structure we need to remove all the properties that don't belong in the structure
        function removeProperties(children) {
            const sanitizedChildren = children.map((child) => {
                delete child.ID
                delete child.Begin_Geldigheid
                delete child.Eind_Geldigheid
                delete child.Created_By
                delete child.Created_Date
                delete child.Modified_By
                delete child.Modified_Date
                delete child.Titel
                delete child.Inhoud
                delete child.Status
                delete child.Type
                delete child.Volgnummer
                delete child.Werkingsgebied
                delete child.Eigenaar_1
                delete child.Eigenaar_2
                delete child.Portefeuillehouder_1
                delete child.Portefeuillehouder_2
                delete child.Opdrachtgever
                if (child.Children.length > 0) {
                    removeProperties(child.Children)
                }
                return child
            })
            return sanitizedChildren
        }

        // Save de aangepaste lineage naar de lineageCopy
        setLineageCopy(clonedeep(lineage))

        // Patch with new structure
        axios
            .patch(`/verordeningstructuur/${lineageID}`, {
                Structuur: {
                    Children: lineage.Structuur.Children,
                },
            })
            .then((res) => {
                toast('Wijzigingen opgeslagen')
                setVerordeningsObjectIsLoading(false)
                setPatchingInProgress(false)
            })
            .catch(() =>
                toast('Er is iets misgegaan, probeer het later nog eens')
            )
    }

    const changeActiveChapter = (hoofdstukNummer) => {
        if (hoofdstukNummer !== null) {
            const parsedHoofdstukNummer = parseInt(hoofdstukNummer)
            setActiveChapter(parsedHoofdstukNummer)
        } else {
            setActiveChapter(null)
        }
    }

    const handleError = (msg) => {
        history.push('/muteer/verordeningen')
        toast(msg)
    }

    const getChapterNumber = () => {
        if (lineage && isActiveChapter) {
            return lineage.Structuur.Children[activeChapter].Volgnummer
        } else {
            return null
        }
    }

    const isActiveChapter =
        activeChapter || activeChapter === '0' || activeChapter === 0

    const hoofdstukItems = lineage ? lineage.Structuur.Children : null

    const itemsInHoofdstuk =
        lineage && isActiveChapter
            ? lineage.Structuur.Children[activeChapter].Children
            : null

    const hoofdstukObject =
        lineage && isActiveChapter
            ? lineage.Structuur.Children[activeChapter]
            : null
    const backToText = isActiveChapter ? 'verordening' : 'verordeningen'

    const backToLink = isActiveChapter
        ? `/muteer/verordeningen/${lineage.ID}`
        : `/muteer/verordeningen`

    const verordeningsObjectAndPotentialLedenIsLoading =
        verordeningsObjectIsLoading && verordeningsObjectLedenIsLoading

    const context = {
        verordeningsObjectIsLoading: verordeningsObjectAndPotentialLedenIsLoading,
        setIndexArrayToUUIDBeingEdited: setIndexArrayToUUIDBeingEdited,
        setVerordeningsObjectFromGET: setVerordeningsObjectFromGET,
        setVerordeningsLedenFromGET: setVerordeningsLedenFromGET,
        verordeningsObjectFromGET: verordeningsObjectFromGET,
        verordeningsLedenFromGET: verordeningsLedenFromGET,
        setVolgnummerBeingEdited: setVolgnummerBeingEdited,
        patchRegulationObject: patchRegulationObject,
        saveNewLineageStructure: saveNewLineageStructure,
        hoofdstukVolgnummer: getChapterNumber(),
        setUUIDBeingEdited: setUUIDBeingEdited,
        UUIDBeingEdited: UUIDBeingEdited,
        userIsAddingSections: addSectionMode,
        userIsEditingOrder: editOrderMode,
        hoofdstukIndex: activeChapter,
        hoofdstukObject: hoofdstukObject,
        setAddSectionMode: setAddSectionMode,
        addSectionMode: addSectionMode,
        verordeningID: lineageID,
        onDragEnd: onDragEnd,
        reorder: reorder,
    }

    return (
        <React.Fragment>
            <VerordeningContext.Provider value={context}>
                <Helmet>
                    <title>Omgevingsbeleid - {`Beheer Verordening`}</title>
                </Helmet>

                <div className="container flex mx-auto lg:px-10">
                    <Link
                        to={backToLink}
                        className={`text-gray-600 text-l mb-4 inline-block`}
                        id="button-back-to-previous-page"
                        onClick={() => {
                            if (isActiveChapter) {
                                setActiveChapter(null)
                            }
                        }}
                    >
                        <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
                        <span>Terug naar {backToText}</span>
                    </Link>
                </div>

                <ContainerMain>
                    <Transition
                        show={dataLoaded}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                    >
                        <div className="flex w-full" id="regulation-container">
                            <div className={`inline-block w-2/3 mb-20`}>
                                <div className="text-gray-800 bg-white rounded shadow-lg">
                                    <div
                                        className={`flex items-center border-b border-gray-400`}
                                    >
                                        <Heading
                                            show={
                                                !editOrderMode &&
                                                !addSectionMode
                                            }
                                            isActiveChapter={isActiveChapter}
                                            activeChapter={activeChapter}
                                            lineage={lineage}
                                        />
                                        <EditAddOrderSection
                                            editOrderMode={editOrderMode}
                                            addSectionMode={addSectionMode}
                                            lineage={lineage}
                                            isActiveChapter={isActiveChapter}
                                            activeChapter={activeChapter}
                                            toggleAdd={() =>
                                                setAddSectionMode(true)
                                            }
                                            toggleOrder={() =>
                                                setEditOrderMode(true)
                                            }
                                        />
                                    </div>
                                    <div>
                                        {activeChapter !== null ? (
                                            <DragAndDropFirstLevel
                                                itemsInHoofdstuk={
                                                    itemsInHoofdstuk
                                                }
                                            />
                                        ) : (
                                            <DragAndDropHoofdstukken
                                                changeActiveChapter={
                                                    changeActiveChapter
                                                }
                                                hoofdstukItems={hoofdstukItems}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isActiveChapter ? (
                                <MetaSidebar
                                    saveNewLineageStructure={
                                        saveNewLineageStructure
                                    }
                                    setAddSectionMode={setAddSectionMode}
                                    userIsAddingSections={addSectionMode}
                                    userIsEditingOrder={editOrderMode}
                                    setEditOrderMode={setEditOrderMode}
                                />
                            ) : null}

                            {addSectionMode ? <AddSectionsSidebar /> : null}

                            <EditContentSidebar
                                setVerordeningsLedenFromGET={
                                    setVerordeningsLedenFromGET
                                }
                                verordeningsLedenFromGET={
                                    verordeningsLedenFromGET
                                }
                                users={users}
                                setVerordeningsObjectFromGET={
                                    setVerordeningsObjectFromGET
                                }
                                verordeningsObjectFromGET={
                                    verordeningsObjectFromGET
                                }
                                verordeningsObjectIsLoading={
                                    verordeningsObjectIsLoading
                                }
                                UUIDBeingEdited={UUIDBeingEdited}
                                volgnummerBeingEdited={volgnummerBeingEdited}
                            />
                        </div>
                    </Transition>
                    {!dataLoaded || patchingInProgress ? (
                        <LoaderContent />
                    ) : null}
                </ContainerMain>
            </VerordeningContext.Provider>
        </React.Fragment>
    )
}

const EditContentSidebar = ({
    verordeningsLedenFromGET,
    setVerordeningsLedenFromGET,
    users,
    setVerordeningsObjectFromGET,
    verordeningsObjectFromGET,
    verordeningsObjectIsLoading,
    UUIDBeingEdited,
    volgnummerBeingEdited,
}) => {
    const verordeningsObjectIsLoaded =
        UUIDBeingEdited &&
        !verordeningsObjectIsLoading &&
        verordeningsObjectFromGET !== null &&
        verordeningsObjectFromGET.Type === 'Artikel'

    const getType = () => {
        if (verordeningsObjectIsLoaded) {
            return verordeningsObjectFromGET.Type
        } else {
            return null
        }
    }

    const currentType = getType()

    return (
        <FixedSidebarContainer show={verordeningsObjectIsLoaded}>
            <div>
                {verordeningsObjectIsLoading && verordeningsObjectFromGET ? (
                    <div className="absolute flex items-center justify-center w-full h-64">
                        <FontAwesomeIcon
                            className="text-gray-500 rotate-icon"
                            icon={faSpinner}
                        />
                    </div>
                ) : null}
                <Transition
                    show={verordeningsObjectIsLoaded}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 transform translate-x-2"
                    enterTo="opacity-100 transform translate-x-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 transform translate-x-0"
                    leaveTo="opacity-0 transform translate-x-2"
                >
                    <React.Fragment>
                        {/* Return Artikel Edit Container */}
                        <ContentSidebarContainer
                            currentType={currentType}
                            volgnummerBeingEdited={volgnummerBeingEdited}
                        >
                            <Artikel
                                users={users}
                                setVerordeningsObjectFromGET={
                                    setVerordeningsObjectFromGET
                                }
                                verordeningsObjectFromGET={
                                    verordeningsObjectFromGET
                                }
                            />
                        </ContentSidebarContainer>

                        {/* Return Leden  Edit Containers */}
                        {verordeningsLedenFromGET &&
                        verordeningsLedenFromGET.length > 0
                            ? verordeningsLedenFromGET.map((lid, index) => (
                                  <ContentSidebarContainer
                                      marginTop={true}
                                      currentType={'lid'}
                                      volgnummerBeingEdited={index + 1}
                                  >
                                      <div className="flex-grow inline-block w-full">
                                          <Werkingsgebied
                                              werkingsgebiedInParentState={
                                                  verordeningsLedenFromGET[
                                                      index
                                                  ].Werkingsgebied
                                              }
                                              setWerkingsgebiedInParentState={(
                                                  UUID
                                              ) =>
                                                  setVerordeningsLedenFromGET({
                                                      type: 'changeValue',
                                                      value: UUID,
                                                      name: 'Werkingsgebied',
                                                      index: index,
                                                  })
                                              }
                                          />
                                      </div>
                                  </ContentSidebarContainer>
                              ))
                            : null}
                    </React.Fragment>
                </Transition>
            </div>
        </FixedSidebarContainer>
    )
}

const ContentSidebarContainer = ({
    currentType,
    volgnummerBeingEdited,
    children,
    marginTop,
}) => {
    const [open, setOpen] = React.useState(true)

    return (
        <div className={`mb-5 rounded-b shadow-md ${marginTop ? 'mt-5' : ''}`}>
            <div
                className={`flex items-center justify-between w-full h-12 p-4 font-semibold text-white cursor-pointer bg-primary ${
                    open ? 'rounded-t' : 'rounded'
                }`}
                onClick={() => setOpen(!open)}
            >
                <span>
                    Eigenschappen
                    {' ' + currentType + ' ' + volgnummerBeingEdited}
                </span>
                <FontAwesomeIcon
                    className="text-white"
                    icon={open ? faChevronDown : faChevronUp}
                />
            </div>
            <div
                className={`p-4 bg-white rounded-b ${
                    open ? 'block' : 'hidden'
                }`}
            >
                {children}
            </div>
        </div>
    )
}

const FixedSidebarContainer = ({ children, show, alignWithContainer }) => {
    const [styles, setStyles] = React.useState(0)
    const [windowSize, setWindowSize] = React.useState(null)

    const verticalPadding = 20

    React.useLayoutEffect(() => {
        const initializeStyles = (val) => setStyles(val)
        const regulationContainer = document.getElementById(
            'regulation-container'
        )
        const navigation = document.getElementById('navigation-main')
        const containerWidth = regulationContainer.offsetWidth
        const oneThirdContainerWidth = containerWidth * 0.333

        const offsetTop = alignWithContainer
            ? regulationContainer.offsetTop - 20
            : navigation.offsetTop + navigation.offsetHeight
        const offsetLeft =
            containerWidth * 0.666 + regulationContainer.offsetLeft

        initializeStyles({
            width: oneThirdContainerWidth,
            yPosition: offsetTop + verticalPadding,
            xPosition: offsetLeft,
        })

        const handleResize = () => {
            setWindowSize(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [windowSize])

    // Left gets +10 pixels to align it with the menu
    return (
        <div
            className={`fixed z-10 inline-block pr-3 pl-10 ${
                show ? '' : 'pointer-events-none'
            }`}
            style={{
                width: styles.width + 'px',
                top: styles.yPosition + 'px',
                left: styles.xPosition + 12 + 'px',
                height: `calc(100vh - ${styles.yPosition}px)`,
                overflowY: 'auto',
            }}
        >
            {children}
        </div>
    )
}

const MetaSidebar = ({
    userIsEditingOrder,
    setEditOrderMode,
    saveNewLineageStructure,
}) => {
    const EditOrderComponent = () => (
        <div>
            <span className="mb-2 font-semibold text-gray-900">
                Volgorde wijzigen
            </span>
            <p className="text-gray-800">
                Je bent op dit moment de volgorde binnen dit hoofdstuk aan het
                wijzigen
            </p>
            <div className="flex items-center mt-5">
                <button
                    className="flex items-center justify-center inline-block px-4 py-2 mr-4 font-semibold text-white bg-green-600 border border-green-600 rounded cursor-pointer hover:text-white"
                    onClick={() => {
                        saveNewLineageStructure()
                        setEditOrderMode(false)
                    }}
                >
                    Opslaan
                </button>
                <button
                    className="text-sm text-gray-800 underline"
                    onClick={() => setEditOrderMode(false)}
                >
                    Annuleren
                </button>
            </div>
        </div>
    )

    return (
        <FixedSidebarContainer
            alignWithContainer={true}
            show={userIsEditingOrder}
        >
            <div>
                <Transition
                    show={userIsEditingOrder}
                    enter="transition ease,-out duration-100"
                    enterFrom="opacity-0 transform translate-x-2"
                    enterTo="opacity-100 transform translate-x-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 transform translate-x-0"
                    leaveTo="opacity-0 transform translate-x-2"
                >
                    <EditOrderComponent />
                </Transition>
            </div>
        </FixedSidebarContainer>
    )
}

// This component displays the UI to, edit, add and change the order of the regulation objects
function EditAddOrderSection({
    lineage,
    toggleAdd,
    toggleOrder,
    isActiveChapter,
    activeChapter,
    editOrderMode,
    addSectionMode,
}) {
    const EditAddOrderInactive = () => {
        return (
            <div className="flex self-stretch justify-end flex-grow">
                <div className="flex items-center h-full">
                    {/* Add button */}
                    <button
                        className="flex items-center justify-center inline-block w-12 h-12 h-full font-semibold text-gray-700 transition duration-100 ease-in border-l border-gray-400 cursor-pointer hover:bg-gray-50 hover:text-gray-900"
                        onClick={toggleAdd}
                    >
                        <span className="flex items-center justify-center inline-block px-2">
                            <FontAwesomeIcon
                                className="absolute text-sm"
                                icon={faPlus}
                            />
                        </span>
                    </button>
                    {/* Order button */}
                    <button
                        onClick={toggleOrder}
                        className="flex items-center justify-center inline-block w-12 h-12 h-full font-semibold text-gray-700 transition duration-100 ease-in border-l border-gray-400 cursor-pointer hover:bg-gray-50 hover:text-gray-900"
                    >
                        <span className="flex items-center justify-center inline-block px-2">
                            <FontAwesomeIcon
                                className="absolute text-sm"
                                icon={faArrowsAltV}
                            />
                        </span>
                    </button>
                </div>
            </div>
        )
    }

    const EditAddOrderActive = ({ editOrderMode, addSectionMode }) => {
        return (
            <div className="flex items-center w-full h-12 pl-10 text-white bg-primary">
                <span className="absolute font-bold">
                    Actie -{' '}
                    {editOrderMode
                        ? 'Volgorde wijzigen'
                        : addSectionMode
                        ? 'Nieuwe onderdelen toevoegen'
                        : ''}
                </span>
            </div>
        )
    }

    return (
        <React.Fragment>
            {!editOrderMode && !addSectionMode ? (
                <EditAddOrderInactive />
            ) : null}

            {editOrderMode || addSectionMode ? (
                <EditAddOrderActive
                    editOrderMode={editOrderMode}
                    addSectionMode={addSectionMode}
                />
            ) : null}
        </React.Fragment>
    )
}

function Heading({ activeHoofdstuk, lineage, isActiveChapter, show }) {
    const text = activeHoofdstuk
        ? 'Hoofdstuk ' +
          lineage.Structuur.Children[activeHoofdstuk].Volgnummer +
          ' - ' +
          lineage.Structuur.Children[activeHoofdstuk].Titel
        : lineage.Titel

    if (!show) return null
    if (isActiveChapter) {
        return <div className="p-6" />
    } else {
        return <h2 className="p-4 text-lg font-bold text-gray-800">{text}</h2>
    }
}

// Because we want to patch the object, we create a new object with the other properties stripped away
const stripProperties = ({ type, object }) => {
    switch (type) {
        case 'Hoofdstuk':
            return {
                Begin_Geldigheid: object.Begin_Geldigheid,
                Eind_Geldigheid: object.Eind_Geldigheid,
                Volgnummer: object.Volgnummer,
                Titel: object.Titel,
                UUID: object.UUID,
                ID: object.ID,
            }

        default:
            return {}
    }
}

export default withRouter(MuteerVerordeningenstructuurDetail)
