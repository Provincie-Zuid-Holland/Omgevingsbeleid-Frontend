import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function RelatiesKoppelingenTekstueel({
    beleidsObject,
    beleidsRelaties,
    connectionProperties,
    connectionPropertiesColors,
}) {
    if (!beleidsObject || !beleidsRelaties) return null

    if (beleidsRelaties.length === 0) {
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
            <div>
                {connectionProperties.map((property) => {
                    if (
                        !beleidsObject[property] ||
                        beleidsObject[property].length === 0
                    )
                        return null

                    return (
                        <div className="mt-4">
                            <h3 className="text-sm font-bold text-gray-800">
                                {property}
                            </h3>
                            <ul className="mt-2">
                                {beleidsObject[property].map((koppeling) => (
                                    <ListItem
                                        titel={koppeling.Titel}
                                        omschrijving={koppeling.Omschrijving}
                                        property={property}
                                        UUID={koppeling.UUID}
                                        connectionPropertiesColors={
                                            connectionPropertiesColors
                                        }
                                    />
                                ))}
                            </ul>
                        </div>
                    )
                })}
                {beleidsRelaties.length > 0 ? (
                    <div className="mt-4">
                        <h3 className="text-sm font-bold text-gray-800">
                            Beleidskeuzes
                        </h3>
                        <ul className="mt-2">
                            {beleidsRelaties.map((beleidsrelatie) => (
                                <ListItem
                                    titel={beleidsrelatie.Titel}
                                    property="Beleidskeuzes"
                                    UUID={beleidsrelatie.UUID}
                                    connectionPropertiesColors={
                                        connectionPropertiesColors
                                    }
                                />
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        )
    }
}

const ListItem = ({
    property,
    UUID,
    connectionPropertiesColors,
    titel,
    omschrijving,
}) => {
    const location = useLocation()
    const [left, setLeft] = React.useState('0px')

    const generateLeft = (elWidth) => {
        const tooltipEl = document.getElementById(UUID)
        if (!tooltipEl) return

        const tooltipElWidth = tooltipEl.offsetWidth
        return elWidth / 2 - tooltipElWidth / 2 + 10 + 'px'
    }

    const generateHref = ({ property, UUID }) => {
        const slugs = {
            Ambities: 'ambities',
            BeleidsRegels: 'beleidsregels',
            Beleidsprestaties: 'beleidsprestaties',
            Belangen: 'belangen',
            Maatregelen: 'maatregelen',
            Themas: 'themas',
            Beleidsdoelen: 'Beleidsdoelen',
            Verordening: 'verordeningen',
        }

        const path = `/detail/${slugs[property]}/${UUID}?fromPage=${location.pathname}`
        return path
    }

    const href = generateHref({ property: property, UUID: UUID })
    const isVerordeningItem = href && href.includes('verordening')

    return (
        <li className="relative block mt-1 text-sm text-gray-800">
            <div
                className="inline-flex items-center group"
                onMouseOver={(e) =>
                    setLeft(generateLeft(e.currentTarget.offsetWidth))
                }
            >
                <Link
                    to={isVerordeningItem ? '#' : href}
                    className={
                        isVerordeningItem ? 'cursor-default' : 'hover:underline'
                    }
                >
                    <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full`}
                        style={{
                            backgroundColor:
                                connectionPropertiesColors[property].hex,
                        }}
                    />
                    <span>{titel}</span>
                </Link>
                {omschrijving && omschrijving !== '' ? (
                    <div
                        id="d3-tooltip"
                        class="absolute hidden group-hover:block top-0 mt-8 z-20 cursor-default"
                        style={{
                            left: left,
                        }}
                    >
                        <div
                            id={UUID}
                            class="px-4 py-2 rounded bg-gray-900 text-white shadow"
                        >
                            {omschrijving}
                        </div>
                    </div>
                ) : null}
            </div>
        </li>
    )
}

export default RelatiesKoppelingenTekstueel
