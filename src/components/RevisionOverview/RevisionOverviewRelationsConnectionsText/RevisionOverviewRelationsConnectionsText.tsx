import RevisionOverviewContainerLeft from '@/components/RevisionOverview/RevisionOverviewContainerLeft'
import RevisionOverviewContainerMain from '@/components/RevisionOverview/RevisionOverviewContainerMain'
import RevisionOverviewContainerRight from '@/components/RevisionOverview/RevisionOverviewContainerRight'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'

export interface RevisionOverviewRelationsConnectionsTextProps {
    originalObject: any
    objectChanges: any
}

/**
 * Displays two containers containing the connected relations between objects.
 */
function RevisionOverviewRelationsConnectionsText({
    originalObject,
    objectChanges,
}: RevisionOverviewRelationsConnectionsTextProps) {
    if (!originalObject || !objectChanges) return null

    /**
     * The changeObject connection properties contain objects with three potential properties:
     * { new: {}, same: {}, removed: {} }
     * We loop through these properties and push them into an array
     * The key (e.g. 'new') is pushed onto the object under the property 'changeType'
     * This changeType property determines the styling
     * @param {string} property - Property that contains the values
     * @param {object} obj - Object to get the values from
     * @returns {array} containing the changed objects
     */
    const getValuesOfChangeObject = (property: string, obj: any) => {
        const values: any[] = []

        if (!obj[property]) return values

        // Else we need to get the values from the changes properties ('removed', 'same', etc.)
        Object.keys(obj[property]).forEach(key =>
            obj[property][key].forEach((value: any) => {
                values.push({ ...value, changeType: key })
            })
        )

        return values
    }

    return (
        <div>
            {connectionProperties.map((property, index) => {
                const valuesOld: any[] = originalObject[property]
                    ? originalObject[property]
                    : []
                const valuesChanges = getValuesOfChangeObject(
                    property,
                    objectChanges
                )

                return (
                    <RevisionOverviewContainerMain key={`relation-${index}`}>
                        <RevisionOverviewContainerLeft>
                            <div className="mt-4">
                                <h3 className="text-sm font-bold text-gray-800">
                                    {property}
                                </h3>
                                {valuesOld?.length ? (
                                    <ul className="mt-2">
                                        {valuesOld.map((connection, index) => (
                                            <ConnectionListItem
                                                key={`connection-${index}`}
                                                connection={connection}
                                                property={property}
                                            />
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="mt-2 italic text-gray-700">
                                        Er zijn geen {property.toLowerCase()}{' '}
                                        gekoppeld
                                    </span>
                                )}
                            </div>
                        </RevisionOverviewContainerLeft>
                        <RevisionOverviewContainerRight>
                            <div className="mt-4">
                                <h3 className="text-sm font-bold text-gray-800">
                                    {property}
                                </h3>
                                {valuesChanges?.length ? (
                                    <ul className="mt-2">
                                        {valuesChanges.map(
                                            (connection, index) => (
                                                <ConnectionListItem
                                                    key={`connection-item-${index}`}
                                                    connection={connection}
                                                    property={property}
                                                />
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <span className="mt-2 italic text-gray-700">
                                        Er zijn geen {property.toLowerCase()}{' '}
                                        gekoppeld
                                    </span>
                                )}
                            </div>
                        </RevisionOverviewContainerRight>
                    </RevisionOverviewContainerMain>
                )
            })}
        </div>
    )
}

/**
 * Displays list of connected list items.
 *
 * @param {string} property - Name of the property used to define the color
 * @param {object} connection - Contains the connection information of a revision
 * @returns A list item that displays the connecting (and potentially the changes to it)
 */
const ConnectionListItem = ({
    property,
    connection,
}: {
    property: string
    connection: any
}) => {
    /**
     * Gets style to indicate changes to the object
     */
    const textStyle =
        connection.changeType === 'removed'
            ? { backgroundColor: '#f4c9c6', textDecoration: 'line-through' } // Removed - Red
            : connection.changeType === 'new'
            ? { backgroundColor: '#e5f0ef' } // New - Green
            : {} // Default

    return (
        <li className="relative block mt-2 text-sm text-gray-800">
            <div className="inline-flex items-center group">
                <div className="flex">
                    <span
                        className={`inline-block w-3 h-3 flex-shrink-0 mr-2 rounded-full`}
                        style={{
                            backgroundColor:
                                networkGraphConnectionProperties[
                                    property.toLowerCase() as keyof typeof networkGraphConnectionProperties
                                ].hex,
                        }}
                    />
                    <div>
                        <span className="block px-1" style={textStyle}>
                            {connection.Object?.Titel}
                        </span>
                        {connection.Koppeling_Omschrijving ? (
                            <span
                                className="block px-1 mt-1 text-xs"
                                style={textStyle}>
                                {connection.Koppeling_Omschrijving}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </li>
    )
}

const connectionProperties = [
    'Ambities',
    'Beleidsregels',
    'Beleidsprestaties',
    'Maatregelen',
    'Beleidsdoelen',
    'Themas',
    'Verordeningen',
]

export default RevisionOverviewRelationsConnectionsText
