import { Heading, ListLink, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import * as models from '@/config/objects'
import { Model, ModelReturnType } from '@/config/objects/types'
import { generateObjectPath } from '@/utils/dynamicObject'

interface ObjectConnectionsPublicProps {
    model: Model
    data: ModelReturnType
}

const ObjectConnectionsPublic = ({
    model,
    data,
}: ObjectConnectionsPublicProps) => (
    <div data-section="Koppelingen">
        <Heading level="2" className="mb-4">
            Koppelingen
        </Heading>
        <Text className="first-letter:capitalize">
            {model.connectionsDescription}
        </Text>

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
                        <span className="italic text-pzh-gray-600">
                            Er zijn nog geen {model.defaults.plural} gekoppeld
                        </span>
                    )}
                </div>
            )
        })}
    </div>
)

export default ObjectConnectionsPublic
