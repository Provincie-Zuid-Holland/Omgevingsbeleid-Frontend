import { Heading, Hyperlink, ListLink, Text } from '@pzh-ui/components'
import { Link, useParams } from 'react-router-dom'

import { HierachyReference } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import {
    Model,
    ModelReturnType,
    ModelType,
    QueryHook,
} from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'
import { generateObjectPath } from '@/utils/dynamicObject'
import groupBy from 'lodash.groupby'
import { useMemo } from 'react'
import ObjectNetwork from '../ObjectNetwork'

interface ObjectConnectionsPublicProps {
    model: Model
    data: ModelReturnType
}

const ObjectConnectionsPublic = ({
    model,
    data,
}: ObjectConnectionsPublicProps) => {
    const { moduleId } = useParams()
    const { user } = useAuth()

    const acknowledgedRelationModel =
        data.Hierarchy_Statics &&
        models[data.Hierarchy_Statics.Object_Type as ModelType]
    const { useGetLatestLineage, useGetLatestLineageInModule } =
        acknowledgedRelationModel?.fetchers || {}

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useGetLatestLineageInModule?.(
        parseInt(moduleId!),
        Number(data.Hierarchy_Statics?.Object_ID),
        {
            query: {
                enabled:
                    !!moduleId && !!data.Hierarchy_Statics?.Object_ID && !!user,
            },
        }
    ) || {}

    const { data: validData } =
        (useGetLatestLineage as QueryHook | null | undefined)?.(
            Number(data.Hierarchy_Statics?.Object_ID),
            {
                query: {
                    enabled:
                        (!moduleId && !!data.Hierarchy_Statics?.Object_ID) ||
                        (!!moduleId &&
                            !!data.Hierarchy_Statics?.Object_ID &&
                            !moduleData &&
                            isSuccess) ||
                        isError,
                },
            }
        ) || {}

    const acknowledgedRelation = moduleId && isSuccess ? moduleData : validData

    /**
     * Group Hierarchy_Children by Object_Type
     */
    const relationChildrens = useMemo(() => {
        if (!data.Hierarchy_Children) return

        const grouped = groupBy(
            data.Hierarchy_Children,
            'Object_Type'
        ) as Partial<Record<ModelType, HierachyReference[]>>

        return (Object.keys(grouped) as ModelType[])
            .sort()
            .reduce<
                Partial<Record<ModelType, HierachyReference[]>>
            >((acc, key) => {
                acc[key] = (grouped[key] ?? []).sort((a, b) =>
                    (a.Title ?? '').localeCompare(b.Title ?? '')
                )
                return acc
            }, {})
    }, [data.Hierarchy_Children])

    return (
        <div data-section="Samenhang van het beleid">
            <Heading level="2" className="mb-4">
                Samenhang van het beleid
            </Heading>
            <Text className="first-letter:capitalize">
                {typeof model.connectionsDescription === 'function'
                    ? acknowledgedRelationModel &&
                      model.connectionsDescription(
                          <Hyperlink asChild>
                              <Link
                                  to={generateObjectPath(
                                      acknowledgedRelationModel.defaults
                                          .singular,
                                      String(acknowledgedRelation?.UUID)
                                  )}>
                                  {data.Hierarchy_Statics?.Cached_Title}
                              </Link>
                          </Hyperlink>
                      )
                    : model.connectionsDescription}
            </Text>

            {!!relationChildrens &&
                !model.acknowledgedRelation &&
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

            {!!model.acknowledgedRelation && (
                <div className="mt-6">
                    <ObjectNetwork data={data} model={model} />
                </div>
            )}
        </div>
    )
}

export default ObjectConnectionsPublic
