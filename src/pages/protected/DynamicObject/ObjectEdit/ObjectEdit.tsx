import { Heading } from '@pzh-ui/components'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import { LockedNotification } from '@/components/Modules/ModuleLock/ModuleLock'
import { Model } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import MutateLayout from '@/templates/MutateLayout'

interface ObjectEditProps {
    model: Model
}

const ObjectEdit = ({ model }: ObjectEditProps) => {
    const { singularCapitalize } = model.defaults

    const { isLocked } = useModule()

    return (
        <MutateLayout title={`${singularCapitalize} bewerken`}>
            <div className="col-span-6">
                {isLocked && (
                    <div className="mb-8">
                        <LockedNotification isDetail />
                    </div>
                )}

                <Heading level="1" className="mb-8">
                    {singularCapitalize} bewerken
                </Heading>

                <DynamicObjectForm model={model} isLocked={isLocked} />
            </div>
        </MutateLayout>
    )
}

export default ObjectEdit
