import { Breadcrumbs, Button, FieldInput, Heading } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import MutateLayout from '@/templates/MutateLayout'

interface DynamicOverviewProps {
    model: typeof models[ModelType]
}

const DynamicOverview = ({ model }: DynamicOverviewProps) => {
    const pathName = location.pathname

    const { pluralCapitalize, prefixNewObject, singular } = model.defaults
    // const { useGetValid } = model.fetchers

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
        { name: pluralCapitalize || '', path: pathName },
    ]

    return (
        <MutateLayout title={pluralCapitalize}>
            <div className="col-span-6">
                <div className="mb-10">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>

                <div className="flex items-center justify-between whitespace-nowrap">
                    <Heading>{pluralCapitalize}</Heading>
                    <div className="flex">
                        <FieldInput
                            onChange={console.log}
                            placeholder="Zoeken in lijst"
                            name="filter"
                            icon={MagnifyingGlass}
                        />
                        <Button variant="cta" className="ml-4">
                            {prefixNewObject} {singular}
                        </Button>
                    </div>
                </div>
            </div>
        </MutateLayout>
    )
}

export default DynamicOverview
