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
        (element: HTMLAnchorElement, code: string, type: 'enter' | 'leave') => {
            const el = document.querySelector(`[data-code-shape="${code}"]`)

            if (type === 'enter') {
                element.classList.add('font-bold')
                el?.classList.add('stroke-pzh-blue-dark')
            } else {
                element.classList.remove('font-bold')
                el?.classList.remove('stroke-pzh-blue-dark')
            }
        },
        []
    )

    if (Object.keys(relations).length === 0) return null

    return (
        <div className="grid grid-cols-4 rounded border border-pzh-gray-500 px-6 py-4 ">
            <div className="col-span-6">
                <Heading level="3" size="m" color="text-pzh-green">
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
                            <Text bold className="mb-2 mt-4">
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
                <Triangle size={12} className="mt-0.5 text-pzh-apple-green" />
            )
        case 'beleidsdoel':
            return <div className="rounded-0.5 mt-0.5 h-3 w-3 bg-pzh-orange" />
        case 'beleidskeuze':
            return <div className="size-3 mt-0.5 rounded-full bg-pzh-yellow" />
        case 'maatregel':
            return (
                <div className="rounded-0.5 mr-0.5 mt-0.5 h-2.5 w-2.5 min-w-[10px] rotate-45 bg-pzh-green" />
            )
    }
}

export default ObjectNetwork
