import React from "react"
import * as d3 from "d3"
import cloneDeep from "lodash.clonedeep"
import { Transition } from "@headlessui/react"
import { useLocation, useHistory, matchPath } from "react-router-dom"
import { useLastLocation } from "react-router-last-location"

import axios from "../../API/axios"

import useLockBodyScroll from "../../utils/useLockBodyScroll"
import networkGraphGenerateHref from "../../utils/networkGraphGenerateHref"

import networkGraphConnectionProperties from "../../constants/networkGraphConnectionProperties"
import networkGraphFilterMenu from "../../constants/networkGraphFilterMenu"

import { getFilteredData } from "./../../utils/networkGraph"

import NetworkGraphSearchBar from "./../NetworkGraphSearchBar"
import NetworkGraphSidebar from "./../NetworkGraphSidebar"
import NetworkGraphTooltip from "./../NetworkGraphTooltip"
import NetworkGraphResetClickedElement from "./../NetworkGraphResetClickedElement"
import NetworkGraphClickedElementPopup from "./../NetworkGraphClickedElementPopup"

/**
 * @param {boolean} graphIsOpen - Inidicates if the graph popup is open
 * @param {function} setGraphIsOpen - Function to toggle the graphIsOpen value to a true/false value
 * @param {boolean} showBanner - Indicates if the user is shown a banner above the navigation (needed to calc. the height)
 * @returns A component that displays a d3 force graph that shows the relations and connections of all the policies
 */
const NetworkGraph = ({ graphIsOpen, setGraphIsOpen, showBanner }) => {
    /**
     * Locks the vertical scroll when the graph popup is open
     */
    useLockBodyScroll({ modalOpen: graphIsOpen })

    /**
     * Contains the graph data we receive from the API, containing the nodes & links
     */
    const [data, setData] = React.useState([])

    /**
     * Search query to filter the nodes based on the title
     */
    const [searchQuery, setSearchQuery] = React.useState("")

    /**
     * Contain the 'left' and 'top' position variables to pass to the tooltip
     */
    const [variables, setVariables] = React.useState({}) // X and Y positions for the Tooltip

    /**
     * Contains the href link to go to a detail page of a node
     */
    const [href, setHref] = React.useState("#")

    /**
     * Contains the href link to go to a detail page of a node
     */
    const [graphStyles, setGraphStyles] = React.useState({})

    /**
     * The last clicked node
     */
    const [clickedNode, setClickedNode] = React.useState(null)

    /**
     * Set to true when the first init is done
     */
    const [firstInitDone, setFirstInitDone] = React.useState(false)
    const firstInitDoneRef = React.useRef(null)

    React.useEffect(() => {
        firstInitDoneRef.current = firstInitDone
    }, [firstInitDone])

    /**
     * The location is used in order to get the UUID parameter
     */
    const location = useLocation()

    /**
     * History is set to push a custom url when the graph is Open
     */
    const history = useHistory()

    /**
     * Used to get the UUID paramater for detail pages
     */
    const lastLocation = useLastLocation()
    const lastLocationRef = React.useRef(null)

    React.useEffect(() => {
        if (lastLocation && !lastLocationRef.current) {
            lastLocationRef.current = lastLocation.pathname
        }
    }, [lastLocation])

    /**
     * Used to generate the position of verordening articles for the Href
     */
    const [verordeningsStructure, setVerordeningStructure] = React.useState(
        null
    )

    /**
     * Get and set verordeningstructuur in state on Mount
     */
    React.useLayoutEffect(() => {
        axios.get("/verordeningstructuur").then((res) => {
            const vigerendeVerordeningResponse = res.data.find(
                (item) => item.Status === "Vigerend"
            )
            setVerordeningStructure(vigerendeVerordeningResponse)
        })
    }, [])

    /**
     * The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement)
     */
    const d3Container = React.useRef(null)

    /**
     * Reducer for the filters
     * @param {object} state - Contains the current state
     * @param {object} action - Contains the type of action and the data
     */
    const setFiltersReducer = (state, action) => {
        /**
         * @param {array} nodes - Array containing the d3 node objects
         * @returns An object containing all the type on keys and a boolean as value, indicating if the filter is on or off
         */
        const getFiltersFromData = (nodes) => {
            const filterTypes = [] // Contains the types that are present in the nodes
            const filterState = {} // The state we will return in the format {'Beleidskeuze': true}

            const getInitialFilterState = (type) =>
                networkGraphFilterMenu.Visie.includes(type)

            const addNodeType = (type) => {
                filterTypes.push(type)
                filterState[type] = getInitialFilterState(type)
            }

            nodes.forEach((node) =>
                filterTypes.includes(node.Type) ? null : addNodeType(node.Type)
            )

            return filterState
        }

        switch (action.type) {
            case "init":
                return getFiltersFromData(action.data.nodes)

            case "toggleFilter":
                const filterType = action.filterType
                const newState = action.newState
                state[filterType] = newState
                return { ...state }

            default:
                throw new Error("No type declared")
        }
    }

    const [filters, setFilters] = React.useReducer(setFiltersReducer, [])

    /**
     * We use a Ref for the last clicked node in order to preserve it
     * in order to be able to compare it to newly clicked nodes
     */
    const clickedNodeRef = React.useRef(null)

    React.useEffect(() => {
        clickedNodeRef.current = clickedNode
    }, [clickedNode])

    React.useEffect(() => {
        clickedNodeRef.current = null
    }, [graphIsOpen])

    /**
     * Function to add a Hex value and a UUID to each node
     * @param {object} data - Contains the graph data we receive from the API
     */
    const addColorAndUUIDToNodes = (data) => {
        if (!data) return null

        data.nodes.forEach((node) => {
            if (!networkGraphConnectionProperties[node.Type]) {
                console.error(
                    `Node with type ${node.Type} doesn't exist on connection properties`
                )
            }
            node.color = networkGraphConnectionProperties[node.Type].hex
            node.colorLight =
                networkGraphConnectionProperties[node.Type].hexLight
            node.id = node.UUID
        })

        return data
    }

    /**
     * Function to reset state in D3 Graph
     * @returns
     */
    const resetNodes = React.useCallback(() => {
        const svgElement = d3.select(d3Container.current)
        svgElement
            .selectAll("circle")
            .attr("fill", (d) => d.color)
            .attr("r", 7.5)

        svgElement.selectAll("line").attr("stroke-opacity", 0.6)
        setClickedNode(null)
    }, [])

    /** Reset nodes when the user presses the escape key */
    React.useEffect(() => {
        const handleKeyEvent = (e) => {
            if (clickedNode && e.code === "Escape") resetNodes()
        }

        // Bind the event listener
        document.addEventListener("keydown", handleKeyEvent)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleKeyEvent)
        }
    }, [clickedNode, resetNodes])

    /**
     * Function to handle click on a node
     * Sets the style (opacity and circle radius) of the clicked node and the linked nodes
     * @param {object} clickedEl - Contains the node that is clicked
     * @param {object} svgElement - Contains the SVG container in a Selection object
     * @param {array} links - Contains the d3 links
     * @param {boolean} isNotClicked - Contains a boolean if the function is called without a click from the user. This is used to prevent resetting the clicked node state. Normally when a node is clicked a second time we want to reset the clicked node state. We use this value in the function persistOrInitActiveNode().
     * @returns
     */
    const handleNodeClick = React.useCallback(
        (clickedEl, svgElement, links, refresh) => {
            const uuidSource = clickedEl.UUID

            if (!uuidSource) return

            const connectedLinks = links.filter((link) => {
                if (typeof link.target === "string") {
                    return (
                        link.target === uuidSource || link.source === uuidSource
                    )
                } else {
                    return (
                        link.target.UUID === uuidSource ||
                        link.source.UUID === uuidSource
                    )
                }
            })

            svgElement.selectAll("circle").attr("fill", (d) => d.color)
            svgElement.selectAll("line").attr("stroke-opacity", 0)

            const selectCircles = () => {
                svgElement
                    .selectAll("circle")
                    .attr("fill", (d) => d.color)
                    .attr("r", 7.5)
                    .filter((circle) =>
                        connectedLinks.every((e) => {
                            if (typeof e.target === "string") {
                                return (
                                    e.source !== circle.UUID &&
                                    e.target !== circle.UUID
                                )
                            } else {
                                return (
                                    e.source.UUID !== circle.UUID &&
                                    e.target.UUID !== circle.UUID
                                )
                            }
                        })
                    )
                    .attr("fill", (d) => d.colorLight)

                svgElement
                    .selectAll("circle")
                    .filter((circle) => circle.UUID === uuidSource)
                    .attr("fill", (d) => d.color)
                    .attr("r", 10)
            }

            const selectLinks = () => {
                svgElement
                    .selectAll("line")
                    .attr("stroke-opacity", 0.2)
                    .filter(
                        (link) =>
                            link.source.UUID === uuidSource ||
                            link.target.UUID === uuidSource
                    )
                    .attr("stroke-opacity", 0.6)
            }

            if (uuidSource === clickedNodeRef.current?.UUID && !refresh) {
                /**
                 * If the currently clicked node is the same as the previous still active node we reset the state
                 */
                resetNodes()
            } else {
                /**
                 * The user clicked on a new node, so we set this node in the clickedNode state
                 * and update the styles of this and all the connecting nodes
                 */
                selectCircles()
                selectLinks()
                setClickedNode(clickedEl)
            }
        },
        [resetNodes]
    )

    React.useEffect(() => {
        axios
            .get("/graph")
            .then((res) => {
                const data = addColorAndUUIDToNodes(res.data)
                setData(data)
                setFilters({ type: "init", data: data })
            })
            .catch((err) => console.error("error: ", err?.message))
    }, [])

    /**
     * Close popup when the location path changes
     */
    React.useLayoutEffect(() => {
        if (location.pathname !== "/netwerkvisualisatie" && graphIsOpen) {
            setGraphIsOpen(false)
            setFirstInitDone(false)
            lastLocationRef.current = null
            clickedNodeRef.current = null
        }
        if (location.pathname === "/netwerkvisualisatie" && !graphIsOpen)
            setGraphIsOpen(true)
    }, [location.pathname, setGraphIsOpen, graphIsOpen])

    /**
     * When the graph is open we want it to have custom URL
     */
    React.useLayoutEffect(() => {
        if (graphIsOpen) {
            history.push("/netwerkvisualisatie")
        }
    }, [graphIsOpen, history])

    /**
     * Hook to initialize the D3 Graph
     */
    React.useEffect(() => {
        /**
         * Function to initialize the D3 Graph
         * @param {object} data - Contains two properties, links and nodes
         * @param {object} filters - Contains keys with boolean values indicating which types are active
         */
        const initializeD3 = (data, filters) => {
            /**
             * Function to handle the mouseOver event on nodes
             * We update the data (title, subtitle and href) of the tooltip
             * @param {object} d - Contains the node data from the mouseOver event
             * @param {number} i - Contains the index of the node
             */
            const handleMouseOver = (event, d) => {
                const index = d.index
                const nodeElement = d3.selectAll("circle").nodes()[index]

                /**
                 * Updates the tooltips Title, Subtitle and Href
                 */
                const updateTooltipContent = () => {
                    const tooltip = d3.select("#d3-tooltip-network-graph")

                    // Activate display on the tooltip
                    tooltip.style("display", "block")

                    // Set title and type in the element
                    const tooltipTitleEl = document.getElementById(
                        "d3-tooltip-network-graph-title"
                    )
                    const tooltipTypeEl = document.getElementById(
                        "d3-tooltip-network-graph-type"
                    )

                    const singularType =
                        networkGraphConnectionProperties[d.Type]?.singular

                    tooltipTypeEl.innerHTML = singularType
                        ? singularType
                        : d.Type

                    tooltipTitleEl.innerHTML = d.Titel

                    const hrefURL = networkGraphGenerateHref({
                        property: d.Type,
                        UUID: d.id,
                        verordeningsStructure: verordeningsStructure,
                    })

                    setHref(hrefURL)
                }

                /**
                 * Update tooltip X and Y coordinates based on the hovered node element.
                 */
                const updateTooltipCoordinates = () => {
                    setVariables({
                        left: 0,
                        top: 0,
                    })

                    const tooltipEl = document.getElementById(
                        "d3-tooltip-network-graph"
                    )
                    const { x, bottom } = nodeElement.getBoundingClientRect()
                    const tooltipWidth = tooltipEl.offsetWidth
                    const circleWidth = 24
                    const leftPosition = x - tooltipWidth / 2 + circleWidth / 2
                    const bottomPosition = bottom - 65
                    const newVariables = {
                        left: leftPosition,
                        top: bottomPosition,
                    }

                    setVariables(newVariables)
                }

                /**
                 * Updates the tooltips styles (circle radius, position x & y,
                 */
                const updateNodeStyles = () => {
                    const currentRadius = parseInt(
                        nodeElement.getAttribute("r")
                    )

                    /**
                     * Radius is 10 when the nodeElement is clicked.
                     * We want to reset the radius of all the non-clicked nodes.
                     */
                    if (currentRadius !== 10) {
                        nodeElement.setAttribute("r", 8.5)
                    }
                }

                updateTooltipContent()
                updateTooltipCoordinates()
                updateNodeStyles()
            }

            /**
             * Function to handle the mouseOut event on nodes
             * @param {object} d - Contains the node from the mouseOut event
             * @param {number} i - Contains the index of the node
             */
            const handleMouseOut = (event, d) => {
                const index = d.index
                const nodeElement = d3.selectAll("circle").nodes()[index]
                const tooltip = d3.select("#d3-tooltip-network-graph")
                // Reset display property, user can still see it when hovering over it
                tooltip.style("display", "")
                const currentRadius = parseInt(nodeElement.getAttribute("r"))
                // Radius is 10 when the node is clicked
                if (currentRadius !== 10) {
                    nodeElement.setAttribute("r", 7.5)
                }
            }

            /**
             * When we simulate the nodes, we need to define their strength of attracting or repelling each other.
             * The higher the strength, the more they repel each other.
             * The more nodes we have, the stronger our strength need to be in order to create the space for the nodes
             * https://www.d3indepth.com/force-layout/#forcemanybody
             */
            const generateStrength = (nodes) => {
                if (nodes.length > 20) return -150
                if (nodes.length > 10) return -100
                return -30 // Default
            }

            /**
             * Function to initialize or persist the active node when user comes from a detail page.
             * When it initializes we check if the updated location contains an UUID that exists as a node.
             * If it does, we set it as active by calling handleNodeClick
             * We want to persist the active clickedNode when there is a clickedNode in state with a different UUID then the one from the URL.
             * @param {array} nodes - contains the d3 nodes
             * @param {array} links - contains the d3 links
             */
            const persistOrInitActiveNode = (links, nodes) => {
                /**
                 * Check if there is a previous URL with an UUID
                 * @returns {null|string} - if found return string containing the UUID, else return null
                 */
                const getUUIDFromPreviousUrl = () => {
                    if (!lastLocationRef.current) return null

                    const getMatch = () => {
                        if (lastLocationRef.current.includes("verordeningen")) {
                            return matchPath(lastLocationRef.current, {
                                path: `/detail/:slug/:id/:uuid`,
                                exact: true,
                            })
                        } else {
                            return matchPath(lastLocationRef.current, {
                                path: `/detail/:slug/:uuid`,
                                exact: true,
                            })
                        }
                    }

                    let match = getMatch()

                    const uuidFromUrl = match?.params?.uuid
                    if (!uuidFromUrl) return null

                    return uuidFromUrl
                }

                const svgElement = d3.select(d3Container.current)

                if (firstInitDoneRef.current && !clickedNodeRef.current) {
                    /**
                     * There is no previously clickedNode in state that we need to persist
                     * We also already initialized so we can safely return
                     */
                    return
                }

                const uuidFromURL = getUUIDFromPreviousUrl()

                if (!uuidFromURL && clickedNodeRef.current) {
                    handleNodeClick(
                        clickedNodeRef.current,
                        svgElement,
                        links,
                        true
                    )
                } else if (uuidFromURL) {
                    const clickedEl = nodes.find((e) => e.UUID === uuidFromURL)
                    if (!clickedEl) return
                    handleNodeClick(clickedEl, svgElement, links, true)
                }

                setFirstInitDone(true)
            }

            data = cloneDeep(data)

            const [links, nodes] = getFilteredData(data, filters)

            if (
                !links ||
                !nodes ||
                !d3Container.current ||
                !verordeningsStructure
            )
                return

            /**
             * Get current SVG element
             */
            const svgElement = d3.select(d3Container.current)
            svgElement.selectAll("*").remove() // Remove all D3 Nodes

            /**
             * Reset clicked node in State
             */
            setClickedNode(null)

            /**
             * Set viewBox attribute
             */
            const bounding = d3Container.current.getBoundingClientRect()
            svgElement.attr("viewBox", [
                -bounding.width / 2, // Center horizontally
                -bounding.height / 2, // Center vertically
                bounding.width * 1.25,
                bounding.height * 1.15,
            ])

            /**
             * Setup Zoom
             */
            const maxZoom = 0.5
            const minZoom = 15
            const zoomed = (event) => {
                const transformEvent = event.transform
                const newZoom = transformEvent.k
                if (newZoom < maxZoom) return

                const transform = transformEvent.toString()
                svgElement.selectAll("g").attr("transform", transform)
            }
            var zoom = d3
                .zoom()
                .scaleExtent([maxZoom, minZoom])
                .on("zoom", zoomed)

            svgElement.call(zoom).on("dblclick.zoom", null)

            /**
             * Setup the Force Simulation
             * https://github.com/d3/d3-force
             */
            const strength = generateStrength(nodes)
            const simulation = d3
                .forceSimulation(nodes)
                .force(
                    "link",
                    d3.forceLink(links).id((d) => d.id)
                )
                .force("charge", d3.forceManyBody().strength(strength))
                .force("x", d3.forceX())
                .force("y", d3.forceY())

            // Generate Links
            const link = svgElement
                .append("g")
                .attr("data-testid", "test-g-links")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .join("line")
                .attr("stroke-width", (d) => Math.sqrt(d.value))

            // Generate Nodes
            const node = svgElement
                .append("g")
                .attr("data-testid", "test-g-nodes")
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("data-testid", (d) => d.id)
                .attr(
                    "class",
                    "cursor-pointer transition transform ease-in duration-200 scale-100"
                )
                .attr("r", 7.5) // r equals the radius of the circle (node)
                .attr("fill", (d) => d.color)
                .on("mouseover", handleMouseOver)
                .on("mouseout", handleMouseOut)

                .on("click", (event, clickedEl) =>
                    handleNodeClick(clickedEl, svgElement, links)
                )

            persistOrInitActiveNode(links, nodes)

            // Handle updates
            simulation.on("tick", () => {
                link.attr("x1", (d) => d.source.x + 100)
                    .attr("y1", (d) => d.source.y + 100)
                    .attr("x2", (d) => d.target.x + 100)
                    .attr("y2", (d) => d.target.y + 100)

                node.attr("cx", (d) => d.x + 100).attr("cy", (d) => d.y + 100)
            })
        }

        /**
         * Timeout to wait for the transition of the popup to make sure all elements are mounted
         */
        setTimeout(() => {
            if (!graphIsOpen) return
            initializeD3(data, filters)
        }, 250)
    }, [data, graphIsOpen, filters, handleNodeClick, verordeningsStructure])

    /**
     * Update the graph styles to give it the correct height.
     * This changes when the banner that displays the environment the user is in
     */
    React.useEffect(() => {
        if (showBanner) {
            setGraphStyles({ height: "calc(100vh - 73px)", top: "121px" })
        } else {
            setGraphStyles({ height: "calc(100vh - 73px)", top: "73px" })
        }
    }, [showBanner])

    /**
     * Update nodes based on search query
     */
    React.useEffect(() => {
        const svgElement = d3.select(d3Container.current)
        if (searchQuery === "") {
            svgElement.selectAll("circle").attr("fill", (d) => d.color)
        } else {
            svgElement
                .selectAll("circle")
                .attr("fill", (d) => d.color)
                .attr("r", 7.5)
                .filter(
                    (e) =>
                        !e.Titel?.toLowerCase()?.includes(
                            searchQuery.toLowerCase()
                        )
                )
                .attr("fill", (d) => d.colorLight)
        }

        svgElement.selectAll("line").attr("stroke-opacity", 0.6)
        setClickedNode(null)
    }, [searchQuery])

    return (
        <React.Fragment>
            <Transition
                show={graphIsOpen}
                enter="transition ease-out duration-50"
                enterFrom="opacity-0 -translate-y-5"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-50"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-5"
            >
                <div
                    id="popup-menu-graph"
                    className="fixed top-0 left-0 w-full bg-white"
                    style={graphStyles}
                >
                    <div className="container flex h-full mx-auto">
                        <NetworkGraphSidebar
                            setGraphIsOpen={setGraphIsOpen}
                            filters={filters}
                            setFilters={setFilters}
                        />
                        <div className="w-3/4 mt-10">
                            <h2 className="text-xl text-pzh-blue opacity-30">
                                Omgevingsbeleid Provincie Zuid-Holland
                            </h2>
                            <h3 className="py-2 text-3xl text-pzh-blue">
                                Netwerkvisualisatie
                            </h3>
                            <div
                                className="relative mt-2 mb-10 overflow-hidden border rounded-md"
                                id="d3-graph-container"
                                style={{
                                    height: "80%",
                                }}
                            >
                                <div className="absolute w-full p-2">
                                    <NetworkGraphSearchBar
                                        clickedNode={clickedNode}
                                        data={data}
                                        filters={filters}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        handleNodeClick={handleNodeClick}
                                        svgElement={d3.select(
                                            d3Container.current
                                        )}
                                    />
                                </div>
                                <svg
                                    role="img"
                                    className="w-full h-full d3-component"
                                    ref={d3Container}
                                />
                                <NetworkGraphResetClickedElement
                                    resetNodes={resetNodes}
                                    clickedNode={clickedNode}
                                />
                                <NetworkGraphClickedElementPopup
                                    clickedNode={clickedNode}
                                    setGraphIsOpen={setGraphIsOpen}
                                    resetNodes={resetNodes}
                                    verordeningsStructure={
                                        verordeningsStructure
                                    }
                                />
                            </div>
                        </div>
                        <NetworkGraphTooltip
                            href={href}
                            variables={variables}
                            setGraphIsOpen={setGraphIsOpen}
                        />
                    </div>
                </div>
            </Transition>
        </React.Fragment>
    )
}

export default NetworkGraph
