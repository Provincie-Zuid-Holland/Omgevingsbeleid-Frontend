import { Breadcrumbs, Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { Container } from '@/components/Container'
import ObjectList from '@/components/ObjectList'
import { Model } from '@/config/objects/types'

interface DynamicOverviewProps {
    model: Model
}

function DynamicOverview({ model }: DynamicOverviewProps) {
    const pathName = location.pathname || ''

    const { useGetValid } = model.fetchers
    const { plural, pluralCapitalize, description, slugOverview } =
        model.defaults

    const { data, isLoading } = useGetValid()

    /**
     * Create array of returned data with correct format
     * sort data by Title
     */
    const allObjects = useMemo(
        () =>
            data
                ?.map(({ Title, UUID }) => ({ Title, UUID }))
                .sort((a, b) => a.Title!.localeCompare(b.Title!)),
        [data]
    )

    const breadcrumbPaths = [
        { name: 'Omgevingsbeleid', path: '/' },
        { name: 'Omgevingsvisie', path: '/' },
        { name: pluralCapitalize || '', path: pathName },
    ]

    return (
        <>
            <Helmet title={pluralCapitalize} />

            <Container className="pb-16 pt-4">
                <div className="col-span-6 mb-8">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>
                <div className="col-span-6 xl:col-span-4 xl:col-start-2">
                    <Heading level="1">{pluralCapitalize}</Heading>
                    <Text className="mt-3 md:mt-4">{description}</Text>
                    <div className="mt-8">
                        <ObjectList
                            data={allObjects || []}
                            isLoading={isLoading}
                            objectSlug={
                                slugOverview
                                    ? `omgevingsvisie/${slugOverview}`
                                    : ''
                            }
                            objectType={plural}
                        />
                    </div>
                </div>
            </Container>
        </>
    )
}

export default DynamicOverview