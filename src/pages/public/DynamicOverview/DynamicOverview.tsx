import { Heading, Text } from '@pzh-ui/components'
import { ArrowLeft } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import ObjectList from '@/components/ObjectList'
import { Model } from '@/config/objects/types'

interface DynamicOverviewProps {
    model: Model
}

function DynamicOverview({ model }: DynamicOverviewProps) {
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

    return (
        <>
            <Helmet title={pluralCapitalize} />

            <Container className="pb-16 sm:pt-8 pt-4">
                <div className="col-span-6 sm:col-span-1">
                    <Link
                        to="/"
                        className="inline-block duration-100 ease-in opacity-75 cursor-pointer focus-within:transition text-pzh-blue hover:opacity-100">
                        <ArrowLeft className="mr-2 -mt-0.5 inline-block" />
                        <span>Start</span>
                    </Link>
                </div>
                <div className="col-span-6 sm:col-span-4">
                    <Heading level="1">{pluralCapitalize}</Heading>
                    <Text className="mt-3 md:mt-4">{description}</Text>
                    <div className="mt-8">
                        <ObjectList
                            data={allObjects || []}
                            isLoading={isLoading}
                            objectSlug={slugOverview || ''}
                            objectType={plural}
                        />
                    </div>
                </div>
            </Container>
        </>
    )
}

export default DynamicOverview
