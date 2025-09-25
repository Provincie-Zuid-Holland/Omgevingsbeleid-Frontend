import { File, Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { useStorageFilePostFilesUpload } from '@/api/fetchers'
import { HTTPValidationError } from '@/api/fetchers.schemas'
import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import { LockedNotification } from '@/components/Modules/ModuleLock/ModuleLock'
import { Model } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'
import { AxiosError } from 'axios'

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

    const { mutateAsync: uploadStorageFile } = useStorageFilePostFilesUpload()

    const patchObject = usePatchObject()

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = [
            ...model.dynamicSections.flatMap(section =>
                section.fields.map(field => field.name)
            ),
            'File',
        ]

        const objectData = {} as { [key in (typeof fields)[number]]: any }

        fields.forEach(field => {
            objectData[field] = object?.[field as keyof typeof object]
        })

        if (
            fields.includes('Ambtsgebied') &&
            object?.Werkingsgebied_Code === null
        ) {
            objectData['Ambtsgebied'] = ['true']
        }

        if (fields.includes('File_UUID')) {
            objectData.File = null
        }

        return objectData
    }, [object, model.dynamicSections])

    /**
     * Handle submit of form
     */
    const handleSubmit = (
        payload: typeof initialData,
        helpers: FormikHelpers<typeof initialData>
    ) => {
        if (!payload) return Promise.resolve()

        Object.keys(payload).forEach(key => {
            if (!(key in initialData)) {
                delete (payload as any)[key]
            }
        })

        // Transform multi-selects to array of values
        if (Array.isArray(payload.Documents)) {
            payload.Documents = payload.Documents.map(
                (item: any) => item.value ?? item
            )
        }

        if (
            'Ambtsgebied' in payload &&
            Array.isArray(payload.Ambtsgebied) &&
            payload.Ambtsgebied.includes('true')
        ) {
            payload.Werkingsgebied_Code = null
        }

        const triggerSubmit = async () => {
            // Await file upload before patching object
            if ('File' in payload && !!payload.File) {
                const res = await uploadStorageFile({
                    data: {
                        title: payload.Filename,
                        uploaded_file: payload.File as File,
                    },
                })
                if (res) {
                    payload.File_UUID = res.UUID
                    delete payload.File
                }
            }

            return patchObject
                ?.mutateAsync({
                    moduleId: parseInt(moduleId!),
                    lineageId: parseInt(objectId!),
                    data: payload,
                })
                .then(() => {
                    return Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: objectQueryKey,
                        }),
                        queryClient.invalidateQueries({ queryKey }),
                    ])
                })
                .then(() => navigate(`/muteer/modules/${moduleId}`))
                .catch(
                    (err: AxiosError<HTTPValidationError>) =>
                        err.response &&
                        handleError<typeof initialData>(err.response, helpers)
                )
        }

        return triggerSubmit()
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Modules', path: '/muteer/modules' },
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
                    defaultValues={{
                        ...(object?.Hierarchy_Statics && {
                            Hierarchy_Code: {
                                label: object.Hierarchy_Statics.Cached_Title,
                                value: object.Hierarchy_Statics.Code,
                            },
                        }),
                        ...(object?.Werkingsgebied_Statics && {
                            Werkingsgebied_Code: {
                                label: object.Werkingsgebied_Statics
                                    .Cached_Title,
                                value: object.Werkingsgebied_Statics.Code,
                            },
                        }),
                        ...(object?.Documents_Statics && {
                            Documents: object.Documents_Statics.map(obj => ({
                                label: obj.Cached_Title,
                                value: obj.Code,
                            })),
                        }),
                    }}
                />
            </div>
        </MutateLayout>
    )
}

export default ObjectEdit
