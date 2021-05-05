import React from 'react'
import * as d3 from 'd3'
import { Link, useLocation } from 'react-router-dom'

const RelatiesKoppelingenVisualisatie = ({
    beleidsObject,
    connectionProperties,
    connectionPropertiesColors,
    beleidsRelaties,
    titleSingular,
    titleSingularPrefix,
}) => {
    const location = useLocation()

    const [variables, setVariables] = React.useState({}) // X and Y positions for the Tooltip
    const [data, setData] = React.useState(null)
    const [href, setHref] = React.useState('#')
    const [connectedProperties, setConnectedProperties] = React.useState([]) // Properties that contain connections

    // Prepare and set data for the D3 Visualisation
    React.useEffect(() => {
        if (!beleidsObject) return

        // Generate data Object with two objects inside of it, nodes and links
        // The properties on the nodes objects are { id: UUID, name: Titel, color: '#' }
        // The properties on the links objects are { source: UUID, target: UUID }
        // The 'source' and 'target' properties on the links objects both reference the 'id' property of a node

        // D3 data object to return
        const data = {
            nodes: [],
            links: [],
        }

        // First we push in the beleidsObject node object into the data object
        data.nodes.push({
            id: beleidsObject.UUID,
            name: beleidsObject.Titel,
            property: 'beleidsObjectMain',
            color: connectionPropertiesColors.MainObject.hex,
        })

        // Holds the properties that have connections
        const activeConnectionProperties = []

        // Output the node and link object for each property
        // We use the index for the ID
        connectionProperties.forEach((property) => {
            if (
                !beleidsObject[property] ||
                beleidsObject[property].length === 0
            )
                return

            // Connection property exist in beleidsObject, so we push it
            activeConnectionProperties.push(property)

            beleidsObject[property].forEach((connection) => {
                data.nodes.push({
                    id: connection.Object.UUID,
                    name: connection.Object.Titel,
                    property: property,
                    color: connectionPropertiesColors[property].hex,
                })
                data.links.push({
                    source: connection.Object.UUID,
                    target: beleidsObject.UUID,
                })
            })
        })

        // If there are beleidsrelaties, push them as well
        if (beleidsRelaties.length > 0) {
            activeConnectionProperties.push('Beleidskeuzes')
            beleidsRelaties.forEach((beleidsrelatie) => {
                data.nodes.push({
                    id: beleidsrelatie.UUID,
                    name: beleidsrelatie.Titel,
                    property: 'Beleidskeuzes',
                    color: connectionPropertiesColors.Beleidskeuzes.hex,
                })
                data.links.push({
                    source: beleidsrelatie.UUID,
                    target: beleidsObject.UUID,
                })
            })
        }

        setConnectedProperties(activeConnectionProperties)
        setData(data)
    }, [
        beleidsObject,
        beleidsRelaties,
        connectionProperties,
        connectionPropertiesColors,
    ])

    /* The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement) */
    const d3Container = React.useRef(null)

    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
    React.useEffect(() => {
        if (data && d3Container.current) {
            const svg = d3.select(d3Container.current)
            svg.attr('viewBox', [50, 25, 100, 150])

            const links = data.links
            const nodes = data.nodes

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

                const tooltipTitleEl = document.getElementById(
                    'd3-tooltip-title'
                )
                tooltipTitleEl.innerHTML = d.name

                const tooltipEl = document.getElementById('d3-tooltip')

                const generateHref = ({ property, UUID }) => {
                    const slugs = {
                        Beleidskeuzes: 'beleidskeuzes',
                        Ambities: 'ambities',
                        Beleidsregels: 'beleidsregels',
                        Beleidsprestaties: 'beleidsprestaties',
                        Belangen: 'belangen',
                        Maatregelen: 'maatregelen',
                        Themas: 'themas',
                        Beleidsdoelen: 'beleidsdoelen',
                        Verordening: 'verordeningen',
                    }

                    const path = `/detail/${slugs[property]}/${UUID}?fromPage=${location.pathname}`
                    return path
                }
                const hrefURL = generateHref({
                    property: d.property,
                    UUID: d.id,
                })

                setHref(hrefURL)

                // Reset element
                setVariables({
                    left: 0,
                    top: 0,
                })

                const tooltipWidth = tooltipEl.offsetWidth
                // const circleWidth = 24
                const circleWidth = 24
                const { x, y } = this.getBoundingClientRect()

                setVariables({
                    left: x - tooltipWidth / 2 + circleWidth / 2, //Center tooltip in the middle
                    top: y + 35 + window.pageYOffset,
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
    }, [data, location.pathname])

    const isVerordeningItem = href && href.includes('verordening')
    const hasNoConnections = false

    if (hasNoConnections) {
        return (
            <div className="flex">
                <div className="flex flex-col justify-between w-full">
                    <div>
                        <p className="mt-2 leading-7 text-gray-800 break-words">
                            Er zijn nog geen koppelingen naar{' '}
                            <span className="italic">
                                “{beleidsObject.Titel}”
                            </span>
                            .
                        </p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex">
                <div className="flex flex-col justify-between w-full">
                    <div>
                        <h3 className="font-bold text-gray-800">
                            Netwerkvisualisatie
                        </h3>
                        <p className="mt-2 leading-7 text-gray-800 break-words">
                            Deze netwerkvisualisatie laat zien waar{' '}
                            {titleSingularPrefix} {titleSingular.toLowerCase()}{' '}
                            <span className="italic">
                                “{beleidsObject.Titel}”
                            </span>{' '}
                            aan verbonden is.
                        </p>
                    </div>

                    {/* Legenda */}
                    <ul className="mt-10">
                        <li className="flex items-center mt-1 text-sm text-gray-800">
                            <span className="inline-block w-3 h-3 mr-2 bg-purple-800 rounded-full" />
                            <span>{beleidsObject.Titel}</span>
                        </li>
                        {connectedProperties.map((property) => (
                            <li
                                key={property}
                                className="flex items-center mt-1 text-sm text-gray-800"
                            >
                                <span
                                    className={`inline-block w-3 h-3 mr-2 rounded-full`}
                                    style={{
                                        backgroundColor:
                                            connectionPropertiesColors[property]
                                                .hex,
                                    }}
                                />
                                <span>{property}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="block w-full">
                    <div className="container flex items-center justify-center mx-auto">
                        <svg
                            className="d3-component"
                            style={{
                                width: '100%',
                                height: '250px',
                            }}
                            ref={d3Container}
                        />
                    </div>
                    <Link
                        to={isVerordeningItem ? '#' : href}
                        id="d3-tooltip"
                        style={{
                            left: variables.left,
                            top: variables.top,
                        }}
                        class="absolute hidden hover:block"
                    >
                        <div
                            id="d3-tooltip-title"
                            class={`px-4 py-2 rounded bg-gray-900 text-white shadow ${
                                isVerordeningItem
                                    ? 'cursor-default'
                                    : 'hover:underline'
                            }`}
                        />
                    </Link>
                </div>
            </div>
        )
    }
}

export default RelatiesKoppelingenVisualisatie