import { Heading, ListLink, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { HierachyReference } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import { generateObjectPath } from '@/utils/dynamicObject'
import groupBy from 'lodash.groupby'
import { useMemo } from 'react'

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

    const relationChildrens = useMemo(() => {
        if (!data.Hierarchy_Children) return

        const grouped = groupBy(data.Hierarchy_Children, 'Object_Type')
        const sorted = Object.keys(grouped)
            .sort()
            .reduce((obj: any, key) => {
                obj[key] = grouped[key]
                return obj
            }, {})

        return sorted
    }, [data.Hierarchy_Children]) as { [key in ModelType]: HierachyReference[] }

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

            {!!relationChildrens &&
                Object.keys(relationChildrens).map(type => {
                    const model = models[type as ModelType]
                    const items =
                        relationChildrens[
                            type as keyof typeof relationChildrens
                        ]

                    return (
                        <div key={type} className="mt-6">
                            <Heading level="3" size="m" className="mb-2">
                                {model.defaults.pluralCapitalize}
                            </Heading>

                            {Array.isArray(items) && items.length > 0 ? (
                                <ul>
                                    {items.map(item => (
                                        <li key={item.UUID}>
                                            <ListLink
                                                asChild
                                                className="text-pzh-green-500 hover:text-pzh-green-900">
                                                <Link
                                                    to={generateObjectPath(
                                                        type as ModelType,
                                                        item.UUID
                                                    )}>
                                                    {item.Title}
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
