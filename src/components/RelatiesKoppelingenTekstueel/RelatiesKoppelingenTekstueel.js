import React from "react"
import { Link, useLocation } from "react-router-dom"

const getObjectFromRelation = (relation) => {
    return relation.hasOwnProperty("Van_Beleidskeuze")
        ? relation.Van_Beleidskeuze
        : relation.hasOwnProperty("Naar_Beleidskeuze")
        ? relation.Naar_Beleidskeuze
        : relation
}

/**
 * Component that renders the RelatiesKoppelingenTekstueel component,
 *
 * @component
 *
 * @param {object} beleidsObject - Parameter containing the information of a beleid
 * @param {Array} beleidsRelaties - Parameter containing a collection of beleidsRelaties.
 * @param {Array} connectionProperties - Parameter containing a collection of connection properties.
 * @param {Array} connectionPropertiesColors - Parameter containing a collection of connection property colors.
 */
function RelatiesKoppelingenTekstueel({
    beleidsObject,
    beleidsRelaties,
    connectionProperties,
    connectionPropertiesColors,
}) {
    if (!beleidsObject) return null

    const hasKoppelingen = connectionProperties.some((prop) => {
        return beleidsObject[prop] && beleidsObject[prop].length > 0
    })

    if (!beleidsRelaties && !hasKoppelingen) return null

    if (beleidsRelaties.length === 0 && !hasKoppelingen) {
        return (
            <div className="flex">
                <div className="flex flex-col justify-between w-full">
                    <div>
                        <p className="mt-2 leading-7 text-gray-800 break-words">
                            Er zijn nog geen koppelingen naar{" "}
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
                                        titel={koppeling.Object.Titel}
                                        omschrijving={
                                            koppeling.Koppeling_Omschrijving
                                        }
                                        property={property}
                                        UUID={koppeling.Object.UUID}
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
                            {beleidsRelaties.map((beleidsrelatie) => {
                                const relationObject =
                                    getObjectFromRelation(beleidsrelatie)

                                if (!relationObject) return null

                                return (
                                    <ListItem
                                        titel={relationObject.Titel}
                                        property="Beleidskeuzes"
                                        UUID={relationObject.UUID}
                                        connectionPropertiesColors={
                                            connectionPropertiesColors
                                        }
                                    />
                                )
                            })}
                        </ul>
                    </div>
                ) : null}
            </div>
        )
    }
}

/**
 * Component that renders the ListItem component, which displays a list of Verordening items which each item contain a title and description.
 *
 * @component
 *
 * @param {string} property - Parameter containing the property value.
 * @param {UUID} UUID - Parameter containing the UUID value.
 * @param {Array} connectionPropertiesColors - Parameter containing a collection of connection property colors.
 * @param {string} titel - Parameter containing the titel of each list item
 * @param {string} omschrijving - Parameter containing the omschrijving of each list item.
 */
const ListItem = ({
    property,
    UUID,
    connectionPropertiesColors,
    titel,
    omschrijving,
}) => {
    const location = useLocation()

    const generateHref = ({ property, UUID }) => {
        const slugs = {
            Beleidskeuzes: "beleidskeuzes",
            Ambities: "ambities",
            Beleidsregels: "beleidsregels",
            Beleidsprestaties: "beleidsprestaties",
            Belangen: "belangen",
            Maatregelen: "maatregelen",
            Themas: "themas",
            Beleidsdoelen: "Beleidsdoelen",
            Verordeningen: "verordeningen",
        }

        const path = `/detail/${slugs[property]}/${UUID}?fromPage=${location.pathname}`
        return path
    }

    const href = generateHref({ property: property, UUID: UUID })
    const isVerordeningItem = href && href.includes("verordening")

    return (
        <li className="relative block mt-1 text-sm text-gray-800">
            <div className="inline-flex items-center group">
                <Link
                    to={isVerordeningItem ? "#" : href}
                    className={
                        isVerordeningItem ? "cursor-default" : "hover:underline"
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
                {omschrijving && omschrijving !== "" ? (
                    <div className="absolute top-0 z-20 hidden mt-8 cursor-default group-hover:block d3-tooltip-text">
                        <div
                            id={UUID}
                            style={{ maxWidth: "50vw" }}
                            className="px-4 py-2 text-white bg-gray-900 rounded shadow"
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
