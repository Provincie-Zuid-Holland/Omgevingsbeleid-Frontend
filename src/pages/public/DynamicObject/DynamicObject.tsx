import classNames from 'classnames'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import {
    Breadcrumbs,
    Heading,
    Hyperlink,
    Notification,
} from '@pzh-ui/components'

import { PublicModuleObjectRevision } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import ObjectArea from '@/components/DynamicObject/ObjectArea'
import ObjectConnectionsPublic from '@/components/DynamicObject/ObjectConnectionsPublic'
import ObjectContent from '@/components/DynamicObject/ObjectContent'
import ObjectRelationsPublic from '@/components/DynamicObject/ObjectRelationsPublic'
import Sidebar from '@/components/DynamicObject/ObjectSidebar'
import { LoaderContent } from '@/components/Loader'
import RevisionModal from '@/components/Modals/RevisionModal'
import { Model, ModelReturnType } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'
import useRevisionStore from '@/store/revisionStore'
import { getObjectRevisionBannerText } from '@/utils/dynamicObject'

import NotFoundPage from '../NotFoundPage'

interface DynamicObjectProps {
    model: Model
    isRevision?: boolean
}

const DynamicObject = ({ model, isRevision }: DynamicObjectProps) => {
    const { moduleId, uuid } = useParams()
    const pathName = location.pathname || ''

    const { setInitialObject, setRevisionFrom, setRevisionTo } =
        useRevisionStore(state => ({ ...state }))
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [revisionModalOpen, setRevisionModalOpen] = useState(false)

    const {
        singularCapitalize,
        pluralCapitalize,
        plural,
        slugOverview,
        singular,
        singularReadable,
        demonstrative,
    } = model.defaults
    const {
        useGetVersion,
        useGetValidLineage,
        useGetLatestLineage,
        useGetRevision,
    } = model.fetchers

    const versionData = useGetVersion<ModelReturnType>?.(uuid!, {
        query: { enabled: !!uuid && !moduleId },
    })
    const revisionData = useGetRevision<ModelReturnType>?.(
        parseInt(moduleId!),
        uuid!,
        {
            query: { enabled: !!uuid && !!moduleId },
        }
    )

    const objectData = useMemo(() => {
        if (!!moduleId && !!uuid) {
            return revisionData
        }

        return versionData
    }, [moduleId, uuid, versionData, revisionData])

    const { data = {}, isLoading, isError } = objectData || {}

    const {
        data: latest,
        isLoading: latestIsLoading,
        isError: latestIsError,
    } = useGetLatestLineage(data!.Object_ID!, {
        query: { enabled: !!data?.Object_ID, onError: () => {} },
    })
    const { data: revisions } =
        useGetValidLineage?.<{ results?: ModelReturnType[] }>(
            data!.Object_ID!,
            undefined,
            {
                query: { enabled: !!data?.Object_ID && !isRevision },
            }
        ) || {}

    const amountOfRevisions = useMemo(
        () => revisions?.results && revisions.results.length - 1,
        [revisions]
    )

    const getRevisionText = useCallback(
        (revision: PublicModuleObjectRevision) =>
            getObjectRevisionBannerText(revision, singular),
        [singular]
    )

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', path: '/' },
        { name: slugOverview?.split('/')[0] || '', path: '/' },
        { name: pluralCapitalize, path: `/${slugOverview}` },
        ...(isRevision
            ? [
                  {
                      name: 'Ontwerpversie',
                      path: !latestIsError
                          ? `/${slugOverview}/${latest?.UUID}`
                          : `/${slugOverview}`,
                  },
              ]
            : []),
        { name: data?.Title || '', path: pathName },
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

    if (isError) return <NotFoundPage />

    return (
        <>
            <Helmet title={data?.Title} />

            <Container className="pb-16 pt-4">
                <div className="col-span-6 mb-8 capitalize">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>

                <div className="order-1 col-span-6 xl:col-span-2">
                    <Sidebar
                        revisions={amountOfRevisions}
                        plural={plural}
                        handleModal={() => setActiveModal('revision')}
                        isRevision={isRevision}
                        {...data}
                    />
                </div>

                <div className="order-2 col-span-6 mt-6 flex flex-col xl:col-span-4 xl:mt-0">
                    <Heading
                        level="3"
                        color="text-pzh-blue"
                        className="order-1">
                        {singularCapitalize}
                    </Heading>

                    {!latestIsLoading &&
                        latest &&
                        (data?.UUID !== latest.UUID || isRevision) && (
                            <Notification className="order-2 mt-4">
                                <>
                                    Let op, dit is een{' '}
                                    {isRevision
                                        ? 'ontwerpversie'
                                        : 'verouderde'}{' '}
                                    versie van {demonstrative}{' '}
                                    {singularReadable},{' '}
                                    <Hyperlink
                                        to={`/${slugOverview}/${latest.UUID}`}
                                        text="bekijk hier de vigerende versie"
                                    />
                                </>
                            </Notification>
                        )}

                    {data?.UUID === latest?.UUID &&
                        !!latest?.Public_Revisions?.length &&
                        latest.Public_Revisions.map(revision => (
                            <Notification
                                key={revision.Module_Object_UUID}
                                className="order-2 mt-4">
                                {getRevisionText(revision)}
                            </Notification>
                        ))}

                    <Heading
                        level="1"
                        color="text-pzh-blue"
                        className="order-2 mb-2 mt-4 md:order-3 md:mb-4">
                        {data?.Title}
                    </Heading>

                    <div className="order-4">
                        <ObjectContent
                            data={data || {}}
                            customTitle={
                                singular === 'beleidskeuze' ||
                                singular === 'maatregel'
                                    ? {
                                          Description:
                                              'Wat wil de provincie bereiken?',
                                      }
                                    : undefined
                            }
                        />
                    </div>

                    {data?.Gebied && (
                        <div className="order-7">
                            <ObjectArea
                                model={model}
                                objectTitle={data.Title}
                                {...data.Gebied}
                            />
                        </div>
                    )}

                    {model.allowedConnections &&
                        !model.acknowledgedRelation && (
                            <div
                                className={classNames('order-8', {
                                    'mt-4 md:mt-8': !!data?.Gebied,
                                })}>
                                <ObjectConnectionsPublic
                                    model={model}
                                    data={data || {}}
                                />
                            </div>
                        )}

                    {model.allowedConnections && model.acknowledgedRelation && (
                        <div
                            className={classNames('order-9', {
                                'mt-4 md:mt-8': !!data?.Gebied,
                            })}>
                            <ObjectRelationsPublic
                                model={model}
                                data={data || {}}
                            />
                        </div>
                    )}
                </div>
            </Container>

            {!!amountOfRevisions && amountOfRevisions > 0 && (
                <RevisionModal
                    model={model}
                    revisions={revisions?.results}
                    isOpen={revisionModalOpen}
                    onClose={() => setRevisionModalOpen(false)}
                    latestUUID={latest?.UUID}
                />
            )}
        </>
    )
}

export default DynamicObject
