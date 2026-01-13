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
}: ObjectConnectionsPublicProps) => {
    // const { moduleId } = useParams()
    // const { user } = useAuth()

    // const acknowledgedRelationModel =
    //     data.Hierarchy_Statics &&
    //     models[data.Hierarchy_Statics.Object_Type as ModelType]
    // const { useGetLatestLineage, useGetLatestLineageInModule } =
    //     acknowledgedRelationModel?.fetchers || {}

    // const {
    //     data: moduleData,
    //     isSuccess,
    //     isError,
    // } = useGetLatestLineageInModule?.(
    //     parseInt(moduleId!),
    //     Number(data.Hierarchy_Statics?.Object_ID),
    //     {
    //         query: {
    //             enabled:
    //                 !!moduleId && !!data.Hierarchy_Statics?.Object_ID && !!user,
    //         },
    //     }
    // ) || {}

    // const { data: validData } =
    //     useGetLatestLineage?.(Number(data.Hierarchy_Statics?.Object_ID), {
    //         query: {
    //             enabled:
    //                 (!moduleId && !!data.Hierarchy_Statics?.Object_ID) ||
    //                 (!!moduleId &&
    //                     !!data.Hierarchy_Statics?.Object_ID &&
    //                     !moduleData &&
    //                     isSuccess) ||
    //                 isError,
    //         },
    //     }) || {}

    // const acknowledgedRelation = moduleId && isSuccess ? moduleData : validData

    // const relationChildrens = useMemo(() => {
    //     if (!data.Hierarchy_Children) return

    //     const grouped = groupBy(data.Hierarchy_Children, 'Object_Type')
    //     const sorted = Object.keys(grouped)
    //         .sort()
    //         .reduce((obj: any, key) => {
    //             obj[key] = grouped[key]
    //             return obj
    //         }, {})

    //     return sorted
    // }, [data.Hierarchy_Children]) as { [key in ModelType]: HierachyReference[] }

    return (
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
                            <span className="text-pzh-gray-600 italic">
                                Er zijn nog geen {model.defaults.plural}{' '}
                                gekoppeld
                            </span>
                        )}
                    </div>
                )
            })}

            {/* {acknowledgedRelationModel && (
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
                                        String(acknowledgedRelation?.UUID)
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
                })} */}
        </div>
    )
}

export default ObjectConnectionsPublic
