import React from 'react'
import { Transition } from '@headlessui/react'
import * as d3 from 'd3'
import { Link, useLocation } from 'react-router-dom'

import {
    faBars,
    faTimes,
    faChartNetwork,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import useLockBodyScroll to stop html body scroll when the modal is open
import useLockBodyScroll from './../../utils/useLockBodyScroll'

import axios from './../../API/axios'

import LoaderSpinner from './../LoaderSpinner'

const connectionPropertiesColors = {
    mainobject: {
        hex: '#553c9a',
    },
    ambities: {
        hex: '#aa0067',
    },
    belangen: {
        hex: '#ff6b02',
    },
    beleidsregels: {
        hex: '#76bc21',
    },
    beleidsprestaties: {
        hex: '#ecc94b',
    },
    maatregelen: {
        hex: '#503d90',
    },
    beleidsdoelen: {
        hex: '#3182ce',
    },
    themas: {
        hex: '#847062',
    },
    verordening: {
        hex: '#eb7085',
    },
    beleidskeuzes: {
        hex: '#7badde',
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
    useLockBodyScroll({ modalOpen: graphIsOpen })

    const [data, setData] = React.useState([])
    const [variables, setVariables] = React.useState({}) // X and Y positions for the Tooltip
    const [href, setHref] = React.useState('#')

    const prepareData = (data) => {
        if (!data) return null
        data.nodes.forEach((node) => {
            node.color = connectionPropertiesColors[node.Type].hex
            node.id = node.UUID
        })
        return data
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

    /* The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement) */
    const d3Container = React.useRef(null)

    const initializeD3 = () => {
        const svg = d3.select(d3Container.current)

        const bounding = d3Container.current.getBoundingClientRect()
        svg.attr('viewBox', [
            -bounding.width / 2 + 100,
            -bounding.height / 2 + 100,
            bounding.width,
            bounding.height,
        ])

        const links = data.links
        const nodes = data.nodes

        if (!links || !nodes) return

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
        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke-width', (d) => Math.sqrt(d.value))

        // Generate Nodes
        const node = svg
            .append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 7.5) // r equals the radius of the circle (node)
            .attr('fill', (d) => d.color)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)

        const tooltip = d3.select('#d3-tooltip')

        // Create Event Handlers for mouse.
        // In here we handle the tooltip
        function handleMouseOver(d, i) {
            // We don't want to show the popup on the main beleidskeuze
            if (d.property === 'beleidsObjectMain') return

            // Activate display
            tooltip.style('display', 'block')

            const tooltipTitleEl = document.getElementById('d3-tooltip-title')
            tooltipTitleEl.innerHTML = d.Titel

            const tooltipEl = document.getElementById('d3-tooltip')

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

            const tooltipWidth = tooltipEl.offsetWidth

            const circleWidth = 24
            const { x, y } = this.getBoundingClientRect()

            setVariables({
                left: x - tooltipWidth / 2 + circleWidth / 2 - 2, //Center tooltip in the middle
                top: y - 80,
            })
        }

        function handleMouseOut(d, i) {
            // Reset display property, user can still see it when hovering over it
            tooltip.style('display', '')
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
                    id="popup-menu"
                    className="fixed top-0 left-0 w-full pt-5 bg-white"
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
                    <div className="flex h-full">
                        <svg
                            className="d3-component"
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                            ref={d3Container}
                        />
                        <Link
                            to={href}
                            id="d3-tooltip"
                            style={{
                                left: variables.left,
                                top: variables.top,
                            }}
                            class="absolute hidden hover:block"
                        >
                            <div
                                id="d3-tooltip-title"
                                class={`px-4 py-2 rounded bg-gray-900 text-white shadow hover:underline`}
                            />
                        </Link>
                    </div>
                </div>
            </Transition>
        </React.Fragment>
    )
}
export default GraphPopupMenu
