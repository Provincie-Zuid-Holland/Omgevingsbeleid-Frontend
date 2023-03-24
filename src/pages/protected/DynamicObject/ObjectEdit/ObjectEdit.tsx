import { Heading } from '@pzh-ui/components'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import { Model } from '@/config/objects/types'
import MutateLayout from '@/templates/MutateLayout'

interface ObjectEditProps {
    model: Model
}

const ObjectEdit = ({ model }: ObjectEditProps) => {
    const { singularCapitalize } = model.defaults

    return (
        <MutateLayout title={`${singularCapitalize} bewerken`}>
            <div className="col-span-6">
                <Heading level="1" className="mb-8">
                    {singularCapitalize} bewerken
                </Heading>

                <DynamicObjectForm model={model} />
            </div>
        </MutateLayout>
    )
}

export default ObjectEdit
