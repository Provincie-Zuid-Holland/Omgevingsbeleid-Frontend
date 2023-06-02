import { Divider, Heading } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import ObjectConnections from '@/components/DynamicObject/ObjectConnections'
import ObjectDefaultInfo from '@/components/DynamicObject/ObjectDefaultInfo'
import ObjectRelations from '@/components/DynamicObject/ObjectRelations'
import { Model } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useObject from '@/hooks/useObject'
import MutateLayout from '@/templates/MutateLayout'

interface ObjectDetailProps {
    model: Model
}

const ObjectDetail = ({ model }: ObjectDetailProps) => {
    const { moduleId } = useParams()

    const { singularCapitalize, plural, pluralCapitalize } = model.defaults

    const { data: module } = useModule() || {}
    const { data: object } = useObject()

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
        ...((!!moduleId && [
            { name: 'Modules', path: '/muteer' },
            {
                name: module?.Module.Title || '',
                path: `/muteer/modules/${module?.Module.Module_ID}`,
            },
        ]) || [{ name: pluralCapitalize, path: `/muteer/${plural}` }]),
        { name: object?.Title || '', isCurrent: true },
    ]

    return (
        <MutateLayout title={singularCapitalize} breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <Heading level="1">{singularCapitalize}</Heading>

                <Divider className="mb-8 mt-6" />
            </div>

            <div className="col-span-4">
                <Heading as="2" level="3" className="mb-4">
                    Status
                </Heading>
            </div>

            <div className="col-span-2">
                <ObjectDefaultInfo model={model} />

                {!!model.allowedConnections?.length && (
                    <ObjectConnections model={model} />
                )}

                {!!model.acknowledgedRelation && (
                    <ObjectRelations model={model} />
                )}
            </div>
        </MutateLayout>
    )
}

export default ObjectDetail
