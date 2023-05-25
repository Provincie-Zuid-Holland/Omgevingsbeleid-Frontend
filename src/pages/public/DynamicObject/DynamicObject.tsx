import { Breadcrumbs, Heading } from '@pzh-ui/components'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { Container } from '@/components/Container'
import ObjectArea from '@/components/DynamicObject/ObjectArea/ObjectArea'
import ObjectConnectionsPublic from '@/components/DynamicObject/ObjectConnectionsPublic'
import ObjectContent from '@/components/DynamicObject/ObjectContent/ObjectContent'
import ObjectRelationsPublic from '@/components/DynamicObject/ObjectRelationsPublic'
import Sidebar from '@/components/DynamicObject/ObjectSidebar'
import { LoaderContent } from '@/components/Loader'
import RevisionModal from '@/components/Modals/RevisionModal/RevisionModal'
import { Model, ModelReturnType } from '@/config/objects/types'
import useRevisionStore from '@/store/revisionStore'

interface DynamicObjectProps {
    model: Model
}

const DynamicObject = ({ model }: DynamicObjectProps) => {
    const { uuid } = useParams()
    const pathName = location.pathname || ''

    const { setInitialObject, setRevisionFrom, setRevisionTo } =
        useRevisionStore(state => ({ ...state }))

    const [revisionModalOpen, setRevisionModalOpen] = useState(false)

    const { singularCapitalize, pluralCapitalize, plural, slugOverview } =
        model.defaults
    const { useGetVersion, useGetValidLineage, useGetLatestLineage } =
        model.fetchers

    const { data = {}, isLoading } =
        useGetVersion?.<ModelReturnType>(uuid!, {
            query: { enabled: !!uuid },
        }) || {}
    const { data: latest } = useGetLatestLineage(data.Object_ID!, {
        query: { enabled: !!data.Object_ID },
    })
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
        { name: slugOverview?.split('/')[0] || '', path: '/' },
        { name: pluralCapitalize, path: `/${slugOverview}` || '' },
        { name: data.Title || '', path: pathName },
    ]

    /**
     * Set initial object which can be used in the revision modal
     */
    useEffect(() => {
        setInitialObject(latest)
        setRevisionFrom(latest)
        setRevisionTo(undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latest])

    if (isLoading) return <LoaderContent />

    return (
        <>
            <Helmet title={data.Title} />

            <Container className="pb-16 pt-4">
                <div className="col-span-6 mb-8 capitalize">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>

                <div className="col-span-6 xl:col-span-2 order-1">
                    <Sidebar
                        revisions={amountOfRevisions}
                        plural={plural}
                        handleModal={() => setRevisionModalOpen(true)}
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

            {!!amountOfRevisions && amountOfRevisions > 0 && (
                <RevisionModal
                    model={model}
                    revisions={revisions}
                    isOpen={revisionModalOpen}
                    onClose={() => setRevisionModalOpen(false)}
                />
            )}
        </>
    )
}

export default DynamicObject
