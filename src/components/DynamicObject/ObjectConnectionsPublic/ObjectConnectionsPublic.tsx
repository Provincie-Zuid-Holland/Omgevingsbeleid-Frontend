import { Heading, ListLink, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import { generateObjectPath } from '@/utils/dynamicObject'

interface ObjectConnectionsPublicProps {
    model: Model
    data: ModelReturnType
}

const ObjectConnectionsPublic = ({
    model,
    data,
}: ObjectConnectionsPublicProps) => {
    const acknowledgedRelationModel =
        data.Hierarchy_Statics &&
        models[data.Hierarchy_Statics.Object_Type as ModelType]

    return (
        <div data-section="Koppelingen">
            <Heading level="2" className="mb-4">
                Koppelingen
            </Heading>
            <Text className="first-letter:capitalize">
                {model.connectionsDescription}
            </Text>

            {acknowledgedRelationModel && (
                <div className="mt-6">
                    <Heading level="3" size="m" className="mb-2">
                        {acknowledgedRelationModel.defaults.pluralCapitalize}
                    </Heading>

                    <ul>
                        <li>
                            <ListLink
                                asChild
                                className="text-pzh-green-500 hover:text-pzh-green-900">
                                <Link
                                    to={generateObjectPath(
                                        acknowledgedRelationModel.defaults
                                            .singular,
                                        String(
                                            data.Hierarchy_Statics?.Object_ID
                                        )
                                    )}>
                                    {data.Hierarchy_Statics?.Cached_Title}
                                </Link>
                            </ListLink>
                        </li>
                    </ul>
                </div>
            )}

            {model.allowedConnections?.map(connection => {
                const items = data[connection.key]
                const model = models[connection.type]

                return (
                    <div key={connection.type} className="mt-6">
                        <Heading level="3" size="m" className="mb-2">
                            {model.defaults.pluralCapitalize}
                        </Heading>

                        {Array.isArray(items) && items.length > 0 ? (
                            <ul>
                                {(items as any[]).map(item => (
                                    <li key={item.Object.UUID}>
                                        <ListLink
                                            asChild
                                            className="text-pzh-green-500 hover:text-pzh-green-900">
                                            <Link
                                                to={generateObjectPath(
                                                    connection.type,
                                                    item.Object.UUID
                                                )}>
                                                {item.Object.Title}
                                            </Link>
                                        </ListLink>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span className="text-pzh-gray-600 italic">
                                Er zijn nog geen {model.defaults.plural}{' '}
                                gekoppeld
                            </span>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default ObjectConnectionsPublic
