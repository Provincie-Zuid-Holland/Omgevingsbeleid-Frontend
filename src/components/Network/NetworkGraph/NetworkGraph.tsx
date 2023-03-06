import { Heading, TabItem, Tabs, Text } from '@pzh-ui/components'
import { useQuery } from '@tanstack/react-query'
import * as d3 from 'd3'
import cloneDeep from 'lodash.clonedeep'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { getGraph } from '@/api/fetchers'
import { GetGraph200, GetGraph200NodesItem } from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import BackButton from '@/components/BackButton'
import Footer from '@/components/Footer'
import { LoaderSpinner } from '@/components/Loader'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import useNetworkGraphFilters from '@/hooks/useNetworkGraphFilters'
import {
    addClickedNodeCircle,
    generateNodes,
    getFilteredData,
    getUUIDFromPreviousUrl,
    removeCircleActiveNode,
    updateGraphSearch,
    updateNodeStyles,
    updateTooltipContent,
    updateTooltipCoordinates,
} from '@/utils/networkGraph'

import NetworkGraphClickedElementPopup from '../NetworkGraphClickedElementPopup'
import NetworkGraphResetClickedElement from '../NetworkGraphResetClickedElement'
import NetworkGraphSearchBar from '../NetworkGraphSearchBar'
import NetworkGraphSelectFilters from '../NetworkGraphSelectFilters'
import NetworkGraphTooltip from '../NetworkGraphTooltip'
import NetworkGraphZoomButtons from '../NetworkGraphZoomButtons'
import NetworkLegend from '../NetworkLegend'
import NetworkTextual from '../NetworkTextual'

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
     * The last clicked node
     */
    const [clickedNode, setClickedNode] = useState(null)

    /**
     * The current active tab
     */
    const [activeTab, setActiveTab] = useState('visual')

    /**
     * Set to true when the first init is done
     */
    const [firstInitDone, setFirstInitDone] = useState(false)
    const firstInitDoneRef = useRef<boolean | null>(null)

    useEffect(() => {
        firstInitDoneRef.current = firstInitDone
    }, [firstInitDone])

    /** Reset clicked node on tab switch */
    useEffect(() => {
        setClickedNode(null)
        setFirstInitDone(false)
    }, [activeTab])

    /**
     * Used to get the UUID paramater for detail pages
     */
    const { state } = useLocation()
    const lastLocation = (state as any)?.from

    const { data: verordeningsStructure } = useQuery(
        ['/verordeningstructuur'],
        () =>
            axios
                .get('/verordeningstructuur')
                .then(res =>
                    res.data.find(
                        (item: { Status: string }) => item.Status === 'Vigerend'
                    )
                ),
        { refetchOnMount: true, staleTime: 0 }
    )

    const { isLoading, data } = useQuery(
        ['/graph'],
        () =>
            getGraph().then(data => {
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

    const [filters, setFilters] = useNetworkGraphFilters()

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
    const addColorAndUUIDToNodes = (data: GetGraph200) => {
        if (!data) return null

        data.nodes?.forEach(
            (node: GetGraph200NodesItem & { [key: string]: any }) => {
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
            }
        )

        return data
    }

    /**
     * Function to reset state in D3 Graph
     * @returns {void}
     */
    const resetNodes = useCallback(() => {
        const svgElement = d3.select(d3Container.current)

        svgElement.selectAll('line').attr('stroke-opacity', 0.6)
        svgElement.selectAll('path').attr('transform', (d: any) => {
            const domElement = document.getElementById(d.id)
            if (!domElement) return ''
            const transformValue = domElement.getAttribute('transform')
            if (!transformValue) return ''
            const newTransformValue = transformValue.replace('scale(1.5)', '')
            return newTransformValue
        })
        svgElement.selectAll('path').attr('fill', (d: any) => d.color)

        const clickedNodeUUID = clickedNodeRef.current.UUID

        setClickedNode(null)

        if (clickedNodeUUID) {
            // Remove Scale
            const domClickedNode = document.getElementById(clickedNodeUUID)
            if (!domClickedNode) return
            const transformValue = domClickedNode.getAttribute('transform')
            if (!transformValue) return
            domClickedNode.setAttribute(
                'transform',
                transformValue.replace('scale(1.5)', '')
            )

            // Remove Circle
            removeCircleActiveNode()
        }
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
     * Sets the style (opacity and size) of the clicked node and the linked nodes
     * Also appends a white circle element in the clicked node path
     * @param {object} clickedEl - Contains the node that is clicked
     * @param {object} svgElement - Contains the SVG container in a Selection object
     * @param {array} links - Contains the d3 links
     * @param {boolean} isNotClicked - Contains a boolean if the function is called without a click from the user. This is used to prevent resetting the clicked node state. Normally when a node is clicked a second time we want to reset the clicked node state. We use this value in the function persistOrInitActiveNode().
     * @returns {void}
     */
    const handleNodeClick = useCallback(
        (clickedEl: any, svgElement: any, links: any, refresh?: any) => {
            const uuidClickedNode = clickedEl.UUID
            if (!uuidClickedNode) return

            const connectedLinks = links.filter((link: any) => {
                if (typeof link.target === 'string') {
                    return (
                        link.target === uuidClickedNode ||
                        link.source === uuidClickedNode
                    )
                } else {
                    return (
                        link.target.UUID === uuidClickedNode ||
                        link.source.UUID === uuidClickedNode
                    )
                }
            })

            svgElement.selectAll('path').attr('fill', (d: any) => d.color)
            svgElement.selectAll('line').attr('stroke-opacity', 0)

            const selectConnectedNodesFromClickedNode = () => {
                svgElement
                    .selectAll('path')
                    .attr('fill', (d: any) => d.color)
                    .filter((path: any) =>
                        connectedLinks.every((e: any) => {
                            if (typeof e.target === 'string') {
                                return (
                                    e.source !== path.UUID &&
                                    e.target !== path.UUID
                                )
                            } else {
                                return (
                                    e.source.UUID !== path.UUID &&
                                    e.target.UUID !== path.UUID
                                )
                            }
                        })
                    )
                    .attr('fill', (d: any) => d.colorLight)

                svgElement
                    .selectAll('path')
                    .filter((circle: any) => circle.UUID === uuidClickedNode)
                    .attr('fill', (d: any) => d.color)
            }

            const selectConnectedLinksFromClickedNode = () => {
                svgElement
                    .selectAll('line')
                    .attr('stroke-opacity', 0.2)
                    .filter(
                        (link: any) =>
                            link.source.UUID === uuidClickedNode ||
                            link.target.UUID === uuidClickedNode
                    )
                    .attr('stroke-opacity', 0.6)
            }

            // Remove circle clicked node if there is one
            removeCircleActiveNode()

            if (uuidClickedNode === clickedNodeRef.current?.UUID && !refresh) {
                /**
                 * If the currently clicked node is the same as the previous still active node we reset the state
                 */
                resetNodes()
            } else {
                /**
                 * The user clicked on a new node, so we set this node in the clickedNode state
                 * and update the styles of this and all the connecting nodes
                 */
                addClickedNodeCircle(uuidClickedNode)
                selectConnectedNodesFromClickedNode()
                selectConnectedLinksFromClickedNode()
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
        const initializeD3 = (
            data: GetGraph200 | null | undefined,
            filters: any
        ) => {
            /**
             * Function to handle the mouseOver event on nodes
             * We update the data (title, subtitle and href) of the tooltip
             * @param {object} d - Contains the node data from the mouseOver event
             */
            const handleMouseOver = (
                _: any,
                d: {
                    Type: keyof typeof networkGraphConnectionProperties
                    Titel: string
                    index: number
                    UUID: string
                }
            ) => {
                const nodeUUID = d.UUID
                const nodeElement = document.getElementById(nodeUUID)

                if (!nodeElement) return

                updateTooltipContent(d, setHref)
                updateTooltipCoordinates(setVariables, nodeElement)
                updateNodeStyles(nodeElement)
            }

            /**
             * Function to handle the mouseOut event on nodes
             * Resets the hover tooltip and the node hover styles
             * @param {object} d - Contains the node from the mouseOut event
             * @param {number} i - Contains the index of the node
             */
            const handleMouseOut = (_: any, d: any) => {
                const tooltip = d3.select('#d3-tooltip-network-graph')
                tooltip.style('display', '')
                const nodeUUID = d.UUID
                const nodeDomElement = document.getElementById(nodeUUID)
                const transformValue = nodeDomElement?.getAttribute('transform')
                // Don't reset the hover styles if the node is clicked
                if (!transformValue || clickedNodeRef.current) return
                nodeDomElement?.setAttribute(
                    'transform',
                    transformValue.replace('scale(1.5)', '')
                )
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
             * Get current SVG element and remove all existing nodes
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
            const minimumZoom = 0.4
            const maximumZoom = 15
            const zoomed = (event: any) => {
                const transformEvent = event.transform
                const newZoom = transformEvent.k
                if (newZoom < minimumZoom) return

                const transform = transformEvent.toString()
                svgElement.selectAll('g').attr('transform', transform)

                const popupElement = document.getElementById(
                    'd3-tooltip-network-graph'
                )

                if (popupElement) {
                    popupElement.setAttribute('transform', transform)
                }
            }

            const zoomHandler = d3
                .zoom<SVGElement, any>()
                .scaleExtent([minimumZoom, maximumZoom])
                .translateExtent([
                    [-2000, -1500],
                    [2000, 1500],
                ])
                .on('zoom', zoomed)

            svgElement.call(zoomHandler).on('dblclick.zoom', null)

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
            const generatedLinks = svgElement
                .append('g')
                .attr('data-testid', 'test-g-links')
                .attr('stroke', '#999')
                .attr('stroke-opacity', 0.6)
                .selectAll('line')
                .data(links as any)
                .join('line')
                .attr('stroke-width', (d: any) => Math.sqrt(d.value))

            // Generate Nodes
            const generatedNodes = generateNodes(svgElement, nodes)
                .on('mouseover', handleMouseOver as any)
                .on('mouseout', handleMouseOut)
                .on('click', (_, clickedEl) =>
                    handleNodeClick(clickedEl, svgElement, links)
                )

            d3.select('#d3-zoom-in').on('click', function () {
                zoomHandler.scaleBy(svgElement.transition().duration(750), 1.4)
            })

            d3.select('#d3-zoom-out').on('click', function () {
                zoomHandler.scaleBy(svgElement.transition().duration(750), 0.6)
            })

            persistOrInitActiveNode(links, nodes)

            // Handle updates
            simulation.on('tick', () => {
                generatedLinks
                    .attr('x1', (d: any) => d.source.x + 100)
                    .attr('y1', (d: any) => d.source.y + 100)
                    .attr('x2', (d: any) => d.target.x + 100)
                    .attr('y2', (d: any) => d.target.y + 100)

                generatedNodes.attr('transform', function (d: any) {
                    const x = d.x + 100
                    const y = d.y + 100
                    return 'translate(' + x + ' ' + y + ')'
                })
            })
        }

        /**
         * Timeout to wait for the transition of the popup to make sure all elements are mounted
         */
        setTimeout(() => {
            if (activeTab === 'visual') {
                initializeD3(data, filters)
            }
        }, 250)
    }, [
        data,
        filters,
        handleNodeClick,
        verordeningsStructure,
        lastLocation,
        activeTab,
    ])

    /**
     * Update nodes and links based on search query
     */
    useEffect(() => {
        const svgElement = d3.select(d3Container.current)
        updateGraphSearch(searchQuery, svgElement)
        setClickedNode(null)
    }, [searchQuery])

    return (
        <div>
            <div className="grid grid-cols-6 pr-4 mx-auto pzh-container gap-x-10 gap-y-0">
                <div className="col-span-6 mt-4">
                    <BackButton />
                    <Heading className="mt-6" level="1">
                        Beleidsnetwerk
                    </Heading>
                    <Text className="mb-4">
                        Het beleid van de provincie Zuid-Holland en de
                        onderliggende koppelingen
                    </Text>
                    <Tabs onSelectionChange={key => setActiveTab(`${key}`)}>
                        <TabItem key="visual" title="Visueel">
                            <div className="relative py-4">
                                {/* Gray background */}
                                <div
                                    className="absolute top-0 left-0 h-full bg-pzh-gray-100"
                                    style={{
                                        width: '200vw',
                                        left: '-50vw',
                                    }}
                                />

                                {/* Search and filter Section */}
                                <div className="flex w-full mb-2">
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
                                    <NetworkGraphSelectFilters
                                        filters={filters}
                                        setFilters={setFilters}
                                        isLoading={isLoading}
                                    />
                                </div>

                                {/* Graph */}
                                <div
                                    className="relative mt-2 mb-10 overflow-hidden bg-white border rounded-md"
                                    id="d3-graph-container"
                                    style={{
                                        height: '80vh',
                                        minHeight: '600px',
                                    }}>
                                    {/* Zoom and reset buttons */}
                                    <div className="absolute top-0 right-0 flex flex-col mt-4 ml-2 mr-4 pointer-events-auto">
                                        <NetworkGraphZoomButtons />
                                        <NetworkGraphResetClickedElement
                                            resetNodes={resetNodes}
                                            clickedNode={clickedNode}
                                        />
                                    </div>

                                    {/* Loader */}
                                    {isLoading && (
                                        <div className="flex items-center justify-center w-full h-full pr-24">
                                            <LoaderSpinner />
                                        </div>
                                    )}

                                    {/* Graph */}
                                    <svg
                                        role="img"
                                        className="w-full h-full d3-component"
                                        ref={d3Container as any}
                                        aria-labelledby="networkvisualization-title"
                                    />

                                    {/* Legend */}
                                    <NetworkLegend
                                        setFilters={setFilters}
                                        isLoading={isLoading}
                                        filters={filters}
                                    />

                                    {/* Popup when element is clicked */}
                                    <NetworkGraphClickedElementPopup
                                        clickedNode={clickedNode}
                                        resetNodes={resetNodes}
                                    />
                                </div>
                            </div>
                        </TabItem>
                        <TabItem key="textual" title="Tekstueel">
                            <NetworkTextual filters={filters} graphData={data}>
                                <NetworkGraphSelectFilters
                                    filters={filters}
                                    setFilters={setFilters}
                                    isLoading={isLoading}
                                />
                            </NetworkTextual>
                        </TabItem>
                    </Tabs>
                </div>
                <NetworkGraphTooltip href={href || ''} variables={variables} />
            </div>
            <Footer />
        </div>
    )
}

export default NetworkGraph
