import { useMemo } from 'react'

import { Heading, Hyperlink, ListLink, Text } from '@pzh-ui/components'

import groupBy from 'lodash.groupby'
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
import { sortByFields } from '@/utils/sortByFields'

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

    const acknowledgedRelationModel: Model | undefined = data.hierarchy_statics
        ? models[data.hierarchy_statics.object_type as ModelType]
        : undefined
    const { useGetLatestLineage, useGetLatestLineageInModule } =
        acknowledgedRelationModel?.fetchers || {}

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useGetLatestLineageInModule?.(
        parseInt(moduleId!),
        Number(data.hierarchy_statics?.object_id),
        {
            query: {
                enabled:
                    !!moduleId && !!data.hierarchy_statics?.object_id && !!user,
            },
        }
    ) || {}

    const { data: validData } =
        (useGetLatestLineage as QueryHook | null | undefined)?.(
            Number(data.hierarchy_statics?.object_id),
            {
                query: {
                    enabled:
                        (!moduleId && !!data.hierarchy_statics?.object_id) ||
                        (!!moduleId &&
                            !!data.hierarchy_statics?.object_id &&
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
        if (!data.hierarchy_children) return

        const grouped = groupBy(
            data.hierarchy_children,
            'object_type'
        ) as Partial<Record<ModelType, HierachyReference[]>>

        return (Object.keys(grouped) as ModelType[])
            .sort()
            .reduce<Partial<Record<ModelType, HierachyReference[]>>>(
                (acc, key) => {
                    acc[key] = sortByFields(grouped[key] ?? [], [
                        item => item.title,
                    ])

                    return acc
                },
                {}
            )
    }, [data.hierarchy_children])

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
                                      String(acknowledgedRelation?.id)
                                  )}>
                                  {data.hierarchy_statics?.cached_title}
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
                                        <li key={item.id}>
                                            <ListLink
                                                asChild
                                                className="text-pzh-green-500 hover:text-pzh-green-900">
                                                <Link
                                                    to={generateObjectPath(
                                                        type as ModelType,
                                                        item.id
                                                    )}>
                                                    {item.title}
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
