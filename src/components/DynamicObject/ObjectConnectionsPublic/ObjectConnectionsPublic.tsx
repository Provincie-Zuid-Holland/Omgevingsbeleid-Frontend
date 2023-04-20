import { Heading, ListLink, Text } from '@pzh-ui/components'

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
        <Heading level="2" className="mb-4 text-pzh-blue">
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
                    <Heading level="3" className="mb-2">
                        {model.defaults.pluralCapitalize}
                    </Heading>

                    {Array.isArray(items) && items.length > 0 ? (
                        <ul>
                            {items.map(item => (
                                <li key={item.Object.UUID}>
                                    <ListLink
                                        to={generateObjectPath(
                                            connection.type,
                                            item.Object.UUID
                                        )}
                                        text={item.Object.Title || ''}
                                        className="text-pzh-green hover:text-pzh-green-dark"
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <span className="text-pzh-gray-600 italic">
                            Er zijn nog geen {model.defaults.plural} gekoppeld
                        </span>
                    )}
                </div>
            )
        })}
    </div>
)

export default ObjectConnectionsPublic
