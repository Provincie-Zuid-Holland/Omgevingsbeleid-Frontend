import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import { LockedNotification } from '@/components/Modules/ModuleLock/ModuleLock'
import { Model } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'

interface ObjectEditProps {
    model: Model
}

const ObjectEdit = ({ model }: ObjectEditProps) => {
    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const { moduleId, objectId } = useParams()
    const location = useLocation()
    const { canEditModule } = usePermissions()

    const { singularCapitalize } = model.defaults

    const {
        isLoading: moduleIsLoading,
        isLocked,
        data,
        isModuleManager,
        queryKey,
    } = useModule()
    const {
        data: object,
        isLoading,
        isOwner,
        usePatchObject,
        queryKey: objectQueryKey,
    } = useObject()

    const patchObject = usePatchObject()

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in (typeof fields)[number]]: any }

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
    const handleSubmit = (
        payload: typeof initialData,
        helpers: FormikHelpers<typeof initialData>
    ) => {
        if (!payload) return

        patchObject
            ?.mutateAsync({
                moduleId: parseInt(moduleId!),
                lineageId: parseInt(objectId!),
                data: payload,
            })
            .then(() => {
                Promise.all([
                    queryClient.invalidateQueries(objectQueryKey),
                    ...(initialData.Title !== payload.Title
                        ? [queryClient.invalidateQueries(queryKey)]
                        : []),
                ]).then(() => navigate(`/muteer/modules/${moduleId}`))
            })
            .catch(err =>
                handleError<typeof initialData>(err.response, helpers)
            )
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Modules', path: '/muteer' },
        {
            name: data?.Module.Title || '',
            path: `/muteer/modules/${moduleId}`,
        },
        { name: `${singularCapitalize} bewerken`, isCurrent: true },
    ]

    if (
        !isLoading &&
        !moduleIsLoading &&
        !isOwner &&
        !canEditModule &&
        !isModuleManager
    ) {
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

                <Heading level="1" size="xxl" className="mb-8">
                    {singularCapitalize} bewerken
                </Heading>

                <DynamicObjectForm
                    model={model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/modules/${moduleId}`)}
                    isLocked={isLocked}
                    isLoading={isLoading || moduleIsLoading}
                />
            </div>
        </MutateLayout>
    )
}

export default ObjectEdit
