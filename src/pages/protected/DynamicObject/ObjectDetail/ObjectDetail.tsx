import { Button, Heading } from '@pzh-ui/components'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import ObjectConnections from '@/components/DynamicObject/ObjectConnections'
import ObjectDefaultInfo from '@/components/DynamicObject/ObjectDefaultInfo'
import LineageCard from '@/components/DynamicObject/ObjectLineageCard'
import ObjectRelatedObjects from '@/components/DynamicObject/ObjectRelatedObjects'
import ObjectRelations from '@/components/DynamicObject/ObjectRelations'
import MutateLayout from '@/templates/MutateLayout'

import { LoaderCard } from '@/components/Loader'
import type { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import { formatValidityDate } from '@/utils/formatValidityDate'
import { keepPreviousData } from '@tanstack/react-query'

const PAGE_LIMIT = 3

interface ObjectDetailProps {
    model: Model
}

const ObjectDetail = ({ model }: ObjectDetailProps) => {
    const { objectId } = useParams()
    const objectIdNum = objectId ? Number(objectId) : undefined

    const [pageIndex, setPageIndex] = useState(1)

    const { singularCapitalize, plural, pluralCapitalize } = model.defaults
    const { useGetActiveModules, useGetValidLineage } = model.fetchers

    const { data: object, isLoading } = useObject()

    const {
        data: activeModules,
        isLoading: activeModulesLoading,
        isFetching,
    } = useGetActiveModules?.(
        parseInt(objectId!),
        { minimum_status: 'Ontwerp GS Concept' },
        {
            query: { enabled: !!objectId },
        }
    ) || {}

    const { data: validLineage, isLoading: validLineageLoading } =
        useGetValidLineage?.(
            objectIdNum ?? 0,
            {
                limit: pageIndex * PAGE_LIMIT,
            },
            {
                query: {
                    enabled: Boolean(objectIdNum),
                    placeholderData: keepPreviousData,
                },
            }
        ) || {}

    const lineage = useMemo(() => {
        const fromActive = (activeModules ?? []).map(item => (
            <LineageCard
                key={item.Module_Object.UUID}
                model={model}
                status={item.Module.Status?.Status}
                module={item.Module}
                {...item.Module_Object}
            />
        ))
        const fromValid = (validLineage?.results ?? []).map(item => (
            <LineageCard
                key={item.UUID}
                model={model}
                status={
                    item.UUID === object?.UUID ? 'Vigerend' : 'Gearchiveerd'
                }
                validDate={formatValidityDate({ ...item, withPrefix: false })}
                {...item}
            />
        ))
        return [...fromActive, ...fromValid]
    }, [activeModules, validLineage, object])

    const lineageLoading =
        isLoading || activeModulesLoading || validLineageLoading

    // Breadcrumbs
    const breadcrumbs = useMemo(() => {
        const base = [{ name: 'Dashboard', path: '/muteer' }]
        const tail = [
            {
                name:
                    (!!object
                        ? object.Title
                        : activeModules?.[0]?.Module_Object.Title) || '',
                isCurrent: true,
            },
        ]

        return [
            ...base,
            { name: pluralCapitalize, path: `/muteer/${plural}` },
            ...tail,
        ]
    }, [object?.Title, plural, pluralCapitalize, activeModules])

    return (
        <MutateLayout
            title={`${singularCapitalize}: ${object?.Title ?? ''}`}
            breadcrumbs={breadcrumbs}>
            <div className="col-span-6 flex flex-col gap-6 sm:col-span-4">
                <Heading level="1" size="m">
                    {singularCapitalize}
                </Heading>

                {lineageLoading ? (
                    <LoaderCard height="165" />
                ) : (
                    <>
                        {lineage}
                        {pageIndex * PAGE_LIMIT <
                            (validLineage?.total || 0) && (
                            <Button
                                className="self-end"
                                onPress={() => setPageIndex(prev => prev + 1)}
                                isLoading={isFetching}>
                                Laad meer versies
                            </Button>
                        )}
                    </>
                )}
            </div>

            <div className="col-span-6 mt-6 sm:col-span-2 sm:mt-0">
                <ObjectDefaultInfo model={model} />

                {Boolean(model.allowedConnections?.length) && (
                    <ObjectConnections model={model} />
                )}

                {Boolean(model.acknowledgedRelation) && (
                    <ObjectRelations model={model} />
                )}

                {model.hasRelatedObjects && !!object?.Related_Objects && (
                    <ObjectRelatedObjects objects={object.Related_Objects} />
                )}
            </div>
        </MutateLayout>
    )
}

export default ObjectDetail
