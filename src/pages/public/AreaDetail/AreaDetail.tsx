import { useMemo } from 'react'

import { Heading, Text } from '@pzh-ui/components'

import { useParams } from 'react-router-dom'

import {
    useGebiedsprogrammaViewObjectVersion,
    useGetRevisionsGebiedsprogrammaVersion,
} from '@/api/fetchers'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'

function AreaDetail() {
    const { moduleId, id } = useParams()

    const versionData = useGebiedsprogrammaViewObjectVersion(id!, {
        query: { enabled: !!id && !moduleId },
    })
    const revisionData = useGetRevisionsGebiedsprogrammaVersion(
        parseInt(moduleId!),
        id!,
        {
            query: { enabled: !!id && !!moduleId },
        }
    )

    const objectData = useMemo(() => {
        if (!!moduleId && !!id) {
            return revisionData
        }

        return versionData
    }, [moduleId, id, versionData, revisionData])

    const { data, isLoading } = objectData

    const transformedMaatregelen = useMemo(
        () =>
            data?.maatregelen?.map(({ object }) => ({
                title: object?.title,
                id: object?.id,
            })),
        [data?.maatregelen]
    )

    const breadcrumbPaths = [
        { name: 'Home', to: '/' },
        { name: 'Omgevingsprogramma', to: '/omgevingsprogramma' },
        {
            name: 'Gebiedsprogramma’s',
            to: '/omgevingsprogramma/gebiedsprogrammas',
        },
        {
            name: data?.title || '',
        },
    ]

    if (isLoading) return <LoaderContent />

    return (
        <div>
            <Container className="overflow-hidden pb-20">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1" size="xxl" className="mt-10 mb-3">
                        {data?.title}
                    </Heading>
                    {data?.description && (
                        <Text
                            className="prose mb-8 max-w-full text-m whitespace-pre-line text-pzh-blue-900 prose-neutral marker:text-pzh-blue-900 prose-li:my-0"
                            dangerouslySetInnerHTML={{
                                __html: data.description,
                            }}
                        />
                    )}
                    {data?.image && (
                        <figure>
                            <img src={data.image} alt={data?.title} />
                            <figcaption className="mt-2 text-s text-pzh-blue-900">
                                Indicatieve weergave gebied ‘{data?.title}’.
                            </figcaption>
                        </figure>
                    )}
                    {!!transformedMaatregelen?.length && (
                        <div className="mt-8">
                            <ObjectList
                                data={transformedMaatregelen}
                                isLoading={isLoading}
                                objectType="maatregelen"
                                objectSlug="omgevingsprogramma/maatregelen"
                                hasSearch={false}
                                title="Maatregelen in dit gebiedsprogramma"
                            />
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default AreaDetail
