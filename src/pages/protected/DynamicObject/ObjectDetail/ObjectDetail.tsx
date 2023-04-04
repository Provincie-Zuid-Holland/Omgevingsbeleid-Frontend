import { getHeadingStyles, Heading } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import ObjectDefaultInfo from '@/components/DynamicObject/ObjectDefaultInfo'
import ObjectRelations from '@/components/DynamicObject/ObjectRelations'
import { Model } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'
import useModule from '@/hooks/useModule'
import useObject from '@/hooks/useObject'
import MutateLayout from '@/templates/MutateLayout'

interface ObjectDetailProps {
    model: Model
}

const ObjectDetail = ({ model }: ObjectDetailProps) => {
    const { moduleId } = useParams()
    const { isMobile } = useBreakpoint()

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
                <Heading level="1" className="mb-8">
                    {singularCapitalize}
                </Heading>
            </div>

            <div className="col-span-4">
                <h2 style={getHeadingStyles('3', isMobile)} className="mb-4">
                    Status
                </h2>
            </div>

            <div className="col-span-2">
                <ObjectDefaultInfo model={model} />

                {!!model.allowedConnections?.length && (
                    <ObjectRelations model={model} />
                )}
            </div>
        </MutateLayout>
    )
}

export default ObjectDetail
