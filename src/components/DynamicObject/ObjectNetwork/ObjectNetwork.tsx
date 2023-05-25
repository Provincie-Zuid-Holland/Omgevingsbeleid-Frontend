import { Heading, Text } from '@pzh-ui/components'
import { Triangle } from '@pzh-ui/icons'
import groupBy from 'lodash.groupby'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useObjectGraphGet } from '@/api/fetchers'
import { GraphVertice } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import { generateObjectPath } from '@/utils/dynamicObject'

import Visual from './Visual'

interface ObjectNetworkProps {
    model: Model
    data: ModelReturnType
}

const ObjectNetwork = ({ data }: ObjectNetworkProps) => {
    const { data: graph } = useObjectGraphGet(
        { uuid: data.UUID! },
        { query: { enabled: !!data.UUID } }
    )

    /**
     * Format relations
     */
    const relations = useMemo(() => {
        if (!graph?.Vertices) return {}

        const grouped = groupBy(graph.Vertices, 'Object_Type')
        const sorted = Object.keys(grouped)
            .sort()
            .reduce((obj: any, key) => {
                obj[key] = grouped[key]
                return obj
            }, {})

        return sorted
    }, [graph?.Vertices]) as { [key in ModelType]: GraphVertice[] }

    /**
     * Highlight connected shape on hover
     */
    const handleMouseInteraction = useCallback(
        (code: string, type: 'enter' | 'leave') => {
            const el = document.querySelector(`[data-code-shape="${code}"]`)

            if (type === 'enter') {
                el?.classList.add('stroke-pzh-blue-dark')
            } else {
                el?.classList.remove('stroke-pzh-blue-dark')
            }
        },
        []
    )

    if (Object.keys(relations).length === 0) return null

    return (
        <div className="grid grid-cols-4 py-4 px-6 border border-pzh-gray-500 rounded-[4px] ">
            <div className="col-span-6">
                <Heading level="3" className="text-pzh-green">
                    Beleidsnetwerk
                </Heading>
            </div>

            <div className="col-span-2">
                {Object.keys(relations).map(index => {
                    const objects = relations[index as ModelType]
                    const model = models[index as ModelType]

                    if (Array.isArray(objects) && !objects.length) return null

                    return (
                        <div key={index}>
                            <Text type="body-bold" className="mb-2 mt-4">
                                {model.defaults.pluralCapitalize}
                            </Text>

                            {Array.isArray(objects) &&
                                objects.map(object => (
                                    <div key={object.UUID} className="mb-1">
                                        <Link
                                            to={generateObjectPath(
                                                index as ModelType,
                                                object.UUID
                                            )}
                                            className="flex items-start hover:font-bold"
                                            data-code-link={object.Code}
                                            onMouseEnter={() =>
                                                handleMouseInteraction(
                                                    object.Code,
                                                    'enter'
                                                )
                                            }
                                            onMouseLeave={() =>
                                                handleMouseInteraction(
                                                    object.Code,
                                                    'leave'
                                                )
                                            }>
                                            {getObjectIcon(index as ModelType)}
                                            <Text
                                                type="body-small"
                                                className="ml-3">
                                                {object.Title}
                                            </Text>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    )
                })}
            </div>

            <div className="col-span-2">
                {graph && <Visual graph={graph} />}
            </div>
        </div>
    )
}

const getObjectIcon = (key: ModelType) => {
    switch (key) {
        case 'ambitie':
            return (
                <Triangle size={12} className="text-pzh-apple-green mt-[2px]" />
            )
        case 'beleidsdoel':
            return (
                <div className="w-[12px] h-[12px] bg-pzh-orange rounded-[2px] mt-[2px]" />
            )
        case 'beleidskeuze':
            return (
                <div className="w-[12px] h-[12px] bg-pzh-yellow rounded-full mt-[2px]" />
            )
        case 'maatregel':
            return (
                <div className="w-[10px] h-[10px] bg-pzh-green rounded-[2px] mt-[2px] mr-[2px] rotate-45" />
            )
    }
}

export default ObjectNetwork
