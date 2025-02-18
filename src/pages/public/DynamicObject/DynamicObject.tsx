import { Heading, Hyperlink, Notification } from '@pzh-ui/components'
import classNames from 'clsx'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { PublicModuleObjectRevision } from '@/api/fetchers.schemas'
import Breadcrumbs from '@/components/Breadcrumbs'
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

    const { setInitialObject, setRevisionFrom, setRevisionTo } =
        useRevisionStore(
            useShallow(state => ({
                setInitialObject: state.setInitialObject,
                setRevisionFrom: state.setRevisionFrom,
                setRevisionTo: state.setRevisionTo,
            }))
        )
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [revisionModalOpen, setRevisionModalOpen] = useState(false)

    const {
        singularCapitalize,
        pluralCapitalize,
        plural,
        slugOverview,
        slugOverviewPublic,
        singular,
        singularReadable,
        demonstrative,
        hideBreadcrumbs,
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
        query: { enabled: !!data?.Object_ID },
    })
    const { data: revisions, isPending: revisionsLoading } =
        useGetValidLineage?.<{ results?: ModelReturnType[] }>(
            data!.Object_ID!,
            {
                limit: 100,
            },
            {
                query: { enabled: !!data?.Object_ID && !isRevision },
            }
        ) || {}

    const getRevisionText = useCallback(
        (revision: PublicModuleObjectRevision) =>
            getObjectRevisionBannerText(revision, singular),
        [singular]
    )

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', to: '/' },
        {
            name: slugOverview || '',
            to: slugOverviewPublic ? `/${slugOverview}` : '/',
        },
        { name: pluralCapitalize, to: `/${slugOverview}/${plural}` },
        ...(isRevision
            ? [
                  {
                      name: 'Ontwerpversie',
                      to: !latestIsError
                          ? `/${slugOverview}/${plural}/${latest?.UUID}`
                          : `/${slugOverview}/${plural}`,
                  },
              ]
            : []),
        { name: data?.Title || '' },
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

            <Container
                className={classNames('pb-16', {
                    'pt-10': hideBreadcrumbs,
                    'pt-4': !hideBreadcrumbs,
                })}>
                {!hideBreadcrumbs && (
                    <div className="col-span-6 mb-8 capitalize">
                        <Breadcrumbs items={breadcrumbPaths} />
                    </div>
                )}

                <div className="order-1 col-span-6 xl:col-span-2">
                    <Sidebar
                        revisions={revisions?.results}
                        revisionsLoading={revisionsLoading}
                        model={model}
                        handleModal={() => setActiveModal('revision')}
                        isRevision={isRevision}
                        {...data}
                    />
                </div>

                <div className="order-2 col-span-6 mt-6 flex flex-col xl:col-span-4 xl:mt-0">
                    <Heading level="3" size="m" className="order-1">
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
                                        : 'verouderde versie'}{' '}
                                    van {demonstrative} {singularReadable},{' '}
                                    <Hyperlink asChild>
                                        <Link
                                            to={`/${slugOverview}/${plural}/${latest.UUID}`}>
                                            bekijk hier de vigerende versie
                                        </Link>
                                    </Hyperlink>
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
                        size="xxl"
                        className="order-2 mb-2 mt-4 md:order-3 md:mb-4">
                        {data?.Title}
                    </Heading>

                    <div className="order-4">
                        <ObjectContent
                            data={data || {}}
                            customTitle={
                                singular === 'beleidskeuze'
                                    ? {
                                          Description:
                                              'Wat wil de provincie bereiken?',
                                      }
                                    : singular === 'maatregel'
                                    ? {
                                          Description:
                                              'Wat gaat de provincie doen?',
                                      }
                                    : undefined
                            }
                        />
                    </div>

                    {data?.Werkingsgebied_Statics && (
                        <div className="order-7">
                            <ObjectArea
                                model={model}
                                objectTitle={data.Title}
                                moduleId={moduleId}
                                {...data.Werkingsgebied_Statics}
                            />
                        </div>
                    )}

                    {!!model.allowedConnections &&
                        !model.acknowledgedRelation && (
                            <div
                                className={classNames('order-8', {
                                    'mt-4 md:mt-8':
                                        !!data?.Werkingsgebied_Statics,
                                })}>
                                <ObjectConnectionsPublic
                                    model={model}
                                    data={data || {}}
                                />
                            </div>
                        )}

                    {!!model.allowedConnections &&
                        !!model.acknowledgedRelation && (
                            <div
                                className={classNames('order-9', {
                                    'mt-4 md:mt-8':
                                        !!data?.Werkingsgebied_Statics,
                                })}>
                                <ObjectRelationsPublic
                                    model={model}
                                    data={data || {}}
                                />
                            </div>
                        )}
                </div>
            </Container>

            {!!revisions?.results && revisions.results.length > 1 && (
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
