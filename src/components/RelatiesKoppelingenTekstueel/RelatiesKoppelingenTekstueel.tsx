import { Link } from 'react-router-dom'

import { Beleidskeuze, Beleidsrelatie } from '@/api/fetchers.schemas'
import { generateHrefVerordeningsartikel } from '@/utils/generateHrefVerordeningsartikel'

import {
    ConnectionProperties,
    connectionPropertiesColors,
} from '../RelatiesKoppelingen'

const getObjectFromRelation = (relation: Beleidsrelatie) => {
    return relation.hasOwnProperty('Van_Beleidskeuze')
        ? relation.Van_Beleidskeuze
        : relation.hasOwnProperty('Naar_Beleidskeuze')
        ? relation.Naar_Beleidskeuze
        : relation
}

const slugs = {
    Beleidskeuzes: 'beleidskeuzes',
    Beleidsregels: 'beleidsregels',
    Beleidsprestaties: 'beleidsprestaties',
    Belangen: 'belangen',
    Maatregelen: 'maatregelen',
    Themas: 'themas',
    Beleidsdoelen: 'Beleidsdoelen',
    Verordeningen: 'verordeningen',
}

/**
 * Displays the connections between beleids objecten.
 *
 * @param {object} beleidsObject - Contains the information of a beleid in object form.
 * @param {Array} beleidsRelaties - Contains a collection of beleidsRelaties.
 * @param {Array} connectionProperties - Contains a collection of connection properties.
 * @param {object} connectionPropertiesColors - Contains a collection of connection property colors in object form.
 */

interface RelatiesKoppelingenTekstueelProps {
    beleidsObject: Beleidskeuze
    connectionProperties: ConnectionProperties[]
    connectionPropertiesColors: typeof connectionPropertiesColors
    beleidsRelaties: Beleidsrelatie[]
    verordeningsStructure: any
}

function RelatiesKoppelingenTekstueel({
    beleidsObject,
    beleidsRelaties,
    connectionProperties,
    connectionPropertiesColors,
    verordeningsStructure,
}: RelatiesKoppelingenTekstueelProps) {
    if (!beleidsObject) return null

    const hasKoppelingen = connectionProperties.some(prop => {
        return beleidsObject[prop] && beleidsObject[prop]!.length > 0
    })

    if (!beleidsRelaties && !hasKoppelingen) return null

    if (beleidsRelaties.length === 0 && !hasKoppelingen) {
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
                {connectionProperties.map((property, index) => {
                    if (
                        !beleidsObject[property] ||
                        beleidsObject[property]!.length === 0
                    )
                        return null

                    return (
                        <div
                            key={`connection-property-${index}`}
                            className="mt-4">
                            <h3 className="text-sm font-bold text-gray-800">
                                {property}
                            </h3>
                            <ul className="mt-2">
                                {beleidsObject[property]?.map(
                                    (koppeling, index) => (
                                        <ListItem
                                            key={`koppeling-${index}`}
                                            verordeningsStructure={
                                                verordeningsStructure
                                            }
                                            titel={
                                                koppeling?.Object?.Titel || ''
                                            }
                                            omschrijving={
                                                koppeling.Koppeling_Omschrijving
                                            }
                                            property={property}
                                            UUID={koppeling?.Object?.UUID || ''}
                                            connectionPropertiesColors={
                                                connectionPropertiesColors
                                            }
                                        />
                                    )
                                )}
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
                            {beleidsRelaties.map((beleidsrelatie, index) => {
                                const relationObject =
                                    getObjectFromRelation(beleidsrelatie)

                                if (!relationObject) return null

                                return (
                                    <ListItem
                                        key={`beleidsrelatie-${index}`}
                                        verordeningsStructure={
                                            verordeningsStructure
                                        }
                                        titel={
                                            ('Titel' in relationObject &&
                                                relationObject.Titel) ||
                                            ''
                                        }
                                        property="Beleidskeuzes"
                                        UUID={relationObject.UUID || ''}
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
 * Displays a list of Verordening items which each item contains a title and description.
 *
 * @param {string} property - Contains the property value.
 * @param {string} UUID - Contains the UUID value.
 * @param {object} connectionPropertiesColors - Contains a collection of connection property colors.
 * @param {string} titel - Contains the titel of each list item
 * @param {string} omschrijving - Contains the omschrijving of each list item.
 */

interface ListItemProps {
    property: keyof typeof slugs
    UUID: string
    connectionPropertiesColors: typeof connectionPropertiesColors
    titel: string
    verordeningsStructure: any
    omschrijving?: string
}

const ListItem = ({
    property,
    UUID,
    connectionPropertiesColors,
    titel,
    verordeningsStructure,
    omschrijving,
}: ListItemProps) => {
    const generateHref = ({
        property,
        UUID,
    }: {
        property: keyof typeof slugs
        UUID: string
    }) => {
        const path = `/${slugs[property]}/${UUID}`
        return path
    }

    const href =
        property === 'Verordeningen'
            ? generateHrefVerordeningsartikel(UUID, verordeningsStructure)
            : generateHref({ property: property, UUID: UUID })

    return (
        <li className="relative block mt-1 text-sm text-gray-800">
            <div className="inline-flex items-center group">
                <Link to={href || ''} className={'hover:underline'}>
                    <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full`}
                        style={{
                            backgroundColor:
                                connectionPropertiesColors[property].hex,
                        }}
                    />
                    <span>{titel}</span>
                </Link>
                {omschrijving ? (
                    <div className="absolute z-20 hidden pb-0 -mt-4 cursor-default group-hover:block">
                        <div
                            id={UUID}
                            style={{ maxWidth: '50vw' }}
                            className="px-4 py-2 text-white bg-gray-900 rounded shadow">
                            {omschrijving}
                        </div>
                    </div>
                ) : null}
            </div>
        </li>
    )
}

export default RelatiesKoppelingenTekstueel
