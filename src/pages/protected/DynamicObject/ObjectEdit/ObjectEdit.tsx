import { Heading } from '@pzh-ui/components'
import { Navigate, useLocation, useParams } from 'react-router-dom'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import { LockedNotification } from '@/components/Modules/ModuleLock/ModuleLock'
import { Model } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'

interface ObjectEditProps {
    model: Model
}

const ObjectEdit = ({ model }: ObjectEditProps) => {
    const { moduleId } = useParams()
    const location = useLocation()
    const { canEditModule } = usePermissions()

    const { singularCapitalize } = model.defaults

    const { isLocked, data, isModuleManager } = useModule()
    const { isLoading, isOwner } = useObject()

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
        { name: 'Modules', path: '/muteer' },
        {
            name: data?.Module.Title || '',
            path: `/muteer/modules/${moduleId}`,
        },
        { name: `${singularCapitalize} bewerken`, isCurrent: true },
    ]

    if (!isLoading && !isOwner && !canEditModule && !isModuleManager) {
        return (
            <Navigate
                to={`/muteer/modules/${moduleId}`}
                state={{ from: location }}
                replace
            />
        )
    }

    return (
        <MutateLayout
            title={`${singularCapitalize} bewerken`}
            breadcrumbs={breadcrumbPaths}>
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
