import { Minus, Plus } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'
import * as d3 from 'd3'
import cloneDeep from 'lodash.clonedeep'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { matchPath, useLocation } from 'react-router-dom'

import { graph } from '@/api/fetchers'
import { GraphView, NodeItem } from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import networkGraphFilterMenu from '@/constants/networkGraphFilterMenu'
import usePage from '@/hooks/usePage'
import hideBannerLocalStorage from '@/utils/hideBannerLocalStorage'
import { getFilteredData } from '@/utils/networkGraph'
import networkGraphGenerateHref from '@/utils/networkGraphGenerateHref'

import NetworkGraphClickedElementPopup from '../NetworkGraphClickedElementPopup'
import NetworkGraphResetClickedElement from '../NetworkGraphResetClickedElement'
import NetworkGraphSearchBar from '../NetworkGraphSearchBar'
import NetworkGraphSidebar from '../NetworkGraphSidebar'
import NetworkGraphTooltip from '../NetworkGraphTooltip'

const NetworkGraph = () => {
    /**
     * Search query to filter the nodes based on the title
     */
    const [searchQuery, setSearchQuery] = useState('')

    /**
     * Contain the 'left' and 'top' position variables to pass to the tooltip
     */
    const [variables, setVariables] = useState<{
        left: number
        top: number
    }>({ left: 0, top: 0 }) // X and Y positions for the Tooltip

    /**
     * Contains the href link to go to a detail page of a node
     */
    const [href, setHref] = useState<string | null>('#')

    /**
     * Contains the href link to go to a detail page of a node
     */
    const [graphStyles, setGraphStyles] = useState({})

    /**
     * The last clicked node
     */
    const [clickedNode, setClickedNode] = useState(null)

    /**
     * Set to true when the first init is done
     */
    const [firstInitDone, setFirstInitDone] = useState(false)
    const firstInitDoneRef = useRef<boolean | null>(null)

    useEffect(() => {
        firstInitDoneRef.current = firstInitDone
    }, [firstInitDone])

    /**
     * Used to get the UUID paramater for detail pages
     */
    const { state } = useLocation()
    const lastLocation = (state as any)?.from

    const userIsInMuteerEnvironment = usePage('/muteer/')
    const showBanner = userIsInMuteerEnvironment && !hideBannerLocalStorage()

    const { data: verordeningsStructure } = useQuery(
        ['/verordeningstructuur'],
        () =>
            axios
                .get('/v0.1/verordeningstructuur')
                .then(res =>
                    res.data.find(
                        (item: { Status: string }) => item.Status === 'Vigerend'
                    )
                ),
        { refetchOnMount: true, staleTime: 0 }
    )

    const {
        isInitialLoading: isLoading,
        data,
        isFetching,
    } = useQuery(
        ['/graph'],
        () =>
            graph().then(data => {
                const transformedData = addColorAndUUIDToNodes(data)
                setFilters({ type: 'init', data: transformedData })
                return transformedData
            }),
        { refetchOnMount: true, staleTime: 0 }
    )

    /**
     * The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement)
     */
    const d3Container = useRef<SVGElement | null>(null)

    /**
     * Reducer for the filters
     * @param {object} state - Contains the current state
     * @param {object} action - Contains the type of action and the data
     */
    const setFiltersReducer = (state: any, action: any) => {
        /**
         * @param {array} nodes - Array containing the d3 node objects
         * @returns An object containing all the type on keys and a boolean as value, indicating if the filter is on or off
         */
        const getFiltersFromData = (nodes: { Type: string }[]) => {
            const filterTypes: string[] = [] // Contains the types that are present in the nodes
            const filterState: { [key: string]: any } = {} // The state we will return in the format {'Beleidskeuze': true}

            const getInitialFilterState = (type: string) =>
                networkGraphFilterMenu.Visie.includes(type)

            const addNodeType = (type: string) => {
                filterTypes.push(type)
                filterState[type] = getInitialFilterState(type)
            }

            nodes.forEach(node =>
                filterTypes.includes(node.Type) ? null : addNodeType(node.Type)
            )

            if (lastLocation?.includes('verordening')) {
                filterState.verordeningen = true
            }

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

    const [filters, setFilters] = useReducer(setFiltersReducer, [])

    /**
     * We use a Ref for the last clicked node in order to preserve it
     * in order to be able to compare it to newly clicked nodes
     */
    const clickedNodeRef = useRef<any>(null)

    useEffect(() => {
        clickedNodeRef.current = clickedNode
    }, [clickedNode])

    /**
     * Function to add a Hex value and a UUID to each node
     * @param {object} data - Contains the graph data we receive from the API
     */
    const addColorAndUUIDToNodes = (data: GraphView) => {
        if (!data) return null

        data.nodes?.forEach((node: NodeItem & { [key: string]: any }) => {
            const nodeType =
                node.Type as keyof typeof networkGraphConnectionProperties

            if (!networkGraphConnectionProperties[nodeType]) {
                console.error(
                    `Node with type ${node.Type} doesn't exist on connection properties`
                )
            }

            node.color = networkGraphConnectionProperties[nodeType].hex
            node.colorLight =
                networkGraphConnectionProperties[nodeType].hexLight
            node.id = node.UUID
        })

        return data
    }

    /**
     * Function to reset state in D3 Graph
     * @returns {void}
     */
    const resetNodes = useCallback(() => {
        const svgElement = d3.select(d3Container.current)
        svgElement
            .selectAll('circle')
            .attr('fill', (d: any) => d.color)
            .attr('r', 7.5)

        svgElement.selectAll('line').attr('stroke-opacity', 0.6)
        setClickedNode(null)
    }, [])

    /** Reset nodes when the user presses the escape key */
    useEffect(() => {
        const handleKeyEvent = (e: KeyboardEvent) => {
            if (clickedNode && e.code === 'Escape') resetNodes()
        }

        // Bind the event listener
        document.addEventListener('keydown', handleKeyEvent)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('keydown', handleKeyEvent)
        }
    }, [clickedNode, resetNodes])

    /**
     * Function to handle click on a node
     * Sets the style (opacity and circle radius) of the clicked node and the linked nodes
     * @param {object} clickedEl - Contains the node that is clicked
     * @param {object} svgElement - Contains the SVG container in a Selection object
     * @param {array} links - Contains the d3 links
     * @param {boolean} isNotClicked - Contains a boolean if the function is called without a click from the user. This is used to prevent resetting the clicked node state. Normally when a node is clicked a second time we want to reset the clicked node state. We use this value in the function persistOrInitActiveNode().
     * @returns {void}
     */
    const handleNodeClick = useCallback(
        (clickedEl, svgElement, links, refresh?: any) => {
            const uuidSource = clickedEl.UUID

            if (!uuidSource) return

            const connectedLinks = links.filter((link: any) => {
                if (typeof link.target === 'string') {
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

            svgElement.selectAll('circle').attr('fill', (d: any) => d.color)
            svgElement.selectAll('line').attr('stroke-opacity', 0)

            const selectCircles = () => {
                svgElement
                    .selectAll('circle')
                    .attr('fill', (d: any) => d.color)
                    .attr('r', 7.5)
                    .filter((circle: any) =>
                        connectedLinks.every((e: any) => {
                            if (typeof e.target === 'string') {
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
                    .attr('fill', (d: any) => d.colorLight)

                svgElement
                    .selectAll('circle')
                    .filter((circle: any) => circle.UUID === uuidSource)
                    .attr('fill', (d: any) => d.color)
                    .attr('r', 10)
            }

            const selectLinks = () => {
                svgElement
                    .selectAll('line')
                    .attr('stroke-opacity', 0.2)
                    .filter(
                        (link: any) =>
                            link.source.UUID === uuidSource ||
                            link.target.UUID === uuidSource
                    )
                    .attr('stroke-opacity', 0.6)
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

    /**
     * Hook to initialize the D3 Graph
     */
    useEffect(() => {
        /**
         * Function to initialize the D3 Graph
         * @param {object} data - Contains two properties, links and nodes
         * @param {object} filters - Contains keys with boolean values indicating which types are active
         */
        const initializeD3 = (data: any, filters: any) => {
            /**
             * Function to handle the mouseOver event on nodes
             * We update the data (title, subtitle and href) of the tooltip
             * @param {object} d - Contains the node data from the mouseOver event
             * @param {number} i - Contains the index of the node
             */
            const handleMouseOver = (
                _: any,
                d: {
                    Type: keyof typeof networkGraphConnectionProperties
                    Titel: string
                    index: number
                    id: string
                }
            ) => {
                const index = d.index
                const nodeElement = d3.selectAll('circle').nodes()[
                    index
                ] as Element

                /**
                 * Updates the tooltips Title, Subtitle and Href
                 */
                const updateTooltipContent = () => {
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

                    const singularType =
                        networkGraphConnectionProperties[d.Type]?.singular

                    tooltipTypeEl!.innerHTML = singularType
                        ? singularType
                        : d.Type

                    tooltipTitleEl!.innerHTML = d.Titel

                    const hrefURL = networkGraphGenerateHref({
                        property: d.Type,
                        UUID: d.id,
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
                        'd3-tooltip-network-graph'
                    )
                    const {
                        x: nodeXPosition,
                        y: nodeYPosition,
                        right: nodeRightPosition,
                    } = nodeElement?.getBoundingClientRect()
                    const tooltipWidth = tooltipEl?.offsetWidth || 0
                    const tooltipHeight = tooltipEl?.offsetHeight || 0
                    const tooltipBottomMargin = 10
                    const nodeWidth = nodeRightPosition - nodeXPosition
                    const relativePositionOffset = 96
                    const leftPosition = Math.round(
                        nodeXPosition - tooltipWidth / 2 + nodeWidth / 2
                    )
                    const topPosition = Math.round(
                        nodeYPosition -
                            relativePositionOffset -
                            tooltipHeight -
                            tooltipBottomMargin
                    )

                    const newVariables = {
                        left: leftPosition,
                        top: topPosition,
                    }

                    setVariables(newVariables)
                }

                /**
                 * Updates the tooltips styles (circle radius, position x & y,
                 */
                const updateNodeStyles = () => {
                    const currentRadius = parseInt(
                        nodeElement.getAttribute('r') as string
                    )

                    /**
                     * Radius is 10 when the nodeElement is clicked.
                     * We want to reset the radius of all the non-clicked nodes.
                     */
                    if (currentRadius !== 10) {
                        nodeElement.setAttribute('r', '8.5')
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
            const handleMouseOut = (_: any, d: any) => {
                const index = d.index
                const nodeElement = d3.selectAll('circle').nodes()[
                    index
                ] as Element
                const tooltip = d3.select('#d3-tooltip-network-graph')
                // Reset display property, user can still see it when hovering over it
                tooltip.style('display', '')
                const currentRadius = parseInt(
                    nodeElement?.getAttribute('r') || ''
                )
                // Radius is 10 when the node is clicked
                if (currentRadius !== 10) {
                    nodeElement.setAttribute('r', '7.5')
                }
            }

            /**
             * When we simulate the nodes, we need to define their strength of attracting or repelling each other.
             * The higher the strength, the more they repel each other.
             * The more nodes we have, the stronger our strength need to be in order to create the space for the nodes
             * https://www.d3indepth.com/force-layout/#forcemanybody
             */
            const generateStrength = (nodes: any) => {
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
            const persistOrInitActiveNode = (links: any, nodes: any) => {
                /**
                 * Check if there is a previous URL with an UUID
                 * @returns {null|string} - if found return string containing the UUID, else return null
                 */
                const getUUIDFromPreviousUrl = () => {
                    if (!lastLocation) return null

                    const getMatch = () => {
                        if (lastLocation?.includes('verordening')) {
                            const activeUUID = lastLocation.split('actief=')[1]

                            return {
                                params: { uuid: activeUUID },
                            }
                        } else {
                            return matchPath('/:slug/:uuid', lastLocation)
                        }
                    }

                    const match = getMatch()

                    const uuidFromUrl = (match?.params as any)?.uuid
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
                    const clickedEl = nodes.find(
                        (e: any) => e.UUID === uuidFromURL
                    )
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
            svgElement.selectAll('*').remove() // Remove all D3 Nodes

            /**
             * Reset clicked node in State
             */
            setClickedNode(null)

            /**
             * Set viewBox attribute
             */
            const bounding = d3Container.current.getBoundingClientRect()
            svgElement.attr('viewBox', [
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
            const zoomed = (event: any) => {
                svgElement.selectAll('g').attr('transform', event.transform)
            }
            const zoom: any = d3
                .zoom()
                .scaleExtent([maxZoom, minZoom])
                .translateExtent([
                    [-1000, -1000],
                    [1000, 1000],
                ])
                .on('zoom', zoomed)
            svgElement.call(zoom).on('dblclick.zoom', null)

            /**
             * Setup the Force Simulation
             * https://github.com/d3/d3-force
             */
            const strength = generateStrength(nodes)
            const simulation = d3
                .forceSimulation(nodes as any)
                .force(
                    'link',
                    d3.forceLink(links as any).id((d: any) => d.id)
                )
                .force('charge', d3.forceManyBody().strength(strength))
                .force('x', d3.forceX())
                .force('y', d3.forceY())

            // Generate Links
            const link = svgElement
                .append('g')
                .attr('data-testid', 'test-g-links')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .selectAll('line')
                .data(links)
                .join('line')
                .attr('stroke-width', (d: any) => Math.sqrt(d.value))

            // Generate Nodes
            const node = svgElement
                .append('g')
                .attr('data-testid', 'test-g-nodes')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1.5)
                .selectAll('circle')
                .data(nodes)
                .join('circle')
                .attr('data-testid', (d: SVGCircleElement) => d.id)
                .attr(
                    'class',
                    'cursor-pointer transition transform ease-in duration-200 scale-100'
                )
                .attr('r', 7.5) // r equals the radius of the circle (node)
                .attr('fill', (d: any) => d.color)
                .on('mouseover', handleMouseOver as any)
                .on('mouseout', handleMouseOut)

                .on('click', (_, clickedEl) =>
                    handleNodeClick(clickedEl, svgElement, links)
                )

            d3.select('#d3-zoom-in').on('click', function () {
                zoom.scaleBy(svgElement.transition().duration(750), 1.4)
            })
            d3.select('#d3-zoom-out').on('click', function () {
                zoom.scaleBy(svgElement.transition().duration(750), 0.6)
            })

            persistOrInitActiveNode(links, nodes)

            // Handle updates
            simulation.on('tick', () => {
                link.attr('x1', (d: any) => d.source.x + 100)
                    .attr('y1', (d: any) => d.source.y + 100)
                    .attr('x2', (d: any) => d.target.x + 100)
                    .attr('y2', (d: any) => d.target.y + 100)

                node.attr('cx', (d: any) => d.x + 100).attr(
                    'cy',
                    (d: any) => d.y + 100
                )
            })
        }

        /**
         * Timeout to wait for the transition of the popup to make sure all elements are mounted
         */
        setTimeout(() => {
            initializeD3(data, filters)
        }, 250)
    }, [data, filters, handleNodeClick, verordeningsStructure, lastLocation])

    /**
     * Update the graph styles to give it the correct height.
     * This changes when the banner that displays the environment the user is in
     */
    useEffect(() => {
        if (showBanner) {
            setGraphStyles({ height: 'calc(100vh - 96px)', top: '121px' })
        } else {
            setGraphStyles({ height: 'calc(100vh - 96px)', top: '96px' })
        }
    }, [showBanner])

    /**
     * Update nodes based on search query
     */
    useEffect(() => {
        const svgElement = d3.select(d3Container.current)
        if (searchQuery === '') {
            svgElement.selectAll('circle').attr('fill', (d: any) => d.color)
        } else {
            svgElement
                .selectAll('circle')
                .attr('fill', (d: any) => d.color)
                .attr('r', 7.5)
                .filter(
                    (e: any) =>
                        !e.Titel?.toLowerCase()?.includes(
                            searchQuery.toLowerCase()
                        )
                )
                .attr('fill', (d: any) => d.colorLight)
        }

        svgElement.selectAll('line').attr('stroke-opacity', 0.6)
        setClickedNode(null)
    }, [searchQuery])

    return (
        <div
            id="popup-menu-graph"
            className="fixed top-0 left-0 w-full pb-10 overflow-y-auto bg-white"
            style={graphStyles}>
            <Helmet>
                <title>Omgevingsbeleid - Netwerkvisualisatie</title>
            </Helmet>
            <div className="container flex flex-col h-full mx-auto lg:flex-row">
                <NetworkGraphSidebar
                    isLoading={isLoading || isFetching}
                    filters={filters}
                    setFilters={setFilters}
                />
                <div className="w-full px-4 pb-20 mt-6 lg:pb-4 lg:mt-10 lg:w-3/4">
                    <h2 className="text-xl opacity-50 text-pzh-blue">
                        Omgevingsbeleid Provincie Zuid-Holland
                    </h2>
                    <h1
                        className="py-2 text-3xl text-pzh-blue"
                        id="networkvisualization-title">
                        Netwerkvisualisatie
                    </h1>
                    <div
                        className="relative mt-2 mb-10 overflow-hidden border rounded-md"
                        id="d3-graph-container"
                        style={{
                            height: '80%',
                        }}>
                        <div className="absolute flex w-full p-2 pointer-events-none">
                            <NetworkGraphSearchBar
                                clickedNode={clickedNode}
                                data={data}
                                filters={filters}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                handleNodeClick={handleNodeClick}
                                svgElement={d3.select(d3Container.current)}
                            />
                            <div className="flex flex-col ml-2 pointer-events-auto">
                                <NetworkGraphZoomButtons />
                                <NetworkGraphResetClickedElement
                                    resetNodes={resetNodes}
                                    clickedNode={clickedNode}
                                />
                            </div>
                        </div>
                        <svg
                            role="img"
                            className="w-full h-full d3-component"
                            ref={d3Container as any}
                            aria-labelledby="networkvisualization-title"
                        />
                        <NetworkGraphClickedElementPopup
                            clickedNode={clickedNode}
                            resetNodes={resetNodes}
                        />
                    </div>
                </div>
            </div>
            <NetworkGraphTooltip href={href || ''} variables={variables} />
        </div>
    )
}

const NetworkGraphZoomButtons = () => {
    return (
        <div className="flex flex-col items-end border rounded-md">
            <button
                className="p-2 bg-white rounded-t-md text-pzh-blue-dark hover:bg-gray-50"
                id="d3-zoom-in"
                type="button">
                <span className="sr-only">Inzoomen</span>
                <Plus aria-hidden="true" />
            </button>
            <button
                className="p-2 bg-white rounded-b-md text-pzh-blue-dark hover:bg-gray-50"
                id="d3-zoom-out"
                type="button">
                <span className="sr-only">Uitzoomen</span>
                <Minus aria-hidden="true" />
            </button>
        </div>
    )
}

export default NetworkGraph
