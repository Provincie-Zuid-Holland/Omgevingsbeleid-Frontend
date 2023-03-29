import { getHeadingStyles, Heading } from '@pzh-ui/components'

import ObjectDefaultInfo from '@/components/DynamicObject/ObjectDefaultInfo'
import ObjectRelations from '@/components/DynamicObject/ObjectRelations'
import { Model } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'
import MutateLayout from '@/templates/MutateLayout'

interface ObjectDetailProps {
    model: Model
}

const ObjectDetail = ({ model }: ObjectDetailProps) => {
    const { isMobile } = useBreakpoint()

    const { singularCapitalize } = model.defaults

    return (
        <MutateLayout title={singularCapitalize}>
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
