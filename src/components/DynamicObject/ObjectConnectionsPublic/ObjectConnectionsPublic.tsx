import { Heading, ListLink, Text, getHeadingStyles } from '@pzh-ui/components'

import * as models from '@/config/objects'
import { Model, ModelReturnType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'

interface ObjectConnectionsPublicProps {
    model: Model
    data: ModelReturnType
}

const ObjectConnectionsPublic = ({
    model,
    data,
}: ObjectConnectionsPublicProps) => {
    const { isMobile } = useBreakpoint()

    return (
        <div data-section="Koppelingen">
            <h2
                className="mb-4 text-pzh-blue"
                style={getHeadingStyles('3', isMobile)}>
                Koppelingen
            </h2>
            <Text className="first-letter:capitalize">
                {model.connectionsDescription}
            </Text>

            {model.allowedConnections?.map(connection => {
                const items = data[connection.key]
                const model = models[connection.type]

                return (
                    <div key={connection.type} className="mt-6">
                        <Heading level="3" className="mb-2">
                            {connection.key}
                        </Heading>

                        {Array.isArray(items) && items.length > 0 ? (
                            <ul>
                                {items.map(item => (
                                    <li key={item.Object.UUID}>
                                        <ListLink
                                            to={`/omgevingsvisie/${model.defaults.plural}/${item.Object.UUID}`}
                                            text={item.Object.Title || ''}
                                            className="text-pzh-green hover:text-pzh-green-dark"
                                        />
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
