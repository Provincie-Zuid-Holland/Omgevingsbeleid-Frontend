import { Breadcrumbs, Heading } from '@pzh-ui/components'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { Container } from '@/components/Container'
import ObjectArea from '@/components/DynamicObject/ObjectArea/ObjectArea'
import ObjectConnectionsPublic from '@/components/DynamicObject/ObjectConnectionsPublic/ObjectConnectionsPublic'
import ObjectContent from '@/components/DynamicObject/ObjectContent/ObjectContent'
import ObjectRelationsPublic from '@/components/DynamicObject/ObjectRelationsPublic/ObjectRelationsPublic'
import Sidebar from '@/components/DynamicObject/ObjectSidebar'
import { LoaderContent } from '@/components/Loader'
import { Model, ModelReturnType } from '@/config/objects/types'

interface DynamicObjectProps {
    model: Model
}

const DynamicObject = ({ model }: DynamicObjectProps) => {
    const { uuid } = useParams()
    const pathName = location.pathname || ''

    const { singularCapitalize, pluralCapitalize, plural } = model.defaults
    const { useGetVersion, useGetValidLineage } = model.fetchers

    const { data = {}, isLoading } =
        useGetVersion?.<ModelReturnType>(uuid!, {
            query: { enabled: !!uuid },
        }) || {}
    const { data: revisions } =
        useGetValidLineage?.<ModelReturnType[]>(data.Object_ID!, undefined, {
            query: { enabled: !!data.Object_ID },
        }) || {}

    const amountOfRevisions = useMemo(
        () => revisions && revisions.length - 1,
        [revisions]
    )

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', path: '/' },
        { name: 'Omgevingsvisie', path: '/' },
        { name: pluralCapitalize, path: `/omgevingsvisie/${plural}` },
        { name: data.Title || '', path: pathName },
    ]

    if (isLoading) return <LoaderContent />

    return (
        <>
            <Helmet title={data.Title} />

            <Container className="pb-16 pt-4">
                <div className="col-span-6 mb-8">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>

                <div className="col-span-6 xl:col-span-2 order-1">
                    <Sidebar
                        revisions={amountOfRevisions}
                        plural={plural}
                        {...data}
                    />
                </div>

                <div className="col-span-6 xl:col-span-4 order-2 flex flex-col">
                    <Heading
                        level="3"
                        color="text-pzh-blue"
                        className="order-1">
                        {singularCapitalize}
                    </Heading>

                    <Heading
                        level="1"
                        color="text-pzh-blue"
                        className="mt-4 mb-2 md:mb-4 order-2 md:order-3">
                        {data.Title}
                    </Heading>

                    <div className="order-4">
                        <ObjectContent data={data} />
                    </div>

                    {data.Gebied && (
                        <div className="order-7">
                            <ObjectArea
                                model={model}
                                objectTitle={data.Title}
                                {...data.Gebied}
                            />
                        </div>
                    )}

                    {model.allowedConnections && !model.acknowledgedRelation && (
                        <div
                            className={classNames('order-8', {
                                'mt-4 md:mt-8': !!data.Gebied,
                            })}>
                            <ObjectConnectionsPublic
                                model={model}
                                data={data}
                            />
                        </div>
                    )}

                    {model.allowedConnections && model.acknowledgedRelation && (
                        <div
                            className={classNames('order-9', {
                                'mt-4 md:mt-8': !!data.Gebied,
                            })}>
                            <ObjectRelationsPublic model={model} data={data} />
                        </div>
                    )}
                </div>
            </Container>
        </>
    )
}

export default DynamicObject
