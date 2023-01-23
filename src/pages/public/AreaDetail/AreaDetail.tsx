import { Breadcrumbs, Heading } from '@pzh-ui/components'
import DOMPurify from 'dompurify'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useReadGebiedsprogrammaVersion } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'

function AreaDetail() {
    const { id } = useParams<{ id: string }>()
    const { data, isLoading } = useReadGebiedsprogrammaVersion(id!)

    const transformedMaatregelen = useMemo(
        () =>
            data?.Ref_Maatregelen?.map(({ Object }) => ({
                Titel: Object?.Titel,
                UUID: Object?.UUID,
            })),
        [data?.Ref_Maatregelen]
    )

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Gebiedsprogramma’s',
            path: '/omgevingsprogramma/gebiedsprogrammas',
        },
        {
            name: data?.Titel || '',
            path: `/omgevingsprogramma/gebiedsprogrammas/${data?.UUID}`,
        },
    ]

    if (isLoading) return <LoaderContent />

    const cleanHtmlDescription = DOMPurify.sanitize(data?.Omschrijving || '')

    return (
        <div>
            <Container className="pb-20 overflow-hidden">
                <div className="col-span-6">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>
                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1" className="mt-10 mb-3">
                        {data?.Titel}
                    </Heading>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: cleanHtmlDescription,
                        }}
                        className="mb-8 break-words whitespace-pre-line raadpleeg-innerhtml"
                    />
                    {data?.Afbeelding && (
                        <figure>
                            <img src={data.Afbeelding} alt={data?.Titel} />
                            <figcaption className="mt-2 text-sm text-pzh-blue-dark">
                                Indicatieve weergave gebied ‘{data?.Titel}’.
                            </figcaption>
                        </figure>
                    )}
                    {!!transformedMaatregelen?.length && (
                        <div className="mt-8">
                            <ObjectList
                                data={transformedMaatregelen}
                                isLoading={isLoading}
                                objectType="gebiedsprogramma’s"
                                objectSlug={`omgevingsprogramma/gebiedsprogrammas/${id}`}
                                advancedSearch={false}
                                hasFilter={false}
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
