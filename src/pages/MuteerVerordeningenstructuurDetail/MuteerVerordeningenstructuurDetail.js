import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'
import clonedeep from 'lodash.clonedeep'

import {
    faFolder,
    faFolderOpen,
    faEdit,
} from '@fortawesome/free-regular-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faBook, faPlus, faArrowsAlt } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import Componenents
import ButtonBackToPage from './../../components/ButtonBackToPage'
import ContainerMain from './../../components/ContainerMain'
import LoaderContent from './../../components/LoaderContent'
import DragAndDropList from './DragAndDropList'
import DragAndDropHoofdstukken from './DragAndDropHoofdstukken'
import VerordeningenDetailSidebar from './VerordeningenDetailSidebar'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Reorder functie
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

function SectieOpslaan({ cancel, save, toggleMode }) {
    return (
        <div className="flex">
            <span
                onClick={cancel}
                className="inline-block text-sm text-red-500 cursor-pointer underline pr-4 p-2 flex items-center justify-center mr-4"
            >
                Annuleren
            </span>
            {save ? (
                <span
                    onClick={() => {
                        save()
                        toggleMode()
                    }}
                    className="inline-block rounded font-semibold border border-green-600 text-white bg-green-600 hover:text-white cursor-pointer pr-4 p-2 flex items-center justify-center"
                >
                    <span className="px-2 flex justify-center items-center inline-block">
                        <FontAwesomeIcon className="text-xs" icon={faSave} />
                    </span>
                    Opslaan
                </span>
            ) : null}
        </div>
    )
}

function SectieToggleMode({ lineage, toggleMode, activeHoofdstuk }) {
    let url = ''

    if (activeHoofdstuk || activeHoofdstuk === 0) {
        // Verwijs naar hoofdstuk
        url = `/muteer/verordeningen/${lineage.ID}/Hoofdstuk/${lineage.Structuur.Children[activeHoofdstuk].UUID}?hoofdstuk=${activeHoofdstuk}&nest_1=null&nest_2=null&nest_3=null`
    } else {
        // Verwijs naar verordening
        url = `/muteer/verordeningen/bewerk-verordening/${lineage.ID}/${lineage.UUID}`
    }
    return (
        <div className="flex">
            <Link
                to={url}
                className="inline-block rounded font-semibold border m-base-border-color mbg-color-hover hover:text-white cursor-pointer m-color px-3 py-2 flex items-center justify-center mr-2"
            >
                <FontAwesomeIcon className="text-xs" icon={faEdit} />
            </Link>
            <span
                className="inline-block rounded font-semibold border m-base-border-color mbg-color-hover hover:text-white cursor-pointer m-color pr-4 p-2 flex items-center justify-center mr-2"
                onClick={() => toggleMode('voegSectieToeMode')}
            >
                <span className="px-2 flex justify-center items-center inline-block">
                    <FontAwesomeIcon className="text-xs" icon={faPlus} />
                </span>
                Toevoegen
            </span>
            <span
                onClick={() => toggleMode('editVolgordeMode')}
                className="inline-block rounded font-semibold border m-base-border-color mbg-color-hover hover:text-white cursor-pointer m-color pr-4 p-2 flex items-center justify-center"
            >
                <span className="px-2 flex justify-center items-center inline-block">
                    <FontAwesomeIcon className="text-xs" icon={faArrowsAlt} />
                </span>
                Volgorde
            </span>
        </div>
    )
}

function Heading({ activeHoofdstuk, lineage }) {
    return activeHoofdstuk !== null ? (
        <h2 className="text-xl font-bold text-gray-800">
            Hoofdstuk {lineage.Structuur.Children[activeHoofdstuk].Volgnummer} -{' '}
            {lineage.Structuur.Children[activeHoofdstuk].Titel}
        </h2>
    ) : (
        <h2 className="text-xl font-bold text-gray-800">{lineage.Titel}</h2>
    )
}

class MuteerVerordeningenstructuurDetail extends Component {
    constructor(props) {
        super(props)

        // [lineage] bevat de structuur en inhoud van de verordening
        // [lineageCopy] bevat dezelfde structuur. Deze wordt gebruikt om een van volgorde veranderde lineage terug te zetten naar het origineel. Dit gebeurd als de gebruiker op annuleren klikt in de editVolgordeMode
        // [activeHoofdstuk] bevat het nummer van het actieve hoofdstuk wat weergegeven moet worden
        // [editVolgordeMode] bevat een boolean voor het toggle'n van de edit mode van de volgorde
        // [voegSectieToeMode] bevat een boolean voor het toggle'n van de mode voor het toevoegen van een nieuwe sectie
        this.state = {
            dataLoaded: false,
            lineage: null,
            lineageCopy: null,
            activeHoofdstuk: null,
            editVolgordeMode: false,
            voegSectieToeMode: false,
        }

        // EventHandler op het eind bij het herordenen
        this.onDragEnd = this.onDragEnd.bind(this)

        // Error notificatie + Reroute naar hoofdpagina van verordeningen
        this.handleError = this.handleError.bind(this)

        // set integer in state voor het actieve hoofdstuk
        this.changeActiveHoofdstuk = this.changeActiveHoofdstuk.bind(this)

        // Gebruikt voor this.state.edit.editVolgordeMode en this.state.voegSectieToeMode
        this.toggleMode = this.toggleMode.bind(this)

        // Sla de veranderde structuur van de lineage op in de state onder de [lineageCopy] property
        this.saveEditVolgordeMode = this.saveEditVolgordeMode.bind(this)

        // Kopieer de originele structuur die in de [lineageCopy] state property staat terug naar de [lineage] property om deze te resetten
        this.cancelEditVolgordeMode = this.cancelEditVolgordeMode.bind(this)

        // Wordt gebruikt om de items in de verkregen verordeningsstructuur te populaten
        this.populateFieldsAndSetState = this.populateFieldsAndSetState.bind(
            this
        )
    }

    onDragEnd(result) {
        // !REFACTOR! -> Opdelen in functies
        // In deze functie zit de functionaliteit voor het re-orderen van de elementen
        // Op basis van het result.type wordt de nieuwe structuur aangemaakt en opgeslagen in de State onder het property lineage

        if (!result.destination) {
            return
        }

        const sourceIndex = result.source.index
        const destIndex = result.destination.index
        const activeHoofdstuk = this.state.activeHoofdstuk

        let lineageCopyFromState = { ...this.state.lineage }

        if (result.type === 'hoofdstukItem') {
            // De eerste laag kan direct gereorderd worden
            // this.state.lineage
            const items = reorder(
                this.state.lineage.Structuur.Children,
                sourceIndex,
                destIndex
            )

            lineageCopyFromState.Structuur.Children = items

            this.setState({
                lineage: lineageCopyFromState,
            })
        } else if (result.type === 'droppableItem') {
            // De eerste laag kan direct gereorderd worden
            // this.state.lineage
            const items = reorder(
                this.state.lineage.Structuur.Children[activeHoofdstuk].Children,
                sourceIndex,
                destIndex
            )

            lineageCopyFromState.Structuur.Children[
                activeHoofdstuk
            ].Children = items

            this.setState({
                lineage: lineageCopyFromState,
            })
        } else if (result.type === 'droppableSubItem') {
            // Reduce de Children van het Actieve Hoofdstuk
            // (Item) is hierbij de onderliggende items van het actieve hoofdstuk
            // Plaats de Children value (type: array) van (item) op het acc object met de UUID als property

            const itemSubItemMap = this.state.lineage.Structuur.Children[
                activeHoofdstuk
            ].Children.reduce((acc, item) => {
                acc[item.UUID] = item.Children
                return acc
            }, {})

            const sourceParentId = result.source.droppableId
            const destParentId = result.destination.droppableId

            const sourceSubItems = itemSubItemMap[sourceParentId]
            const destSubItems = itemSubItemMap[destParentId]

            let ChildrenOfHoofdstuk = [
                ...this.state.lineage.Structuur.Children[activeHoofdstuk]
                    .Children,
            ]

            if (sourceParentId === destParentId) {
                // Het item is gedropped in dezelfde parent
                // Dus we reorderen de sourceSubItems obv de sourceIndex en destIndex

                const reorderedSubItems = reorder(
                    sourceSubItems,
                    sourceIndex,
                    destIndex
                )

                ChildrenOfHoofdstuk = ChildrenOfHoofdstuk.map(child => {
                    // ALS het iten.UUID overeenkomt met de sourceParentID, dan moeten we op dit child de Children property vervangen met de nieuw gesorteerde sub items
                    // Anders returnen we enkel de originele value van child
                    if (child.UUID === sourceParentId) {
                        child.Children = reorderedSubItems
                    }
                    return child
                })

                lineageCopyFromState.Structuur.Children[
                    activeHoofdstuk
                ].Children = ChildrenOfHoofdstuk
                this.setState({
                    lineage: lineageCopyFromState,
                })
            } else {
                // Het item is niet gedropped in dezelfde parent

                let newSourceSubItems = [...sourceSubItems]
                const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1)

                let newDestSubItems = [...destSubItems]
                newDestSubItems.splice(destIndex, 0, draggedItem)
                ChildrenOfHoofdstuk = ChildrenOfHoofdstuk.map(item => {
                    if (item.UUID === sourceParentId) {
                        item.Children = newSourceSubItems
                    } else if (item.UUID === destParentId) {
                        item.Children = newDestSubItems
                    }
                    return item
                })

                // return
                lineageCopyFromState.Structuur.Children[
                    activeHoofdstuk
                ].Children = ChildrenOfHoofdstuk
                this.setState({
                    lineage: lineageCopyFromState,
                })
            }
        } else if (result.type === 'droppableSubSubItem') {
            function findParentElAndIndexes(lineage, sourceParentId) {
                let parentEl = null
                let parentIndex = null
                let childIndex = null

                lineage.forEach((parent, indexParent) => {
                    if (parent.UUID === sourceParentId) {
                        parentEl = parent
                        parentIndex = indexParent
                    }
                    parent.Children.forEach((child, indexChild) => {
                        if (child.UUID === sourceParentId) {
                            parentEl = child
                            parentIndex = indexParent
                            childIndex = indexChild
                        }
                    })
                })

                return {
                    parentEl: parentEl,
                    parentIndex: parentIndex,
                    childIndex: childIndex,
                }
            }

            // ID van het gesleepte element
            const draggableId = result.draggableId

            // ID van het parentEl waar het element vanuit werdt gesleept
            const sourceParentId = result.source.droppableId
            // Start Index van het gesleepte element
            const sourceIndex = result.source.index
            // Eind Index van het gesleepte element
            const destIndex = result.destination.index
            // ID van het parentEl waar het element naar toe gesleept wordt
            const destParentId = result.destination.droppableId

            // Get parentEl en de indexes van het parent element waaruit gesleept is
            const sourceParentElAndIndexes = findParentElAndIndexes(
                lineageCopyFromState.Structuur.Children[activeHoofdstuk]
                    .Children,
                sourceParentId
            )
            const sourceParentEl = sourceParentElAndIndexes.parentEl
            const sourceParentIndex = sourceParentElAndIndexes.parentIndex
            const sourceChildIndex = sourceParentElAndIndexes.childIndex

            // Get parentEl en de indexes van het parent element waar naar toe gesleept is
            const destParentElAndIndexes = findParentElAndIndexes(
                lineageCopyFromState.Structuur.Children[activeHoofdstuk]
                    .Children,
                destParentId
            )
            const destParentEl = destParentElAndIndexes.parentEl
            const destParentIndex = destParentElAndIndexes.parentIndex
            const destChildIndex = destParentElAndIndexes.childIndex

            // Assign variabele met de childrenArray van waaruit gesleept is
            const sourceParentElChildrenArray =
                lineageCopyFromState.Structuur.Children[activeHoofdstuk]
                    .Children[sourceParentIndex].Children[sourceChildIndex]
                    .Children

            // Assign variabele met de childrenArray waar naar toe gesleept is
            const destParentElChildrenArray =
                lineageCopyFromState.Structuur.Children[activeHoofdstuk]
                    .Children[destParentIndex].Children[destChildIndex].Children

            // If / Else statement om te kijken naar wel parentEl hij is gesleept
            if (destParentId === sourceParentId) {
                // Item is gesleept naar hetzelfde parentElement
                const reorderedChildren = reorder(
                    sourceParentElChildrenArray,
                    sourceIndex,
                    destIndex
                )

                // Assign reordered Children in de lineage kopie
                lineageCopyFromState.Structuur.Children[
                    activeHoofdstuk
                ].Children[sourceParentIndex].Children[
                    sourceChildIndex
                ].Children = reorderedChildren

                // Save new state
                this.setState({
                    lineage: lineageCopyFromState,
                })
            } else {
                // Verwijder het gesleepte element uit de source array
                const removedEl = sourceParentElChildrenArray.splice(
                    sourceIndex,
                    1
                )

                // Voeg het gesleepte element toe in de destination array
                destParentElChildrenArray.splice(destIndex, 0, removedEl[0])

                // Assign reordered Children in de lineage kopie
                lineageCopyFromState.Structuur.Children[
                    activeHoofdstuk
                ].Children[sourceParentIndex].Children[
                    sourceChildIndex
                ].Children = sourceParentElChildrenArray

                lineageCopyFromState.Structuur.Children[
                    activeHoofdstuk
                ].Children[destParentIndex].Children[
                    destChildIndex
                ].Children = destParentElChildrenArray

                // Save new state
                this.setState({
                    lineage: { ...lineageCopyFromState },
                })
            }
        }
    }

    toggleMode(propertyName) {
        this.setState({
            [propertyName]: !this.state[propertyName],
        })
    }

    saveEditVolgordeMode() {
        function removePropertiesFromLineageStructuur(lineage) {
            const structuurObject = clonedeep(lineage.Structuur)
            return removeProperties(structuurObject.Children)
        }

        function removeProperties(children) {
            const sanitizedChildren = children.map(child => {
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
        this.setState({
            lineageCopy: clonedeep(this.state.lineage),
        })

        const sanitizedStructuur = removePropertiesFromLineageStructuur(
            this.state.lineage
        )
        const lineageID = this.props.match.params.lineageID
        const verordeningsStructuurPostObject = {
            Structuur: {
                Children: sanitizedStructuur,
            },
        }

        axios
            .patch(
                `/verordeningstructuur/${lineageID}`,
                verordeningsStructuurPostObject
            )
            .then(() => toast('Nieuwe structuur opgeslagen'))
            .catch(() =>
                toast('Er is iets misgegaan, probeer het later nog eens')
            )
    }

    cancelEditVolgordeMode() {
        this.setState({
            lineage: clonedeep(this.state.lineageCopy),
            editVolgordeMode: false,
        })
    }

    changeActiveHoofdstuk(hoofdstukNummer) {
        console.log(hoofdstukNummer)
        if (hoofdstukNummer !== null) {
            const parsedHoofdstukNummer = parseInt(hoofdstukNummer)
            // Het Parsed Hfst nummer doen we '- 1' om de index te verkrijgen
            this.setState({
                activeHoofdstuk: parsedHoofdstukNummer,
            })
        } else if (hoofdstukNummer === null) {
            this.setState({
                activeHoofdstuk: null,
            })
        }
    }

    handleError(msg) {
        this.props.history.push('/muteer/verordeningen')
        toast(msg)
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

    componentDidMount() {
        // - GET structuur van verordening lineage - Query: /verordeningstructuur/:ID
        // - Populate elk verordeningsobject obv UUID met de version - Query:
        //     - /verordeningen/version/:UUID

        const searchParams = this.props.location.search
        if (searchParams) {
            const activeHoofdstukFromURL = searchParams.slice(
                searchParams.search('=') + 1,
                searchParams.length
            )
            this.setState(
                {
                    activeHoofdstuk: activeHoofdstukFromURL,
                },
                () => console.log('Active Hoofdstuk:' + activeHoofdstukFromURL)
            )
        }

        const ID = this.props.match.params.lineageID

        // Als het ID geen number -> push naar de overzichtspagina
        if (!ID || isNaN(ID)) {
            this.handleError('Deze verordening bestaat niet')
            return
        }

        // Get Lineage
        axios
            .get(`/verordeningstructuur/${ID}`)
            .then(res => {
                // Handle empty res
                if (!res.data || !res.data[0]) {
                    this.handleError(
                        'Er ging iets fout, probeer het later opnieuw'
                    )
                    return
                }

                // Get latest lineage
                const lineage = res.data[res.data.length - 1]
                this.populateFieldsAndSetState(lineage)
            })
            .catch(err => {
                console.log(err)
                this.handleError('Er ging iets fout, probeer het later opnieuw')
            })
    }

    render() {
        let hoofdstukVolgnummer = null

        if (
            this.state.lineage &&
            (this.state.activeHoofdstuk ||
                this.state.activeHoofdstuk === '0' ||
                this.state.activeHoofdstuk === 0)
        ) {
            hoofdstukVolgnummer = this.state.lineage.Structuur.Children[
                this.state.activeHoofdstuk
            ].Volgnummer
        }

        return (
            <React.Fragment>
                <ButtonBackToPage
                    terugNaar={` verordeningen`}
                    url={`/muteer/verordeningen`}
                />
                <ContainerMain>
                    <Helmet>
                        <title>Omgevingsbeleid - {`Beheer Verordening`}</title>
                    </Helmet>

                    <VerordeningenDetailSidebar
                        changeActiveHoofdstuk={this.changeActiveHoofdstuk}
                        activeHoofdstuk={this.state.activeHoofdstuk}
                        dataLoaded={this.state.dataLoaded}
                        lineage={this.state.lineage}
                    />

                    {/* Container */}
                    {this.state.dataLoaded ? (
                        <div className="w-3/4 inline-block flex-grow pl-8 mb-20">
                            <div className="bg-white text-gray-800 rounded shadow-lg">
                                <div className="p-5 border-b border-gray-400 flex justify-between items-center">
                                    <Heading
                                        activeHoofdstuk={
                                            this.state.activeHoofdstuk
                                        }
                                        lineage={this.state.lineage}
                                    />
                                    {this.state.editVolgordeMode ||
                                    this.state.voegSectieToeMode ? (
                                        <React.Fragment>
                                            {this.state.editVolgordeMode ? (
                                                <SectieOpslaan
                                                    cancel={
                                                        this
                                                            .cancelEditVolgordeMode
                                                    }
                                                    save={
                                                        this
                                                            .saveEditVolgordeMode
                                                    }
                                                    toggleMode={() =>
                                                        this.toggleMode(
                                                            'editVolgordeMode'
                                                        )
                                                    }
                                                />
                                            ) : null}
                                            {this.state.voegSectieToeMode ? (
                                                <SectieOpslaan
                                                    cancel={() =>
                                                        this.toggleMode(
                                                            'voegSectieToeMode'
                                                        )
                                                    }
                                                    save={false}
                                                    toggleMode={() =>
                                                        this.toggleMode(
                                                            'voegSectieToeMode'
                                                        )
                                                    }
                                                />
                                            ) : null}
                                        </React.Fragment>
                                    ) : (
                                        <SectieToggleMode
                                            lineage={this.state.lineage}
                                            activeHoofdstuk={
                                                this.state.activeHoofdstuk
                                            }
                                            toggleMode={this.toggleMode}
                                        />
                                    )}
                                </div>
                                <div>
                                    {this.state.activeHoofdstuk !== null ? (
                                        <DragAndDropList
                                            hoofdstukVolgnummer={
                                                hoofdstukVolgnummer
                                            }
                                            verordeningID={
                                                this.props.match.params
                                                    .lineageID
                                            }
                                            voegSectieToeMode={
                                                this.state.voegSectieToeMode
                                            }
                                            dragBool={
                                                this.state.editVolgordeMode
                                            }
                                            hoofdstukIndex={
                                                this.state.activeHoofdstuk
                                            }
                                            items={
                                                this.state.lineage.Structuur
                                                    .Children[
                                                    this.state.activeHoofdstuk
                                                ].Children
                                            }
                                            reorder={reorder}
                                            onDragEnd={this.onDragEnd}
                                        />
                                    ) : (
                                        <DragAndDropHoofdstukken
                                            changeActiveHoofdstuk={
                                                this.changeActiveHoofdstuk
                                            }
                                            voegSectieToeMode={
                                                this.state.voegSectieToeMode
                                            }
                                            hoofdstukIndex={
                                                this.state.activeHoofdstuk
                                            }
                                            items={
                                                this.state.lineage.Structuur
                                                    .Children
                                            }
                                            dragBool={
                                                this.state.editVolgordeMode
                                            }
                                            reorder={reorder}
                                            onDragEnd={this.onDragEnd}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <LoaderContent />
                    )}
                </ContainerMain>
            </React.Fragment>
        )
    }
}

export default withRouter(MuteerVerordeningenstructuurDetail)
