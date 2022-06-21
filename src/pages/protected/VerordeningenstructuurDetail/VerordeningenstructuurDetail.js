/* istanbul ignore file */
/* eslint-disable */
// TODO: For now ESLint is disabled, because this file will be refactored in the future, based on a new data structure

import { Helmet } from 'react-helmet'
import { Transition } from '@headlessui/react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import clonedeep from 'lodash.clonedeep'
import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Context
import VerordeningContext from './VerordeningContext'

// Import global Componenents
import { ContainerMain } from './../../../components/Container'
import { LoaderContent } from './../../../components/Loader'

// Utils
import formatGeldigheidDatesForUI from './../../../utils/formatGeldigheidDatesForUI'
import formatGeldigheidDatesForAPI from './../../../utils/formatGeldigheidDatesForAPI'

// Verordening Components
import DragAndDropFirstLevel from './DragAndDropFirstLevel'
import DragAndDropHoofdstukken from './DragAndDropHoofdstukken'
import AddSectionsSidebar from './AddSectionsSidebar'
import EditAddOrderSection from './EditAddOrderSection'
import EditContentSidebar from './EditContentSidebar'
import EditOrderSidebar from './EditOrderSidebar'

// Import Axios instance to connect with the API
import axios from '../../../api/instance'
import { useEffect, useReducer, useState } from 'react'

// Reorder items in array
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

/**
 * This component holds a complete verordening, with the ability to edit, add and delete object in it
 */
const VerordeningenstructuurDetail = () => {
    // This component has two views. The overview of all the chapters (e.g. activeChapter === Null) and a view that shows the activeChapter (e.g. activeChapter === 0). This view is conditional based on the value of activeChapter.
    // This component is quite complex, as it holds the whole structure and provides the user with several ways to edit that structure

    // [dataLoaded] - Contains a Boolean that is true when all API calls are done
    const [dataLoaded, setDataLoaded] = useState(false)

    // [patchingInProgress] - Contains a Boolean that is true when we are patching
    const [patchingInProgress, setPatchingInProgress] = useState(false)

    // [lineage] - Contains the whole structure of the regulations
    const [lineage, setLineage] = useState(null)

    // [lineageCopy] - A copy of the regulation structure. We use this to undo changes when the user is changing the order and cancels them.
    const [lineageCopy, setLineageCopy] = useState(null)

    // [users] - Contains the users, which we pass to the component to edit regulation objects
    const [users, setUsers] = useState(null)

    // [activeChapter] - The first layer of objects in the lineage are Chapters. This value contains the active chapter OR it contains an Null value, which means there is no chapter active
    const [activeChapter, setActiveChapter] = useState(null)

    // [editOrderMode] - Contains a boolean to represent the mode to edit the order of object
    const [editOrderMode, setEditOrderMode] = useState(false)

    // [addSectionMode] - Contains a boolean to represent the mode to add new objects
    const [addSectionMode, setAddSectionMode] = useState(false)

    // [addSectionType] - Contains a string of 'Hoofdstuk', 'Afdeling', 'Paragraaf' or 'Artikel'
    const [addSectionType, setAddSectionType] = useState(false)

    // [UUIDBeingEdited] - Contains a UUID of the object that the user is editing. This can be a Chapter, a Group or a Paragraph
    const [UUIDBeingEdited, setUUIDBeingEdited] = useState(null)

    // [indexArrayToUUIDBeingEdited] - This contains an array the path to the specific item in the lineage. The first item is always the chapter followed by subsequent levels from there.
    const [indexArrayToUUIDBeingEdited, setIndexArrayToUUIDBeingEdited] =
        useState(null)

    // This state value is used to see when we need to Patch the lineage
    // See the useEffect below. We use this useEffect to trigger when a new lineage has set
    const [saveNewLineage, setSaveNewLineage] = useState(false)
    useEffect(() => {
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
    const [volgnummerBeingEdited, setVolgnummerBeingEdited] = useState(null)

    // [verordeningsObjectFromGET] - Contains the object we get from the GET request on [UUIDBeingEdited]
    const verordeningsObjectFromGETReducer = (state, action) => {
        const newState = { ...state }
        switch (action.type) {
            case 'initialize':
                return action.initObject
            case 'changeValue':
                newState[action.name] = action.value
                return newState
            case 'changeLidToArtikelInhoud':
                newState[action.name] = action.value
                if (newState.Children && newState.Children.length > 0) {
                    delete newState.Children
                }
                return newState
            case 'changeSelectValue':
                if (action.actionMeta.action === 'select-option') {
                    newState[action.property] = action.e.value
                } else if (action.actionMeta.action === 'clear') {
                    newState[action.property] = null
                }
                return newState
            case 'removeSpecificIndexOfLeden':
                if (newState.Children && newState.Children.length > 0) {
                    newState.Children.splice(action.index, 1)
                }
                return newState
            case 'cancel':
                setLineage(lineageCopy)
                return null
            default:
                return state
        }
    }

    const [verordeningsObjectFromGET, setVerordeningsObjectFromGET] =
        useReducer(verordeningsObjectFromGETReducer, null)

    const [verordeningsObjectIsLoading, setVerordeningsObjectIsLoading] =
        useState(false)

    // Loading state for [verordeningsLedenFromGET]
    const [
        verordeningsObjectLedenIsLoading,
        setVerordeningsObjectLedenIsLoading,
    ] = useState(false)

    // [verordeningsLedenFromGET] - Contains the leden objects in an array if the [verordeningsObjectFromGET] is an Article and has Children
    const verordeningsLedenFromGETReducer = (state, action) => {
        const newState = clonedeep(state)

        switch (action.type) {
            case 'initialize':
                return action.initObject
            case 'changeValue':
                newState[action.index][action.name] = action.value
                return newState
            case 'changeValueForAllLeden':
                newState.forEach((lid, index) => {
                    newState[index][action.name] = action.value
                })
                return newState
            case 'removeSpecificIndex':
                newState.splice(action.index, 1)
                return newState
            case 'resetAllWerkingsgebieden':
                newState.forEach(lid => (lid.Gebied = null))
                return newState
            case 'setValueForAll':
                newState.forEach(lid => (lid.Gebied = action.value))
                return newState
            case 'cancel':
                return null
            default:
                return state
        }
    }

    const [verordeningsLedenFromGET, setVerordeningsLedenFromGET] = useReducer(
        verordeningsLedenFromGETReducer,
        null
    )

    // GET request for [UUIDBeingEdited] to get the whole object, then setInState under [verordeningsObjectFromGET] and set [verordeningsObjectIsLoading] to null
    useEffect(() => {
        if (UUIDBeingEdited === null) return

        // Get the regulation object based on the UUID (UUIDBeingEdited)
        setVerordeningsObjectIsLoading(true)
        setVerordeningsObjectLedenIsLoading(true)

        axios
            .get(`/version/verordeningen/${UUIDBeingEdited}?limit=1`)
            .then(res => {
                const initObject = formatGeldigheidDatesForUI(res.data)
                setVerordeningsObjectFromGET({
                    type: 'initialize',
                    initObject: initObject,
                })

                // If GET Object is of the type 'Artikel' we check if the article has leden with getLedenOfArticle()
                // If that is the case we need to get them from the API, so we postpone setting setVerordeningsObjectIsLoading(false)
                // We will do that after getting the leden
                if (res.data.Type === 'Artikel') {
                    getLedenOfArticle()
                } else {
                    setVerordeningsObjectIsLoading(false)
                    setVerordeningsObjectLedenIsLoading(false)
                }
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setVerordeningsObjectLedenIsLoading(false)
                setVerordeningsObjectIsLoading(false)
            })
    }, [UUIDBeingEdited])

    const addSection = ({ index }) => {
        // const index = [0, 1]
        const depthOfObject = index.length
        const newLineage = clonedeep(lineage)

        const createNewVerordeningObject = async () => {
            try {
                const data = await axios
                    .post('/verordeningen', {
                        Titel: '',
                        Inhoud: '',
                        Status: 'Vigerend',
                        Type: addSectionType ? addSectionType : 'Hoofdstuk',
                        Volgnummer: '',
                    })
                    .then(res => res.data)
                return data
            } catch (err) {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            }
        }

        createNewVerordeningObject().then(newObject => {
            const lineageObject = {
                Children: [],
                Inhoud: newObject.Inhoud,
                Titel: newObject.Titel,
                Type: newObject.Type,
                UUID: newObject.UUID,
                Volgnummer: newObject.Volgnummer,
            }

            switch (depthOfObject) {
                case 1:
                    // Hoofdstuk level
                    newLineage.Structuur.Children.splice(
                        [index[0]],
                        0,
                        lineageObject
                    )
                    // lineage.Structuur.Children[index[0]]
                    break
                case 2:
                    // First level
                    newLineage.Structuur.Children[index[0]].Children.splice(
                        [index[1]],
                        0,
                        lineageObject
                    )
                    break
                case 3:
                    // Second level
                    newLineage.Structuur.Children[index[0]].Children[
                        index[1]
                    ].Children.splice([index[2]], 0, lineageObject)
                    // lineage.Structuur.Children[index[0]].Children[index[1]]
                    //     .Children[index[2]]
                    break
                case 4:
                    // Third level
                    newLineage.Structuur.Children[index[0]].Children[
                        index[1]
                    ].Children[index[2]].Children.splice(
                        [index[3]],
                        0,
                        lineageObject
                    )
                    break
                default:
                    break
            }
            // Save new lineage with new object in it :-)
            setLineage(newLineage)

            // Then set UUID, index to the object in the lineage and the property 'Volgnummer' of thee new object in state
            // This will set the new object to edit mode
            setIndexArrayToUUIDBeingEdited(index)
            setUUIDBeingEdited(newObject.UUID)
            setVolgnummerBeingEdited(newObject.Volgnummer)

            setAddSectionMode(false)
            setAddSectionType(null)
        })
    }

    const editContentOfArticle = ({ type }) => {
        // Make new Leden object, then place the Lid object as the new child
        const createNewVerordeningsLid = async (inhoud = '') => {
            try {
                const data = await axios
                    .post('/verordeningen', {
                        Titel: '',
                        Inhoud: inhoud,
                        Status: 'Vigerend',
                        Type: 'Lid',
                        Volgnummer: '',
                    })
                    .then(res => res.data)
                return data
            } catch (err) {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            }
        }

        switch (type) {
            case 'convertToLidInhoud':
                createNewVerordeningsLid(verordeningsObjectFromGET.Inhoud).then(
                    newObject => {
                        setVerordeningsObjectFromGET({
                            type: 'changeValue',
                            name: 'Inhoud',
                            value: '',
                        })
                        setVerordeningsLedenFromGET({
                            type: 'initialize',
                            initObject: [newObject],
                        })
                    }
                )
                break
            case 'convertToArtikelInhoud':
                const lidInhoud = verordeningsLedenFromGET[0].Inhoud
                setVerordeningsObjectFromGET({
                    type: 'changeLidToArtikelInhoud',
                    name: 'Inhoud',
                    value: lidInhoud,
                })
                setVerordeningsLedenFromGET({ type: 'cancel' })
                break
            case 'addLidToArticle':
                createNewVerordeningsLid().then(newObject => {
                    setVerordeningsObjectFromGET({
                        type: 'changeValue',
                        name: 'Inhoud',
                        value: '',
                    })
                    setVerordeningsLedenFromGET({
                        type: 'initialize',
                        initObject: [...verordeningsLedenFromGET, newObject],
                    })
                })
                break
            default:
                break
        }
    }

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
            setVerordeningsObjectLedenIsLoading(false)
            return
        }

        // Get an array of axios Promises that return the Leden objects
        const getAllLeden = ledenOfArtikel.map(lid =>
            axios
                .get(`/version/verordeningen/${lid.UUID}`)
                .then(res => res.data)
                .catch(err => console.log(err))
        )

        // After all the promises are resolved we set the state
        Promise.all(getAllLeden)
            .then(ledenFromAPI => {
                setVerordeningsLedenFromGET({
                    type: 'initialize',
                    initObject: ledenFromAPI,
                })
                setVerordeningsObjectIsLoading(false)
                setVerordeningsObjectLedenIsLoading(false)
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setVerordeningsObjectIsLoading(false)
                setVerordeningsObjectLedenIsLoading(false)
            })
    }

    // Get lineageID from URL parameter, used in saveNewLineageStructure()
    const { lineageID } = useParams()
    // Get location, used to get params on mount
    const location = useLocation()
    // Get history, used in handleError()
    const navigate = useNavigate()

    // After first render
    useEffect(() => {
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
            .then(res => {
                // Handle empty res
                if (!res.data || !res.data[0]) {
                    toast(process.env.REACT_APP_ERROR_MSG)
                    return
                }

                // Get latest lineage and set data in state
                const lineage = res.data[res.data.length - 1]
                setLineage(lineage)
                setLineageCopy(lineage)
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })

        const getUsers = axios
            .get('/gebruikers')
            .then(res => {
                const gebruikers = res.data
                setUsers(gebruikers)
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })

        Promise.all([getLineage, getUsers]).then(() => setDataLoaded(true))
    }, [])

    useEffect(() => {
        // Eventlistener for closing editing modes with the Escape key
        const closeOnEscape = e => {
            if (e.key === 'Escape') {
                if (editOrderMode) {
                    setEditOrderMode(false)
                    cancelReorder()
                } else if (addSectionMode) {
                    setAddSectionMode(false)
                    setAddSectionType(null)
                }
            }
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [editOrderMode, addSectionMode])

    // Reorder sections for all four levels
    const onDragEnd = result => {
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
            currentLineage.Structuur.Children[currentActiveChapter].Children =
                reorderedChildren
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
                childrenOfActiveChapter = childrenOfActiveChapter.map(child => {
                    // ALS het iten.UUID overeenkomt met de sourceParentID, dan moeten we op dit child de Children property vervangen met de nieuw gesorteerde sub items
                    // Anders returnen we enkel de originele value van child
                    if (child.UUID === sourceParentId) {
                        child.Children = reorderedChildren
                    }
                    return child
                })

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
                childrenOfActiveChapter = childrenOfActiveChapter.map(item => {
                    if (item.UUID === sourceParentId) {
                        item.Children = copySourceChildren
                    } else if (item.UUID === destParentId) {
                        item.Children = copyDestinationChildren
                    }
                    return item
                })

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

                // The children are the .Children elements of the activeHoofdstuk (the firstLevel)
                children.forEach((child, indexOfChild) => {
                    if (child.UUID === sourceParentId) {
                        parentIndex = indexOfChild
                    }

                    child.Children.forEach(
                        (childOfChild, indexOfChildOfChild) => {
                            if (childOfChild.UUID === sourceParentId) {
                                parentIndex = indexOfChild
                                childIndex = indexOfChildOfChild
                            }
                        }
                    )
                })

                return [parentIndex, childIndex]
            }

            // Get parent element, parent index and childIndex of the source parent
            const [sourceParentIndex, sourceChildIndex] =
                findParentElAndIndexes(
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
                ].Children[destParentIndex].Children[destChildIndex].Children =
                    destinationParentElChildrenArray

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

    const cancelReorder = () => {
        setLineage(lineageCopy)
    }

    // Function to patch a regulation object.
    // This object is represented in State under the verordeningsObjectFromGET state variable
    // This object can be of any type. If the object is an 'Artikel' we check if it has leden, as we have then have to patch them too
    // Refactor: This function is based on a lot of side effects, e.g. verordeningsObjectFromGET. It would be good to keep this function functional with parameters
    const patchRegulationObject = () => {
        const IDToPatch = verordeningsObjectFromGET.ID

        // Func to strip away the extra properties in order to patch it
        const cleanUpProperties = object => {
            // Remove values that are not accepted by the API
            delete object.Created_By
            delete object.Created_Date
            delete object.Modified_By
            delete object.Modified_Date
            delete object.Ref_Beleidskeuzes
            delete object.UUID
            delete object.ID

            // Remove properties with a value of null
            Object.keys(object).forEach(
                key => object[key] === null && delete object[key]
            )

            const potentialObjects = [
                'Gebied',
                'Eigenaar_1',
                'Eigenaar_2',
                'Opdrachtgever',
                'Portefeuillehouder_1',
                'Portefeuillehouder_2',
            ]

            potentialObjects.forEach(potentialObject => {
                if (
                    object.hasOwnProperty(potentialObject) &&
                    typeof object[potentialObject] === 'object' &&
                    object[potentialObject] !== null
                ) {
                    object[potentialObject] = object[potentialObject].UUID
                }
            })

            return object
        }

        // PATCH function that returns a promise
        const axiosPatchRegulationObject = patchObject => {
            return axios.patch(`verordeningen/${IDToPatch}`, patchObject)
        }

        // After patching the object we need to get the returned UUID and save it in the lineage
        // We will use the state value indexArrayToUUIDBeingEdited for this
        /**
         *
         * @param {props}
         * @param {object} object - Contains the verordeningen object (/version/verordeningen/UUID). This differs from the corresponding object in the lineage.
         * @param {boolean} patchLeden - Indicating if the object has leden
         */
        const patchNewUUIDInLineage = ({ object, patchLeden }) => {
            /**
             * This function strips alls the properties of the object in order to patch it
             * An example of a property that will be removed is Created_At
             * @param {object} object - The object we will return a stripped version of
             */
            const stripPropertiesForLineage = object => ({
                Inhoud: object.Inhoud,
                Titel: object.Titel,
                Type: object.Type,
                UUID: object.UUID,
                Volgnummer: object.Volgnummer,
                Children: patchLeden ? object.Children : [],
            })

            // The max depth can be 4
            const index = indexArrayToUUIDBeingEdited
            const depthOfObject = index.length

            // Contains the new lineage we will save to the state
            const newLineage = clonedeep(lineage)

            /**
             * Function that takes all the properties on the 'existingObj' param and deletes them on the 'obj' param
             * Important: The 'Children' property on the 'obj' param will never be deleted
             * @param {object} obj - The object we want to clean
             * @param {object} existingObj - Contains the properties we will delete on the
             * @returns the cleaned 'obj' parameter
             */
            const removeExistingProperties = (obj, existingObj) => {
                Object.keys(existingObj).forEach(key => {
                    if (key === 'Children') return
                    delete obj[key]
                })
                return obj
            }

            /**
             *
             * @param {number} depth - Contains the depth of the object in the lineage
             * @returns the corresponding object
             */
            const getObjectInLineage = depth => {
                if (depth === 1) {
                    return clonedeep(newLineage.Structuur.Children[index[0]])
                } else if (depth === 2) {
                    return clonedeep(
                        newLineage.Structuur.Children[index[0]].Children[
                            index[1]
                        ]
                    )
                } else if (depth === 3) {
                    return clonedeep(
                        newLineage.Structuur.Children[index[0]].Children[
                            index[1]
                        ].Children[index[2]]
                    )
                } else if (depth === 4) {
                    return clonedeep(
                        newLineage.Structuur.Children[index[0]].Children[
                            index[1]
                        ].Children[index[2]].Children[index[3]]
                    )
                }
            }

            /**
             * Remove all the fields (e.g. Created_At) from the object that we can't PATCH to the API
             * This strippedObject contains the changes we've made
             */
            const strippedObject = stripPropertiesForLineage(object)

            /**
             * Find the corresponding object in the lineage structure
             * This object does not contain the changes made yet
             */
            const objectFromLineage = getObjectInLineage(depthOfObject)

            // if (!patchLeden && )
            if (!patchLeden && objectFromLineage.Type !== 'Artikel') {
                strippedObject.Children = objectFromLineage.Children
            }

            switch (depthOfObject) {
                // Hoofdstuk
                case 1:
                    newLineage.Structuur.Children[index[0]] = strippedObject
                    break
                // Paragraaf || Afdeling || Artikel
                case 2:
                    newLineage.Structuur.Children[index[0]].Children[index[1]] =
                        strippedObject
                    break
                // Afdeling || Artikel
                case 3:
                    newLineage.Structuur.Children[index[0]].Children[
                        index[1]
                    ].Children[index[2]] = strippedObject
                    break
                // Artikel
                case 4:
                    newLineage.Structuur.Children[index[0]].Children[
                        index[1]
                    ].Children[index[2]].Children[index[3]] = strippedObject
                    break
                default:
                    break
            }

            // Save new lineage
            setSaveNewLineage(true)
            setLineage(newLineage)
        }

        const newRegulationObject = cleanUpProperties(
            formatGeldigheidDatesForAPI(verordeningsObjectFromGET)
        )

        axiosPatchRegulationObject(newRegulationObject).then(res => {
            let patchedRegulationObject = res.data

            // Check if object if of type Artikel and if it has Leden
            const isArticle = newRegulationObject.Type === 'Artikel'
            const hasChildren =
                verordeningsLedenFromGET && verordeningsLedenFromGET.length > 0
            // If object is an article and has Leden
            if (isArticle && hasChildren && !addSectionType) {
                const patchPromisesLeden = verordeningsLedenFromGET.map(lid => {
                    const lidID = lid.ID
                    const cleanedUpLid = cleanUpProperties(lid)
                    return axios
                        .patch(`verordeningen/${lidID}`, cleanedUpLid)
                        .then(res => {
                            const object = formatGeldigheidDatesForUI(res.data)
                            return {
                                Inhoud: object.Inhoud,
                                Type: object.Type,
                                UUID: object.UUID,
                                Titel: object.Titel,
                                Children: [],
                                Volgnummer: object.Volgnummer,
                            }
                        })
                })

                Promise.all(patchPromisesLeden)
                    .then(patchedLeden => {
                        patchedRegulationObject.Children = patchedLeden
                        patchNewUUIDInLineage({
                            object: patchedRegulationObject,
                            patchLeden: true,
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        toast(process.env.REACT_APP_ERROR_MSG)
                    })
            } else {
                patchNewUUIDInLineage({
                    object: patchedRegulationObject,
                    patchLeden: false,
                })
            }

            // Reset the type after each Patch
            setAddSectionType(null)
        })
    }

    const saveNewLineageStructure = () => {
        // Disable crudDropdown in titles
        setVerordeningsObjectIsLoading(true)

        // Display loader overlay
        setPatchingInProgress(true)

        // Save de aangepaste lineage naar de lineageCopy
        setLineageCopy(clonedeep(lineage))

        // Patch with new structure
        axios
            .patch(`/verordeningstructuur/${lineageID}`, {
                Structuur: {
                    Children: lineage.Structuur.Children,
                },
            })
            .then(res => {
                toast('Wijzigingen opgeslagen')
                setVerordeningsObjectIsLoading(false)
                setPatchingInProgress(false)
                setLineage(res.data)
                setLineageCopy(res.data)
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    const removeObject = index => {
        const depthOfObject = index.length
        const newLineage = clonedeep(lineage)

        switch (depthOfObject) {
            case 1:
                newLineage.Structuur.Children.splice([index[0]], 1)
                break
            case 2:
                newLineage.Structuur.Children[index[0]].Children.splice(
                    [index[1]],
                    1
                )
                break
            case 3:
                newLineage.Structuur.Children[index[0]].Children[
                    index[1]
                ].Children.splice([index[2]], 1)
                break
            case 4:
                newLineage.Structuur.Children[index[0]].Children[
                    index[1]
                ].Children[index[2]].Children.splice([index[3]], 1)
                break
            default:
                break
        }
        setSaveNewLineage(true)
        setLineage(newLineage)
        setLineageCopy(newLineage)
    }

    const changeActiveChapter = hoofdstukNummer => {
        if (hoofdstukNummer !== null) {
            const parsedHoofdstukNummer = parseInt(hoofdstukNummer)
            setActiveChapter(parsedHoofdstukNummer)
        } else {
            setActiveChapter(null)
        }
    }

    const handleError = msg => {
        navigate('/muteer/verordeningen', { replace: true })
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
        verordeningsObjectIsLoading || verordeningsObjectLedenIsLoading

    const context = {
        verordeningsObjectIsLoading:
            verordeningsObjectAndPotentialLedenIsLoading,
        setIndexArrayToUUIDBeingEdited: setIndexArrayToUUIDBeingEdited,
        setVerordeningsObjectFromGET: setVerordeningsObjectFromGET,
        verordeningsObjectFromGET: verordeningsObjectFromGET,
        setVerordeningsLedenFromGET: setVerordeningsLedenFromGET,
        verordeningsLedenFromGET: verordeningsLedenFromGET,
        editContentOfArticle: editContentOfArticle,
        setVolgnummerBeingEdited: setVolgnummerBeingEdited,
        patchRegulationObject: patchRegulationObject,
        saveNewLineageStructure: saveNewLineageStructure,
        hoofdstukVolgnummer: getChapterNumber(),
        setUUIDBeingEdited: setUUIDBeingEdited,
        UUIDBeingEdited: UUIDBeingEdited,
        userIsAddingSections: addSectionMode,
        userIsEditingOrder: editOrderMode,
        addSection: addSection,
        addSectionType: addSectionType,
        setAddSectionType: setAddSectionType,
        hoofdstukIndex: activeChapter,
        hoofdstukObject: hoofdstukObject,
        setAddSectionMode: setAddSectionMode,
        addSectionMode: addSectionMode,
        verordeningID: lineageID,
        removeObject: removeObject,
        onDragEnd: onDragEnd,
        reorder: reorder,
    }

    return (
        <>
            <VerordeningContext.Provider value={context}>
                <Helmet>
                    <title>Omgevingsbeleid - {`Beheer Verordening`}</title>
                </Helmet>

                <div className="container flex mx-auto lg:px-10">
                    <Link
                        to={backToLink}
                        className={`text-gray-600 text-l mb-4 inline-block`}
                        onClick={() => {
                            if (isActiveChapter) {
                                setActiveChapter(null)
                            }
                        }}>
                        <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
                        <span>Terug naar {backToText}</span>
                    </Link>
                </div>

                <ContainerMain>
                    <Transition
                        show={dataLoaded}
                        className="flex w-full"
                        id="regulation-container">
                        <div className={`inline-block w-2/3 mb-20`}>
                            <div className="text-gray-800 bg-white rounded shadow-lg">
                                <EditAddOrderSection
                                    UUIDBeingEdited={UUIDBeingEdited}
                                    editOrderMode={editOrderMode}
                                    addSectionMode={addSectionMode}
                                    lineage={lineage}
                                    isActiveChapter={isActiveChapter}
                                    activeChapter={activeChapter}
                                    toggleAdd={() => setAddSectionMode(true)}
                                    toggleOrder={() => setEditOrderMode(true)}
                                />
                                <div>
                                    {activeChapter !== null ? (
                                        <DragAndDropFirstLevel
                                            itemsInHoofdstuk={itemsInHoofdstuk}
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

                        <EditOrderSidebar
                            cancelReorder={cancelReorder}
                            isActiveChapter={isActiveChapter}
                            saveNewLineageStructure={saveNewLineageStructure}
                            setAddSectionMode={setAddSectionMode}
                            userIsAddingSections={addSectionMode}
                            userIsEditingOrder={editOrderMode}
                            setEditOrderMode={setEditOrderMode}
                        />

                        <AddSectionsSidebar show={addSectionMode} />

                        <EditContentSidebar
                            setVerordeningsLedenFromGET={
                                setVerordeningsLedenFromGET
                            }
                            verordeningsLedenFromGET={verordeningsLedenFromGET}
                            users={users}
                            setVerordeningsObjectFromGET={
                                setVerordeningsObjectFromGET
                            }
                            verordeningsObjectFromGET={
                                verordeningsObjectFromGET
                            }
                            verordeningsObjectIsLoading={
                                verordeningsObjectIsLoading ||
                                verordeningsObjectLedenIsLoading
                            }
                            UUIDBeingEdited={UUIDBeingEdited}
                            volgnummerBeingEdited={volgnummerBeingEdited}
                        />
                    </Transition>
                    {!dataLoaded || patchingInProgress ? (
                        <LoaderContent />
                    ) : null}
                </ContainerMain>
            </VerordeningContext.Provider>
        </>
    )
}

export default VerordeningenstructuurDetail
