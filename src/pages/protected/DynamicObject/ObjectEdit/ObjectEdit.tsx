import { Heading } from '@pzh-ui/components'
import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

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
    const navigate = useNavigate()

    const { moduleId, objectId } = useParams()
    const location = useLocation()
    const { canEditModule } = usePermissions()

    const { singularCapitalize } = model.defaults

    const { isLocked, data, isModuleManager } = useModule()
    const { data: object, isLoading, isOwner, usePatchObject } = useObject()

    const patchObject = usePatchObject(() =>
        navigate(`/muteer/modules/${moduleId}`)
    )

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in typeof fields[number]]: any }

        fields?.forEach(field => {
            if (field === 'Gebied_UUID') {
                return (objectData[field] = object?.['Gebied']?.UUID)
            }

            return (objectData[field] = object?.[field as keyof typeof data])
        })

        return objectData
    }, [object, model.dynamicSections])

    /**
     * Handle submit of form
     */
    const handleSubmit = (payload: typeof initialData) => {
        if (!payload) return

        patchObject?.mutate({
            moduleId: parseInt(moduleId!),
            lineageId: parseInt(objectId!),
            data: payload,
        })
    }

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

                <DynamicObjectForm
                    model={model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/modules/${moduleId}`)}
                    isLocked={isLocked}
                    isLoading={isLoading}
                />
            </div>
        </MutateLayout>
    )
}

export default ObjectEdit
