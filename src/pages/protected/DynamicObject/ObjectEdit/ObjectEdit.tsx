import { useMemo } from 'react'

import { cn, Heading } from '@pzh-ui/components'

import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormikHelpers } from 'formik'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import {
    getModulesGetListModuleObjectsQueryKey,
    useGebiedengroepPatchInputGeoUseWerkingsgebied,
    useStorageFilePostFilesUpload,
} from '@/api/fetchers'
import { HTTPValidationError } from '@/api/fetchers.schemas'
import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import { LockedNotification } from '@/components/Modules/ModuleLock/ModuleLock'
import { Model } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import handleError, { handleFileError } from '@/utils/handleError'

import {
    FormData,
    getDefaultValues,
    getInitialData,
    normalizePayload,
} from './objectEdit.helpers'

interface ObjectEditProps {
    model: Model
}

const ObjectEdit = ({ model }: ObjectEditProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation()
    const { moduleId, objectId } = useParams()
    const { canEditModule } = usePermissions()

    const { singularCapitalize, singular } = model.defaults

    const {
        isLoading: moduleIsLoading,
        isLocked,
        data,
        isModuleManager,
    } = useModule()

    const {
        data: object,
        isLoading,
        isOwner,
        usePatchObject,
        queryKey: objectQueryKey,
        error,
    } = useObject()

    const { mutateAsync: uploadStorageFile } = useStorageFilePostFilesUpload()
    const { mutateAsync: patchInputGeo } =
        useGebiedengroepPatchInputGeoUseWerkingsgebied()

    const patchObject = usePatchObject()

    const initialData = useMemo(
        () => getInitialData(model, object),
        [model, object]
    )

    const defaultValues = useMemo(() => getDefaultValues(object), [object])

    const handleSubmit = async (
        payload: FormData,
        helpers: FormikHelpers<FormData>
    ) => {
        if (!payload || !moduleId || !objectId || !patchObject) return

        const cleanedPayload = normalizePayload(payload, initialData)

        try {
            if ('file' in cleanedPayload && cleanedPayload.file) {
                const res = await uploadStorageFile({
                    data: {
                        title: cleanedPayload.filename,
                        uploaded_file: cleanedPayload.file,
                        ignore_report: Boolean(cleanedPayload.File_Ignore),
                    },
                })

                cleanedPayload.file_id = res.id
                delete cleanedPayload.file
            }

            if (
                'source_uuid' in cleanedPayload &&
                cleanedPayload.source_uuid !== object?.source_uuid
            ) {
                await patchInputGeo({
                    moduleId: parseInt(moduleId, 10),
                    lineageId: parseInt(objectId, 10),
                    inputGeoWerkingsgebiedUuid: cleanedPayload.source_uuid,
                })
            }

            await patchObject.mutateAsync({
                moduleId: parseInt(moduleId, 10),
                lineageId: parseInt(objectId, 10),
                data: cleanedPayload,
            })

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: objectQueryKey }),
                queryClient.invalidateQueries({
                    queryKey: getModulesGetListModuleObjectsQueryKey({
                        module_id: parseInt(moduleId),
                    }),
                    refetchType: 'all',
                    exact: false,
                }),
            ])

            navigate(`/muteer/modules/${moduleId}`)
        } catch (err) {
            const error = err as AxiosError<HTTPValidationError>

            if (!error.response) return

            const hasFileError =
                'file' in cleanedPayload ||
                'file_id' in cleanedPayload ||
                'source_uuid' in cleanedPayload

            if (hasFileError) {
                handleFileError<FormData>(error.response, helpers)
                return
            }

            handleError<FormData>(error.response, helpers)
        }
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Modules', path: '/muteer/modules' },
        {
            name: data?.module.title || '',
            path: `/muteer/modules/${moduleId}`,
        },
        { name: `${singularCapitalize} bewerken`, isCurrent: true },
    ]

    if (
        (!isLoading &&
            !moduleIsLoading &&
            !isOwner &&
            !canEditModule &&
            !isModuleManager) ||
        // @ts-ignore
        error?.status === 400
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
            <div
                className={cn('col-span-6', {
                    'lg:col-span-4 lg:col-start-2':
                        singular !== 'gebiedengroep',
                })}>
                {isLocked && (
                    <div className="mb-8">
                        <LockedNotification isDetail />
                    </div>
                )}

                <Heading level="1" size="xxl" className="mb-4">
                    {singularCapitalize} bewerken
                </Heading>

                <DynamicObjectForm
                    model={model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/modules/${moduleId}`)}
                    isLocked={isLocked}
                    isLoading={isLoading || moduleIsLoading}
                    defaultValues={defaultValues}
                />
            </div>
        </MutateLayout>
    )
}

export default ObjectEdit
