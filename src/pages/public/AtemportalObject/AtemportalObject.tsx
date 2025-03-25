import { Heading, Text } from '@pzh-ui/components'
import groupBy from 'lodash.groupby'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'

import NotFoundPage from '../NotFoundPage'

interface DynamicObjectProps {
    model: Model
}

const AtemportalObject = ({ model }: DynamicObjectProps) => {
    const { id } = useParams()

    const {
        demonstrative,
        demonstrativeSingular,
        plural,
        pluralCapitalize,
        slugOverview,
    } = model.defaults
    const { useGetValidLineage } = model.fetchers

    const {
        data = {},
        isLoading,
        isError,
    } = useGetValidLineage?.<ModelReturnType>(parseInt(id!), {
        query: { enabled: !!id },
    }) || {}

    const formattedRelations = useMemo(() => {
        const connections = model.allowedConnections
            ?.flatMap(connection => {
                const items = data[connection.key]

                if (Array.isArray(items) && items.length > 0) {
                    return (items as any[]).map(({ Object }) => ({ ...Object }))
                }

                return
            })
            .filter(Boolean)

        return groupBy(connections, 'Object_Type')
    }, [data, model.allowedConnections])

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', to: '/' },
        {
            name: slugOverview || '',
            to: `/${slugOverview}`,
        },
        { name: pluralCapitalize, to: `/${slugOverview}/${plural}` || '' },
        { name: data.Title || '', isCurrent: true },
    ]

    if (isLoading) return <LoaderContent />

    if (isError) return <NotFoundPage />

    return (
        <>
            <Helmet title={data.Title} />

            <Container className="overflow-hidden pb-20">
                <div className="col-span-6">
                    <Breadcrumbs
                        items={breadcrumbPaths}
                        className="mt-6 capitalize"
                    />
                </div>
                <div className="col-span-6 pt-10 xl:col-span-4 xl:col-start-2">
                    <Heading level="1" size="xxl" className="mb-2 md:mb-4">
                        {data.Title}
                    </Heading>
                    {data?.Description && (
                        <Text
                            className="prose prose-neutral mb-4 max-w-full whitespace-pre-line text-m text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0"
                            dangerouslySetInnerHTML={{
                                __html: data.Description,
                            }}
                        />
                    )}

                    {Object.keys(formattedRelations)?.map(group => {
                        if (!!!formattedRelations[group].length) return

                        const model = models[group as ModelType]
                        const {
                            plural,
                            pluralCapitalize,
                            singular,
                            slugOverview,
                        } = model.defaults

                        return (
                            <div className="mt-8" key={group}>
                                <ObjectList
                                    data={formattedRelations[group]}
                                    isLoading={isLoading}
                                    objectSlug={`${slugOverview}/${plural}`}
                                    objectType={pluralCapitalize.toLowerCase()}
                                    objectSingular={singular}
                                    hasSearch={false}
                                    title={`${pluralCapitalize} in ${demonstrative} ${demonstrativeSingular}`}
                                />
                            </div>
                        )
                    })}
                </div>
            </Container>
        </>
    )
}

export default AtemportalObject
