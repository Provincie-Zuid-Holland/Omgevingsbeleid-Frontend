import React from 'react'
import { Transition } from '@headlessui/react'
import * as d3 from 'd3'
import { Link, useLocation, matchPath } from 'react-router-dom'
import {
    faTimes,
    faChartNetwork,
    faUndo,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useLockBodyScroll from './../../utils/useLockBodyScroll'

import axios from './../../API/axios'
import cloneDeep from 'lodash.clonedeep'

/**
 * Used to build up the menu where a user can filter nodes based on the type.
 * The key is the sub title of the menu. The values are the filterable types.
 */
const filterMenu = {
    Visie: ['ambities', 'beleidsdoelen', 'beleidskeuzes', 'beleidsprestaties'],
    Omgevingsprogramma: ['maatregelen'],
    Uitvoering: ['verordeningen', 'beleidsregels'],
    Overig: ['themas', 'belangen'],
}

/**
 * Contains the Hex, Singular, Plural and the Singular Prefix values for the different node types
 */
const connectionProperties = {
    ambities: {
        hex: '#aa0067',
        singular: 'Ambitie',
        plural: 'Ambities',
        prefix: 'de',
    },
    belangen: {
        hex: '#ff6b02',
        singular: 'Belang',
        plural: 'Belangen',
        prefix: 'het',
    },
    beleidsregels: {
        hex: '#76bc21',
        singular: 'Beleidsregel',
        plural: 'Beleidsregels',
        prefix: 'de',
    },
    beleidsprestaties: {
        hex: '#ecc94b',
        singular: 'Beleidsprestatie',
        plural: 'Beleidsprestaties',
        prefix: 'de',
    },
    maatregelen: {
        hex: '#503d90',
        singular: 'Maatregel',
        plural: 'Maatregelen',
        prefix: 'de',
    },
    beleidsdoelen: {
        hex: '#3182ce',
        singular: 'beleidsdoel',
        plural: 'Beleidsdoelen',
        prefix: 'het',
    },
    themas: {
        hex: '#847062',
        singular: 'Thema',
        plural: "Thema's",
        prefix: 'het',
    },
    verordeningen: {
        hex: '#eb7085',
        singular: 'Verordening',
        plural: 'Verordeningsartikelen',
        prefix: 'de',
    },
    beleidskeuzes: {
        hex: '#7badde',
        singular: 'Beleidskeuze',
        plural: 'Beleidskeuzes',
        prefix: 'de',
    },
}

/**
 * Component that renders the GraphPopupMenu component that displays a button to to show/hide the graph component.
 *
 * @component
 *
 * @param {boolean} graphIsOpen - Parameter to show/hide the graph component
 * @param {function} setGraphIsOpen - Function to edit parent state
 * @param {boolean} showBanner - Parameter to set the height and position of the popup-menu div.
 */
const GraphPopupMenu = ({ graphIsOpen, setGraphIsOpen, showBanner }) => {
    /**
     * Locks the vertical scroll when the graph popup is open
     */
    useLockBodyScroll({ modalOpen: graphIsOpen })

    /**
     * Contains the graph data we receive from the API, containing the nodes & links
     */
    const [data, setData] = React.useState([])

    /**
     * Contain the 'left' and 'top' position variables to pass to the tooltip
     */
    const [variables, setVariables] = React.useState({}) // X and Y positions for the Tooltip

    /**
     * Contains the href link to go to a detail page of a node
     */
    const [href, setHref] = React.useState('#')

    /**
     * The last clicked nod
     */
    const [clickedNode, setClickedNode] = React.useState(null)

    /**
     * The location is used
     */
    const location = useLocation()

    /**
     * The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement)
     */
    const d3Container = React.useRef(null)

    const setFiltersReducer = (state, action) => {
        const getFiltersFromData = (nodes) => {
            const filterTypes = [] // Contains the types that are present in the nodes
            const filterState = {} // The state we will return in the format {'Beleidskeuze': true}

            const getInitialFilterState = (type) =>
                filterMenu.Visie.includes(type)

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
            case 'init':
                return getFiltersFromData(action.data.nodes)

            case 'toggleFilter':
                const filterType = action.filterType
                const newState = action.newState
                state[filterType] = newState
                return { ...state }

            default:
                throw new Error('No type declared')
        }
    }

    const [filters, setFilters] = React.useReducer(setFiltersReducer, [])

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
            if (!connectionProperties[node.Type]) {
                console.error(
                    `Node with type ${node.Type} doesn't exist on connection properties`
                )
            }
            node.color = connectionProperties[node.Type].hex
            node.id = node.UUID
        })

        return data
    }

    /**
     * Function to reset state in D3 Graph
     * @returns
     */
    const resetNodes = () => {
        const svgElement = d3.select(d3Container.current)
        svgElement.selectAll('circle').attr('opacity', 1).attr('r', 7.5)
        setClickedNode(null)
    }

    /**
     * Function to handle click on a node
     * Sets the style (opacity and circle radius) of the clicked node and the linked nodes
     * @param {object} clickedEl - Contains the node that is clicked
     * @param {object} svgElement - Contains the SVG container in a Selection object
     * @param {array} links - Contains the d3 links
     * @returns
     */
    const handleNodeClick = (clickedEl, svgElement, links) => {
        const uuidSource = clickedEl.UUID
        if (!uuidSource) return

        if (uuidSource === clickedNodeRef.current?.UUID) {
            /**
             * If the currently clicked node is the same as the previous still active node we reset the state
             */

            resetNodes()
        } else {
            /**
             * The user clicked on a new node, so we set this node in the clickedNode state
             * and update the styles of this and all the connecting nodes
             */

            const connectedLinks = links.filter(
                (link) =>
                    link.target.UUID === uuidSource ||
                    link.source.UUID === uuidSource
            )

            svgElement
                .selectAll('circle')
                .attr('opacity', 1)
                .filter((circle) =>
                    connectedLinks.every(
                        (e) =>
                            e.source.UUID !== circle.UUID &&
                            e.target.UUID !== circle.UUID
                    )
                )
                .attr('opacity', 0.25)

            svgElement
                .selectAll('circle')
                .filter((circle) => circle.UUID === uuidSource)
                .attr('opacity', 1)
                .attr('r', 10)

            setClickedNode(clickedEl)
        }
    }

    React.useEffect(() => {
        axios
            .get('/graph')
            .then((res) => {
                const data = addColorAndUUIDToNodes(res.data)
                setData(data)
                setFilters({ type: 'init', data: data })
            })
            .catch((err) => console.error('error: ', err?.message))
    }, [])

    /**
     * Function to filter out the inactive types from the links and the nodes
     * @param {object} data - Contains two properties, links and nodes
     * @param {object} filters - Contains keys with boolean values indicating which types are active
     * @returns {object[]} - Returns the filtered [links, nodes]
     */
    const getFilteredData = (data, filters) => {
        const links = data.links
        const nodes = data.nodes

        if (!links || !nodes) return [null, null]

        const activeTypes = Object.keys(filters).filter((key) => filters[key])

        /**
         * Contains the UUIDs of nodes that are not active.
         * Used to filter out Links to/from inactive nodes
         */
        const inactiveNodes = []

        // const filteredLinks = links.filter(link => )
        const filteredNodes = nodes.filter((node) => {
            const nodeIsActive = activeTypes.includes(node.Type)
            if (!nodeIsActive) inactiveNodes.push(node.UUID)
            return nodeIsActive
        })

        const filteredLinks = links.filter((link) => {
            const linkIsActive =
                !inactiveNodes.includes(link.source) &&
                !inactiveNodes.includes(link.target)
            return linkIsActive
        })

        return [filteredLinks, filteredNodes]
    }

    /**
     * Function to check if the updated location contains a UUID that exists as a node.
     * If it does, we set it as as active by calling handleNodeClick
     * @param {array} links - contains the links
     * @param {array} nodes - contains the nodes
     */
    const updateActiveNodeBasedOnURL = (links, nodes) => {
        let match = matchPath(location.pathname, {
            path: `/detail/:slug/:uuid`,
            exact: true,
        })

        const uuidFromUrl = match?.params?.uuid
        if (!uuidFromUrl) return

        const svgElement = d3.select(d3Container.current)
        const clickedEl = nodes.find((e) => e.UUID === uuidFromUrl)

        if (!clickedEl) return

        handleNodeClick(clickedEl, svgElement, links)
    }

    /* The useEffect Hook is for running side effects outside of React,
          for instance inserting elements into the DOM using D3 */
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
            const handleMouseOver = (d, i) => {
                const nodeElement = d3.selectAll('circle').nodes()[i]

                /**
                 * Updates the tooltips Title, Subtitle and Href
                 */
                const updateNodeData = () => {
                    const tooltip = d3.select('#d3-tooltip-network-graph')
                    // Activate display on the tooltip
                    tooltip.style('display', 'block')

                    // Set title and type in the element
                    const tooltipTitleEl = document.getElementById(
                        'd3-tooltip-network-graph-title'
                    )
                    const tooltipTypeEl = document.getElementById(
                        'd3-tooltip-network-graph-type'
                    )
                    tooltipTitleEl.innerHTML = d.Titel
                    const singularType = connectionProperties[d.Type]?.singular
                    tooltipTypeEl.innerHTML = singularType
                        ? singularType
                        : d.Type

                    const hrefURL = generateHref({
                        property: d.Type,
                        UUID: d.id,
                    })

                    setHref(hrefURL)
                }

                /**
                 * Updates the tooltips styles (circle radius, position x & y,
                 */
                const updateNodeStyles = () => {
                    const currentRadius = parseInt(
                        nodeElement.getAttribute('r')
                    )
                    // Radius is 10 when the nodeElement is clicked
                    if (currentRadius !== 10) {
                        nodeElement.setAttribute('r', 8.5)
                    }

                    /**
                     * Reset position
                     */
                    setVariables({
                        left: 0,
                        top: 0,
                    })

                    const tooltipEl = document.getElementById(
                        'd3-tooltip-network-graph'
                    )
                    const popupMenuGraph =
                        document.getElementById('d3-graph-container')
                    const { x, bottom } = nodeElement.getBoundingClientRect()
                    const graphContainerBounding =
                        popupMenuGraph.getBoundingClientRect()
                    const tooltipWidth = tooltipEl.offsetWidth
                    const circleWidth = 24

                    setVariables({
                        left: x - tooltipWidth / 2 + circleWidth / 2 - 5, //Center tooltip in the middle
                        top: bottom - graphContainerBounding.top + 60,
                        // top: bottom - tooltipHeight + 16,
                    })
                }

                updateNodeData()
                updateNodeStyles()
            }

            /**
             * Function to handle the mouseOut event on nodes
             * @param {object} d - Contains the node from the mouseOut event
             * @param {number} i - Contains the index of the node
             */
            const handleMouseOut = (d, i) => {
                const nodeElement = d3.selectAll('circle').nodes()[i]
                const tooltip = d3.select('#d3-tooltip-network-graph')
                // Reset display property, user can still see it when hovering over it
                tooltip.style('display', '')
                const currentRadius = parseInt(nodeElement.getAttribute('r'))
                // Radius is 10 when the node is clicked
                if (currentRadius !== 10) {
                    nodeElement.setAttribute('r', 7.5)
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

            data = cloneDeep(data)

            const [links, nodes] = getFilteredData(data, filters)

            if (!links || !nodes) return

            /**
             * Get current SVG element
             */
            const svgElement = d3.select(d3Container.current)
            svgElement.selectAll('*').remove()

            /**
             * Set viewBox attribute
             */
            const bounding = d3Container.current.getBoundingClientRect()
            svgElement
                .attr('viewBox', [
                    -bounding.width / 2, // Center horizontally
                    -bounding.height / 2,
                    bounding.width * 1.25,
                    bounding.height * 1.15,
                ])
                .style('transform-origin', '50% 50% 0')

            // svgElement.call(
            //     d3.zoom().on('zoom', function () {
            //         svgElement.attr('transform', d3.event.transform)
            //     }),
            //     d3.zoomIdentity.scale(0.5)
            // )

            const strength = generateStrength(nodes)

            /**
             * Generate the simulation with d3-force https://github.com/d3/d3-force
             */
            const simulation = d3
                .forceSimulation(nodes)
                .force(
                    'link',
                    d3.forceLink(links).id((d) => d.id)
                )
                .force('charge', d3.forceManyBody().strength(strength))
                .force('x', d3.forceX())
                .force('y', d3.forceY())

            // Generate Links
            const link = svgElement
                .append('g')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .selectAll('line')
                .data(links)
                .join('line')
                .attr('stroke-width', (d) => Math.sqrt(d.value))

            // Generate Nodes
            const node = svgElement
                .append('g')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1.5)
                .selectAll('circle')
                .data(nodes)
                .join('circle')
                .attr(
                    'class',
                    'cursor-pointer transition transform ease-in duration-200 scale-100'
                )
                .attr('r', 7.5) // r equals the radius of the circle (node)
                .attr('fill', (d) => d.color)
                .on('mouseover', handleMouseOver)
                .on('mouseout', handleMouseOut)
                .on('click', (clickedEl) =>
                    handleNodeClick(clickedEl, svgElement, links)
                )

            updateActiveNodeBasedOnURL(links, nodes)

            // Update
            simulation.on('tick', () => {
                link.attr('x1', (d) => d.source.x + 100)
                    .attr('y1', (d) => d.source.y + 100)
                    .attr('x2', (d) => d.target.x + 100)
                    .attr('y2', (d) => d.target.y + 100)

                node.attr('cx', (d) => d.x + 100).attr('cy', (d) => d.y + 100)
            })
        }

        // Timeout to wait for the transition of the popup
        setTimeout(() => {
            if (!graphIsOpen) return
            initializeD3(data, filters)
        }, 250)
    }, [graphIsOpen, data, filters])

    // Event listener for closing the modal with the Escape key
    React.useEffect(() => {
        function closeOnEscape(e) {
            if (e.key === 'Escape') {
                setGraphIsOpen(false)
            }
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [setGraphIsOpen])

    return (
        <React.Fragment>
            <button
                id="popup-menu-toggle"
                className="flex items-center justify-center px-2 py-2 text-gray-800 transition-colors duration-100 ease-in rounded hover:bg-gray-100 hover:text-gray-900"
                aria-expanded={graphIsOpen}
                onClick={() => setGraphIsOpen(!graphIsOpen)}
            >
                <FontAwesomeIcon
                    className="mx-1"
                    icon={graphIsOpen ? faTimes : faChartNetwork}
                />
            </button>
            <Transition
                show={graphIsOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-5"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-5"
            >
                <div
                    id="popup-menu-graph"
                    className="fixed top-0 left-0 w-full bg-white"
                    style={
                        showBanner
                            ? {
                                  height: 'calc(100vh - 73px)',
                                  top: '121px',
                              }
                            : {
                                  height: 'calc(100vh - 73px)',
                                  top: '73px',
                              }
                    }
                >
                    <div className="container flex h-full mx-auto">
                        <div className="w-1/4 pl-6 my-10">
                            <h2 className="text-lg text-bold text-pzh-blue">
                                Filters
                            </h2>
                            {Object.keys(filterMenu).map((filterSection) => {
                                return (
                                    <div className="mt-4">
                                        <span className="font-bold text-pzh-blue-dark">
                                            {filterSection}
                                        </span>
                                        <ul>
                                            {Object.keys(filters)
                                                .filter((e) =>
                                                    filterMenu[
                                                        filterSection
                                                    ].includes(e)
                                                )
                                                .sort()
                                                .map((filterKey) => {
                                                    return (
                                                        <li
                                                            onClick={() => {
                                                                setFilters({
                                                                    type: 'toggleFilter',
                                                                    filterType:
                                                                        filterKey,
                                                                    newState:
                                                                        !filters[
                                                                            filterKey
                                                                        ],
                                                                })
                                                            }}
                                                            className="cursor-pointer hover:text-gray-900"
                                                            key={filterKey}
                                                        >
                                                            <input
                                                                className="mr-2 leading-tight"
                                                                type="checkbox"
                                                                checked={
                                                                    filters[
                                                                        filterKey
                                                                    ]
                                                                }
                                                                name={filterKey}
                                                            />
                                                            {
                                                                connectionProperties[
                                                                    filterKey
                                                                ]?.plural
                                                            }
                                                            <span
                                                                className="inline-block w-2 h-2 ml-2 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        connectionProperties[
                                                                            filterKey
                                                                        ]?.hex,
                                                                }}
                                                            />
                                                        </li>
                                                    )
                                                })}
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                        <div
                            className="w-3/4 my-10 overflow-hidden border rounded-md"
                            id="d3-graph-container"
                        >
                            <svg
                                className="w-full h-full d3-component"
                                ref={d3Container}
                            />
                            <div
                                id="d3-tooltip-network-graph"
                                style={{
                                    left: variables.left,
                                    top: variables.top,
                                }}
                                class="absolute hidden z-50 hover:block bg-white shadow-md rounded px-4 py-2"
                            >
                                <Link
                                    onClick={() => setGraphIsOpen(false)}
                                    to={href}
                                    className="group"
                                >
                                    <div
                                        id="d3-tooltip-network-graph-type"
                                        class={`text-gray-600`}
                                    />
                                    <div
                                        id="d3-tooltip-network-graph-title"
                                        class={`text-pzh-blue-dark group-hover:underline `}
                                    />
                                </Link>
                            </div>
                        </div>
                        <ClickedElementPopup
                            clickedNode={clickedNode}
                            setGraphIsOpen={setGraphIsOpen}
                        />
                        <ResetClickedElement
                            resetNodes={resetNodes}
                            clickedNode={clickedNode}
                        />
                    </div>
                </div>
            </Transition>
        </React.Fragment>
    )
}

/**
 *
 * @param {object} props
 * @param {object} clickedNode - The corresponding node that has been clicked
 * @param {object} setGraphIsOpen - Function to open and close the graph popup menu
 * @returns Component that indicates what element has been clicked, with a link to the detail page
 */
const ClickedElementPopup = ({ clickedNode, setGraphIsOpen }) => {
    const [localOpenState, setLocalOpenState] = React.useState(false)

    React.useEffect(() => {
        if (!clickedNode) {
            setLocalOpenState(false)
        } else {
            setLocalOpenState(true)
        }
    }, [clickedNode])

    const title = clickedNode?.Titel
    const type = clickedNode?.Type
    const singularTitle = connectionProperties[type]?.singular
    const singularTitlePrefix = connectionProperties[type]?.prefix
    const href = generateHref({ property: type, UUID: clickedNode?.UUID })

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="container relative flex h-full mx-auto">
                <div className="absolute bottom-0 right-0 mb-12 mr-2">
                    <Transition
                        show={localOpenState}
                        enter="transition ease-out duration-150 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-0 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="relative py-2 pr-5 text-lg bg-white shadow-md pointer-events-auto rouned">
                            <Link
                                className="block p-3 pt-0 group"
                                to={href}
                                onClick={() => setGraphIsOpen(false)}
                            >
                                <span class="text-gray-600 block">{type}</span>
                                <span class="block text-pzh-blue-dark">
                                    {title}
                                </span>
                                <span className="group-hover:underline">
                                    {singularTitle && singularTitlePrefix
                                        ? `Bekijk ${singularTitlePrefix} ${singularTitle}`
                                        : `Bekijk dit object`}
                                </span>
                            </Link>
                            <span
                                onClick={() => {
                                    setLocalOpenState(false)
                                }}
                                className="absolute top-0 right-0 flex items-center px-2 py-1 mx-1 mt-2 mr-1 rounded-md cursor-pointer hover:bg-gray-200"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    )
}

/**
 *
 * @param {object} props
 * @param {object} clickedNode - The corresponding node that has been clicked
 * @returns Component that indicates what element has been clicked, with a link to the detail page
 */
const ResetClickedElement = ({ clickedNode, resetNodes }) => {
    const [localOpenState, setLocalOpenState] = React.useState(false)

    React.useEffect(() => {
        if (!clickedNode) {
            setLocalOpenState(false)
        } else {
            setLocalOpenState(true)
        }
    }, [clickedNode])

    return (
        <div className="absolute top-0 left-0 w-full h-full my-10 pointer-events-none">
            <div className="container relative flex h-full mx-auto">
                <div className="absolute top-0 right-0 mt-2 mr-2">
                    <Transition
                        show={localOpenState}
                        enter="transition ease-out duration-150 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-0 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            onClick={() => resetNodes()}
                            className="relative flex items-center justify-center px-2 py-2 mt-0 text-lg transition-shadow duration-100 ease-in bg-white rounded shadow-md cursor-pointer pointer-events-auto hover:shadow-lg"
                        >
                            <FontAwesomeIcon icon={faUndo} />
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    )
}

export default GraphPopupMenu
