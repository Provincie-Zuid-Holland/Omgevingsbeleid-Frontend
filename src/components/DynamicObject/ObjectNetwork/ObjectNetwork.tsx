import groupBy from 'lodash.groupby'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Heading, Text } from '@pzh-ui/components'
import { Triangle } from '@pzh-ui/icons'

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
        { query: { enabled: !!data.UUID, onError: () => {} } }
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
        <div className="grid grid-cols-4 rounded-[4px] border border-pzh-gray-500 px-6 py-4 ">
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
                                            className="flex items-start"
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
                <Triangle size={12} className="mt-[2px] text-pzh-apple-green" />
            )
        case 'beleidsdoel':
            return (
                <div className="mt-[2px] h-[12px] w-[12px] rounded-[2px] bg-pzh-orange" />
            )
        case 'beleidskeuze':
            return (
                <div className="mt-[2px] h-[12px] w-[12px] rounded-full bg-pzh-yellow" />
            )
        case 'maatregel':
            return (
                <div className="mr-[2px] mt-[2px] h-[10px] w-[10px] rotate-45 rounded-[2px] bg-pzh-green" />
            )
    }
}

export default ObjectNetwork
