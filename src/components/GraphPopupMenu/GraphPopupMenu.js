import React from 'react'
import { Transition } from '@headlessui/react'
import * as d3 from 'd3'
import { Link } from 'react-router-dom'
import { faTimes, faChartNetwork } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useLockBodyScroll from './../../utils/useLockBodyScroll'

import axios from './../../API/axios'

/**
 * Function that returns the href slug to a detail page of a specific object
 * @param {object} props
 * @param {string} string - Type of the object
 * @param {string} UUID - UUID of the object
 * @returns {string} containing the url slug
 */
const generateHref = ({ property, UUID }) => {
    const slugs = {
        beleidskeuzes: 'beleidskeuzes',
        ambities: 'ambities',
        beleidsregels: 'beleidsregels',
        beleidsprestaties: 'beleidsprestaties',
        belangen: 'belangen',
        maatregelen: 'maatregelen',
        themas: 'themas',
        beleidsdoelen: 'beleidsdoelen',
        verordening: 'verordeningen',
    }

    const path = `/detail/${slugs[property]}/${UUID}}`
    return path
}

const connectionProperties = {
    mainobject: {
        hex: '#553c9a',
    },
    ambities: {
        hex: '#aa0067',
        singular: 'Ambitie',
        prefix: 'de',
    },
    belangen: {
        hex: '#ff6b02',
        singular: 'Belang',
        prefix: 'het',
    },
    beleidsregels: {
        hex: '#76bc21',
        singular: 'Beleidsregel',
        prefix: 'de',
    },
    beleidsprestaties: {
        hex: '#ecc94b',
        singular: 'Beleidsprestatie',
        prefix: 'de',
    },
    maatregelen: {
        hex: '#503d90',
        singular: 'Maatregel',
        prefix: 'de',
    },
    beleidsdoelen: {
        hex: '#3182ce',
        singular: 'beleidsdoel',
        prefix: 'het',
    },
    themas: {
        hex: '#847062',
        singular: 'Thema',
        prefix: 'het',
    },
    verordening: {
        hex: '#eb7085',
        singular: 'Verordening',
        prefix: 'de',
    },
    beleidskeuzes: {
        hex: '#7badde',
        singular: 'Beleidskeuze',
        prefix: 'de',
    },
}

/**
 * TODO:
 * [ ] - If the space below the cursor is too small for the height of the tooltip, display it above it
 * [ ] - On detail page change, give node with corresponding UUID an active state
 * [ ] - Reset button to reset clicked element
 * [ ] - Filter sidebar
 * [ ] - Look into zoom & pan (https://stackoverflow.com/questions/38597582/d3-js-pan-and-zoom-jumps-when-using-mouse-after-programatic-zoom & https://github.com/d3/d3-zoom#zoom-events)
 * @param {object} props
 * @param {boolean} graphIsOpen - Inidicates if the graph popup is open
 * @param {function} setGraphIsOpen - Function to toggle the graphIsOpen value to a true/false value
 * @param {boolean} showBanner - Indicates if the user is shown a banner above the navigation (needed to calc. the height)
 * @returns A component that displays a d3 force graph that shows the relations and connections of all the policies
 */
const GraphPopupMenu = ({ graphIsOpen, setGraphIsOpen, showBanner }) => {
    useLockBodyScroll({ modalOpen: graphIsOpen })

    const [data, setData] = React.useState([])
    const [variables, setVariables] = React.useState({}) // X and Y positions for the Tooltip
    const [href, setHref] = React.useState('#')
    const [clickedNode, setClickedNode] = React.useState(null)
    const clickedNodeRef = React.useRef(null)

    React.useEffect(() => {
        clickedNodeRef.current = clickedNode
    }, [clickedNode])

    const prepareData = (data) => {
        if (!data) return null
        data.nodes.forEach((node) => {
            node.color = connectionProperties[node.Type].hex
            node.id = node.UUID
        })
        return data
    }

    /**
     * Function to handle click on a node
     * @param {object} clickedEl - Contains the node that is clicked
     * @param {object} svg - Contains the SVG container in a Selection object
     * @param {*} links
     * @returns
     */
    const handleNodeClick = (clickedEl, svg, links) => {
        // Get UUID from clicked element
        const uuidSource = clickedEl.UUID
        if (!uuidSource) return

        if (uuidSource === clickedNodeRef.current?.UUID) {
            svg.selectAll('circle').attr('opacity', 1)
            setClickedNode(null)
        } else {
            setClickedNode(clickedEl)

            const connectedLinks = links.filter(
                (link) =>
                    link.target.UUID === uuidSource ||
                    link.source.UUID === uuidSource
            )

            svg.selectAll('circle')
                .attr('opacity', 1)
                .filter((circle) =>
                    connectedLinks.every(
                        (e) =>
                            e.source.UUID !== circle.UUID &&
                            e.target.UUID !== circle.UUID
                    )
                )
                .attr('opacity', 0.25)
        }
    }

    React.useEffect(() => {
        axios
            .get('/graph')
            .then((res) => {
                const data = prepareData(res.data)
                setData(data)
            })
            .catch((err) => console.error('error: ', err?.message))
    }, [])

    /**
     * The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement)
     */
    const d3Container = React.useRef(null)

    const initializeD3 = () => {
        const links = data.links
        const nodes = data.nodes

        if (!links || !nodes) return

        /**
         * Get current SVG element
         */
        const svgElement = d3.select(d3Container.current)

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

        svgElement.call(
            d3.zoom().on('zoom', function () {
                console.log(d3.event.transform)
                svgElement.attr('transform', d3.event.transform)
            }),
            d3.zoomIdentity.scale(0.5)
        )

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

        const tooltip = d3.select('#d3-tooltip-network-graph')

        // Create Event Handlers for mouse.
        // In here we handle the hover styles and the tooltip
        function handleMouseOver(d) {
            this.setAttribute('r', 8.5)

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
            tooltipTypeEl.innerHTML = singularType ? singularType : d.Type

            const hrefURL = generateHref({
                property: d.Type,
                UUID: d.id,
            })

            setHref(hrefURL)

            // Reset element
            setVariables({
                left: 0,
                top: 0,
            })

            const tooltipEl = document.getElementById(
                'd3-tooltip-network-graph'
            )

            const tooltipWidth = tooltipEl.offsetWidth

            const circleWidth = 24
            const { x, bottom } = this.getBoundingClientRect()
            const tooltipHeight = tooltipEl.getBoundingClientRect().height

            setVariables({
                left: x - tooltipWidth / 2 + circleWidth / 2 - 5, //Center tooltip in the middle
                top: bottom - tooltipHeight + 16,
            })
        }

        function handleMouseOut(d, i) {
            // Reset display property, user can still see it when hovering over it
            tooltip.style('display', '')
            this.setAttribute('r', 7.5)
        }

        // Update
        simulation.on('tick', () => {
            link.attr('x1', (d) => d.source.x + 100)
                .attr('y1', (d) => d.source.y + 100)
                .attr('x2', (d) => d.target.x + 100)
                .attr('y2', (d) => d.target.y + 100)

            node.attr('cx', (d) => d.x + 100).attr('cy', (d) => d.y + 100)
        })
    }

    /* The useEffect Hook is for running side effects outside of React,
          for instance inserting elements into the DOM using D3 */
    React.useEffect(() => {
        // Timeout to wait for the transition of the popup
        setTimeout(() => {
            if (!graphIsOpen) return
            initializeD3()
        }, 250)
    }, [graphIsOpen])

    // Eventlistener for closing the modal with the Escape key
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
                        <div className="w-1/4 my-10 pl-6">Sidebar</div>
                        <div className="w-3/4 rounded-md overflow-hidden border my-10">
                            <svg
                                className="d3-component h-full w-full"
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
                                <Link to={href} className="group">
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
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
            <div className="container flex h-full mx-auto relative">
                <div className="bottom-0 right-0 mb-12 mr-2 inset-uy-ato absolute">
                    <Transition
                        show={localOpenState}
                        enter="transition ease-out duration-150 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-0 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="bg-white py-2 pr-5 rouned pointer-events-auto shadow-md text-lg relative">
                            <Link
                                className="group block pt-0 p-3"
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
                                className="mt-2 mx-1 right-0 top-0 absolute mr-1 pb-1 px-2 hover:bg-gray-200 rounded-md cursor-pointer"
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

export default GraphPopupMenu
