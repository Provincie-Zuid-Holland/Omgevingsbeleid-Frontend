import { Heading, Text } from '@pzh-ui/components'
import { useUpdateEffect } from '@react-hookz/web'
import { keepPreviousData } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import ObjectList from '@/components/ObjectList'
import { Model } from '@/config/objects/types'
import useSearchParam from '@/hooks/useSearchParam'

const PAGE_LIMIT = 20

interface DynamicOverviewProps {
    model: Model
}

function DynamicOverview({ model }: DynamicOverviewProps) {
    const { get, set, remove } = useSearchParam()
    const [page] = get(['page'])

    const [currPage, setCurrPage] = useState(parseInt(page || '1'))

    const { useGetValid } = model.fetchers
    const {
        singular,
        plural,
        pluralCapitalize,
        description,
        slugOverview,
        slugOverviewPublic,
        atemporal,
    } = model.defaults

    const { data, isLoading } = useGetValid(
        {
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
            sort_column: 'Title',
            sort_order: 'ASC',
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    )

    /**
     * Create array of returned data with correct format
     * sort data by Title
     */
    const allObjects = useMemo(
        () =>
            data?.results?.map(({ Title, UUID, Object_ID }) => ({
                Title,
                UUID,
                Object_ID,
            })),
        [data]
    )

    /**
     * Handle pagination
     */
    const handlePageChange = (page: number) => {
        setCurrPage(page)
        set('page', page.toString())
    }

    useUpdateEffect(() => {
        setCurrPage(1)
        remove('page')
    }, [plural])

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', to: '/' },
        {
            name: slugOverview || '',
            to: slugOverviewPublic ? `/${slugOverview}` : '/',
        },
        { name: pluralCapitalize || '' },
    ]

    return (
        <>
            <Helmet title={pluralCapitalize}>
                {description && (
                    <>
                        <meta name="description" content={description} />
                        <meta name="og:description" content={description} />
                    </>
                )}
            </Helmet>

            <Container className="pb-16 pt-4">
                <div className="col-span-6 mb-8 capitalize">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>
                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1" size="xxl">
                        {pluralCapitalize}
                    </Heading>
                    <Text className="mt-3 md:mt-4">{description}</Text>
                    <div className="mt-8">
                        <ObjectList
                            data={allObjects}
                            isLoading={isLoading}
                            objectSlug={`${slugOverview}/${plural}`}
                            objectType={pluralCapitalize.toLowerCase()}
                            objectSingular={singular}
                            objectKey={atemporal ? 'id' : 'uuid'}
                            limit={PAGE_LIMIT}
                            onPageChange={handlePageChange}
                            total={data?.total}
                            currPage={currPage}
                        />
                    </div>
                </div>
            </Container>
        </>
    )
}

export default DynamicOverview
