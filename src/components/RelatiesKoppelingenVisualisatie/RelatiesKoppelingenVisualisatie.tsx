import * as d3 from 'd3'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
    BeleidskeuzeShortRead,
    BeleidskeuzesRead,
} from '@/api/fetchers.schemas'
import { generateHrefVerordeningsartikel } from '@/utils/generateHrefVerordeningsartikel'

import {
    ConnectionProperties,
    connectionPropertiesColors,
} from '../RelatiesKoppelingen/RelatiesKoppelingen'

/**
 * Displays a Netwerkvisualisatie map which shows the beleids objecten connections.
 *
 * @param {object} beleidsObject -  Contains the information of a beleid
 * @param {Array} connectionProperties - Contains a collection of connection properties.
 * @param {object} connectionPropertiesColors - Contains a collection of connection property colors.
 * @param {Array} beleidsRelaties - Contains a collection of beleidsRelaties.
 * @param {string} titleSingular - Contains the title in singular form.
 * @param {string} titleSingularPrefix - Contains the title in singular prefix form.
 * @param {object} verordeningsStructure - Contains the verorderings structure information.
 */

interface DataProps {
    nodes: any
    links: any
}

interface RelatiesKoppelingenVisualisatieProps {
    beleidsObject: BeleidskeuzesRead
    connectionProperties: ConnectionProperties[]
    connectionPropertiesColors: typeof connectionPropertiesColors
    beleidsRelaties: BeleidskeuzeShortRead[]
    titleSingular: string
    titleSingularPrefix: string
    verordeningsStructure: any
}

const RelatiesKoppelingenVisualisatie = ({
    beleidsObject,
    connectionProperties,
    connectionPropertiesColors,
    beleidsRelaties,
    titleSingular,
    titleSingularPrefix,
    verordeningsStructure,
}: RelatiesKoppelingenVisualisatieProps) => {
    const location = useLocation()

    const [variables, setVariables] = useState<{
        left?: number | string
        top?: number | string
    }>({}) // X and Y positions for the Tooltip
    const [data, setData] = useState<DataProps>({
        nodes: [],
        links: [],
    })
    const [href, setHref] = useState('#')
    const [connectedProperties, setConnectedProperties] = useState<
        (ConnectionProperties | 'Beleidskeuzes')[]
    >([]) // Properties that contain connections

    const getObjectColor = useCallback(
        titleSingular => {
            switch (titleSingular) {
                case 'Belang':
                    return connectionPropertiesColors.Belangen.hex
                case 'Beleidsdoel':
                    return connectionPropertiesColors.Beleidsdoelen.hex
                case 'Beleidskeuze':
                    return connectionPropertiesColors.Beleidskeuzes.hex
                case 'Beleidsprestatie':
                    return connectionPropertiesColors.Beleidsprestaties.hex
                case 'Beleidsregel':
                    return connectionPropertiesColors.Beleidsregels.hex
                case 'Maatregel':
                    return connectionPropertiesColors.Maatregelen.hex
                case 'Thema':
                    return connectionPropertiesColors.Themas.hex
                case 'Verordening':
                    return connectionPropertiesColors.Verordeningen.hex
                default:
                    return connectionPropertiesColors.MainObject.hex
            }
        },
        [connectionPropertiesColors]
    )

    // Prepare and set data for the D3 Visualisation
    useEffect(() => {
        if (!beleidsObject) return

        // Generate data Object with two objects inside of it, nodes and links
        // The properties on the nodes objects are { id: UUID, name: Titel, color: '#' }
        // The properties on the links objects are { source: UUID, target: UUID }
        // The 'source' and 'target' properties on the links objects both reference the 'id' property of a node

        // D3 data object to return
        const d3Data: DataProps = {
            nodes: [],
            links: [],
        }

        // First we push in the beleidsObject node object into the data object
        d3Data.nodes.push({
            id: beleidsObject.UUID,
            name: beleidsObject.Titel,
            property: 'beleidsObjectMain',
            color: getObjectColor(titleSingular),
        })

        // Holds the properties that have connections
        const activeConnectionProperties: (
            | ConnectionProperties
            | 'Beleidskeuzes'
        )[] = []

        // Output the node and link object for each property
        // We use the index for the ID
        connectionProperties.forEach(property => {
            if (
                !beleidsObject[property] ||
                beleidsObject[property]?.length === 0
            )
                return

            // Connection property exist in beleidsObject, so we push it
            activeConnectionProperties.push(property)

            beleidsObject[property]?.forEach(connection => {
                d3Data.nodes.push({
                    id: connection?.Object?.UUID,
                    name: connection?.Object?.Titel,
                    property: property,
                    color: connectionPropertiesColors[property].hex,
                })
                d3Data.links.push({
                    source: connection?.Object?.UUID,
                    target: beleidsObject.UUID,
                })
            })
        })

        // If there are beleidsrelaties, push them as well
        if (beleidsRelaties.length > 0) {
            activeConnectionProperties.push('Beleidskeuzes')
            beleidsRelaties.forEach(beleidsrelatie => {
                d3Data.nodes.push({
                    id: beleidsrelatie.UUID,
                    name: beleidsrelatie.Titel,
                    property: 'Beleidskeuzes',
                    color: connectionPropertiesColors.Beleidskeuzes.hex,
                })
                d3Data.links.push({
                    source: beleidsrelatie.UUID,
                    target: beleidsObject.UUID,
                })
            })
        }

        setConnectedProperties(activeConnectionProperties)
        setData(d3Data)
    }, [
        beleidsObject,
        beleidsRelaties,
        connectionProperties,
        connectionPropertiesColors,
        getObjectColor,
        titleSingular,
    ])

    /* The useRef Hook creates a variable that "holds on" to a value across rendering
       passes. In this case it will hold our component's SVG DOM element. It's
       initialized null and React will assign it later (see the return statement) */
    const d3Container = useRef(null)

    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
    useEffect(() => {
        if (!d3Container.current) return

        const svg = d3.select(d3Container.current)
        svg.selectAll('*').remove()

        svg.attr('viewBox', [50, -25, 100, 250])

        const links = data.links
        const nodes = data.nodes

        /**
         * When we simulate the nodes, we need to define their strength of attracting or repelling each other.
         * The higher the strength, the more they repel each other.
         * The more nodes we have, the stronger our strength need to be in order to create the space for the nodes
         * https://www.d3indepth.com/force-layout/#forcemanybody
         */
        const generateStrength = (nodes: DataProps['nodes']) => {
            if (nodes?.length > 20) return -150
            if (nodes?.length > 10) return -100
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
                d3.forceLink(links).id((d: any) => d.id)
            )
            .force('charge', d3.forceManyBody().strength(strength))
            .force('x', d3.forceX())
            .force('y', d3.forceY())

        const tooltip = d3.select('#d3-tooltip')

        // Create Event Handlers for mouse.
        // In here we handle the tooltip
        function handleMouseOver(this: d3.BaseType, _: any, d: any) {
            // We don't want to show the popup on the main beleidskeuze
            if (d.property === 'beleidsObjectMain') return

            // Activate display
            tooltip.style('display', 'block')

            const tooltipTitleEl = document.getElementById('d3-tooltip-title')
            tooltipTitleEl && (tooltipTitleEl.innerHTML = d.name)

            const tooltipEl = document.getElementById('d3-tooltip')

            const generateHref = ({
                property,
                UUID,
            }: {
                property: ConnectionProperties
                UUID: string
            }) => {
                const slugs = {
                    Beleidskeuzes: 'beleidskeuzes',
                    Beleidsregels: 'beleidsregels',
                    Beleidsprestaties: 'beleidsprestaties',
                    Belangen: 'belangen',
                    Maatregelen: 'maatregelen',
                    Themas: 'themas',
                    Beleidsdoelen: 'beleidsdoelen',
                    Verordeningen: 'verordeningen',
                }

                const path = `/${slugs[property]}/${UUID}`

                return path
            }

            const hrefURL =
                d.property === 'Verordeningen'
                    ? generateHrefVerordeningsartikel(
                          d.id,
                          verordeningsStructure
                      )
                    : generateHref({
                          property: d.property,
                          UUID: d.id,
                      })

            hrefURL && setHref(hrefURL)

            // Reset element
            setVariables({
                left: 0,
                top: 0,
            })

            const tooltipWidth = tooltipEl?.offsetWidth || 0
            const circleWidth = 24
            const { x, y } = (this as Element)?.getBoundingClientRect()
            const xPos = x - tooltipWidth / 2 + circleWidth / 2 //Center tooltip in the middle
            const navigationOffset = 90
            const yPos = y + window.pageYOffset - navigationOffset + circleWidth

            setVariables({
                left: xPos,
                top: yPos,
            })
        }

        const handleMouseOut = () => {
            // Reset display property, user can still see it when hovering over it
            tooltip.style('display', '')
        }

        // Generate Links
        const link = svg
            .append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke-width', (d: any) => Math.sqrt(d.value))

        // Generate Nodes
        const node = svg
            .append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', 7.5) // r equals the radius of the circle (node)
            .attr('fill', (d: any) => d.color)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)

        // Update
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
    }, [data, location.pathname, verordeningsStructure])

    return (
        <div className="flex flex-col md:flex-row">
            <div className="flex flex-col justify-between w-full">
                <div>
                    <h3 className="font-bold text-gray-800">
                        Netwerkvisualisatie
                    </h3>
                    <p className="mt-2 leading-7 text-gray-800 break-words">
                        Deze netwerkvisualisatie laat zien waar{' '}
                        {titleSingularPrefix} {titleSingular.toLowerCase()}{' '}
                        <span className="italic">“{beleidsObject.Titel}”</span>{' '}
                        aan verbonden is.
                    </p>
                </div>

                {/* Legenda */}
                <ul className="mt-10">
                    <li className="flex items-center mt-1 text-sm text-gray-800">
                        <span
                            className="flex-shrink-0 inline-block w-3 h-3 mr-2 rounded-full"
                            style={{
                                backgroundColor: getObjectColor(titleSingular),
                            }}
                        />
                        <span>{beleidsObject.Titel}</span>
                    </li>
                    {connectedProperties.map(property => (
                        <li
                            key={property}
                            className="flex items-center mt-1 text-sm text-gray-800">
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
            <div className="relative block w-full">
                <div className="container flex items-center justify-center mx-auto">
                    <svg
                        className="d3-component"
                        style={{
                            width: '100%',
                            height: '400px',
                        }}
                        ref={d3Container}
                    />
                </div>
                <Link
                    to="/netwerkvisualisatie"
                    state={{
                        from: location.pathname + location.search,
                    }}
                    className="absolute bottom-0 right-0 px-3 py-1 font-bold transition-colors duration-100 ease-in border rounded-md cursor-pointer hover:text-white text-pzh-blue border-pzh-blue hover:bg-pzh-blue">
                    Bekijk grote netwerkvisualisatie
                </Link>
            </div>
            <Link
                to={href || '#'}
                id="d3-tooltip"
                style={{
                    left: variables.left,
                    top: variables.top,
                }}
                className={`absolute hidden hover:block ${
                    href ? 'cursor-pointer' : 'cursor-default'
                }`}>
                <div
                    id="d3-tooltip-title"
                    className={`px-4 py-2 rounded bg-gray-900 text-white shadow hover:underline`}
                />
            </Link>
        </div>
    )
}

export default RelatiesKoppelingenVisualisatie
