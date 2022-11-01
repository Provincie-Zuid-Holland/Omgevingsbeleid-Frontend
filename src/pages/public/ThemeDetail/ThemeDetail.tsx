import { Breadcrumbs, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import {
    getGetVersionBeleidskeuzesObjectUuidQueryKey,
    getVersionBeleidskeuzesObjectUuid,
    useGetVersionBeleidsdoelenObjectUuid,
} from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'
import RelatiesKoppelingen from '@/components/RelatiesKoppelingen'

function ThemeDetail() {
    const { id } = useParams<{ id: string }>()
    const { data, isLoading } = useGetVersionBeleidsdoelenObjectUuid(id!)
    const beleidskeuzes = useQueries({
        queries: (data?.Ref_Beleidskeuzes || []).map(item => {
            return {
                queryKey: getGetVersionBeleidskeuzesObjectUuidQueryKey(
                    item.Object?.UUID || ''
                ),
                queryFn: () =>
                    getVersionBeleidskeuzesObjectUuid(item.Object?.UUID || ''),
            }
        }),
    })

    const transformedMaatregelen = useMemo(() => {
        if (!beleidskeuzes?.length) return

        const items: { Titel?: string; UUID?: string }[] = []

        beleidskeuzes.forEach(beleidskeuze =>
            beleidskeuze.data?.Maatregelen?.forEach(({ Object }) => {
                if (!items.find(item => item.UUID === Object?.UUID))
                    items.push({
                        Titel: Object?.Titel,
                        UUID: Object?.UUID,
                    })
            })
        )

        return items
    }, [beleidskeuzes])

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Thematische programma’s',
            path: '/omgevingsprogramma/thematische-programmas',
        },
        {
            name: data?.Titel || '',
            path: `/omgevingsprogramma/thematische-programmas/${data?.UUID}`,
        },
    ]

    if (isLoading) return <LoaderContent />

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
                    <Text className="mb-4 break-words whitespace-pre-line">
                        {data?.Omschrijving}
                    </Text>
                    <Hyperlink
                        to={`/beleidsdoelen/${data?.UUID}`}
                        text="Lees meer informatie over dit beleidsdoel"
                    />

                    {!!transformedMaatregelen?.length && (
                        <div className="mt-8">
                            <ObjectList
                                data={transformedMaatregelen}
                                isLoading={isLoading}
                                objectType="thematische programma’s"
                                objectSlug={`omgevingsprogramma/thematische-programmas/${id}`}
                                advancedSearch={false}
                                hasFilter={false}
                                title="Maatregelen in dit thematische programma"
                            />
                        </div>
                    )}
                </div>
            </Container>

            {data && (
                <RelatiesKoppelingen
                    titleSingular="beleidsdoel"
                    titleSingularPrefix="het"
                    dataObject={data}
                />
            )}
        </div>
    )
}

export default ThemeDetail
