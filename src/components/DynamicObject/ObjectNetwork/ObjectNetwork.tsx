import { Heading, Text } from '@pzh-ui/components'
import { Triangle } from '@pzh-ui/icons'
import groupBy from 'lodash.groupby'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useGraphGetObjectGraph } from '@/api/fetchers'
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
    const { data: graph } = useGraphGetObjectGraph(
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
        (element: HTMLAnchorElement, code: string, type: 'enter' | 'leave') => {
            const el = document.querySelector(`[data-code-shape="${code}"]`)

            if (type === 'enter') {
                element.classList.add('font-bold')
                el?.classList.add('!stroke-pzh-blue-900')
            } else {
                element.classList.remove('font-bold')
                el?.classList.remove('!stroke-pzh-blue-900')
            }
        },
        []
    )

    if (Object.keys(relations).length === 0) return null

    return (
        <div className="border-pzh-gray-500 grid grid-cols-4 rounded border px-6 py-4">
            <div className="col-span-6">
                <Heading level="3" size="m" color="text-pzh-green-500">
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
                            <Heading level="4" size="s" className="mt-4 mb-2">
                                {model.defaults.pluralCapitalize}
                            </Heading>

                            {Array.isArray(objects) &&
                                objects.map(object => (
                                    <div key={object.UUID} className="mb-1">
                                        <Link
                                            to={generateObjectPath(
                                                index as ModelType,
                                                object.UUID
                                            )}
                                            className="flex items-baseline"
                                            data-code-link={object.Code}
                                            onMouseEnter={el =>
                                                handleMouseInteraction(
                                                    el.currentTarget,
                                                    object.Code,
                                                    'enter'
                                                )
                                            }
                                            onMouseLeave={el =>
                                                handleMouseInteraction(
                                                    el.currentTarget,
                                                    object.Code,
                                                    'leave'
                                                )
                                            }>
                                            {getObjectIcon(index as ModelType)}
                                            <Text size="s" className="ml-3">
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
                <Triangle
                    size={12}
                    className="text-pzh-apple-green-500 mt-0.5"
                    stroke="black"
                    strokeWidth={40}
                />
            )
        case 'beleidsdoel':
            return (
                <div className="rounded-0.5 bg-pzh-orange-500 border-pzh-black mt-0.5 h-3 w-3 border" />
            )
        case 'beleidskeuze':
            return (
                <div className="bg-pzh-yellow-500 border-pzh-black mt-0.5 h-3 w-3 rounded-full border" />
            )
        case 'maatregel':
            return (
                <div className="rounded-0.5 bg-pzh-green-500 border-pzh-black mt-0.5 mr-0.5 h-2.5 w-2.5 min-w-[10px] rotate-45 border" />
            )
    }
}

export default ObjectNetwork
