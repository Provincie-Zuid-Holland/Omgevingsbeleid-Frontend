import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import {
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

interface ObjectEditProps {
    model: Model
}

type FormData = Record<string, any>

const EXTRA_FIELDS = [
    'File',
    'File_Ignore',
    'Werkingsgebied_Version',
    'Source_Title',
]

const isVisuallyEmptyRichText = (value: unknown): boolean => {
    if (typeof value !== 'string') return false

    const text = value
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\u200B/g, '')
        .trim()

    return text.length === 0
}

const normalizePayload = (payload: FormData, initialData: FormData) => {
    const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([key]) => key in initialData)
    ) as FormData

    Object.keys(cleanedPayload).forEach(key => {
        const value = cleanedPayload[key]

        if (typeof value === 'string' && isVisuallyEmptyRichText(value)) {
            cleanedPayload[key] = null
        }
    })

    if (Array.isArray(cleanedPayload.Documents)) {
        cleanedPayload.Documents = cleanedPayload.Documents.map(
            (item: any) => item?.value ?? item
        )
    }

    if (Array.isArray(cleanedPayload.Target_Codes)) {
        cleanedPayload.Target_Codes = cleanedPayload.Target_Codes.map(
            (item: any) => item?.value ?? item
        )
    }

    if (
        Array.isArray(cleanedPayload.Ambtsgebied) &&
        cleanedPayload.Ambtsgebied.includes('true')
    ) {
        cleanedPayload.Gebiedengroep_Code = null
    }

    return cleanedPayload
}

const getInitialData = (model: Model, object?: Record<string, any>) => {
    const fields = [
        ...model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        ),
        ...EXTRA_FIELDS,
    ]

    const objectData = fields.reduce<FormData>((acc, field) => {
        acc[field] = object?.[field]
        return acc
    }, {})

    if (fields.includes('Ambtsgebied') && object?.Gebiedengroep_Code === null) {
        objectData.Ambtsgebied = ['true']
    }

    if (fields.includes('File_UUID')) {
        objectData.File = null
    }

    return objectData
}

const getDefaultValues = (object?: Record<string, any>) => ({
    ...(object?.Hierarchy_Statics && {
        Hierarchy_Code: {
            label: object.Hierarchy_Statics.Cached_Title,
            value: object.Hierarchy_Statics.Code,
        },
    }),
    ...(object?.Gebiedengroep_Static && {
        Gebiedengroep_Code: {
            label: object.Gebiedengroep_Static.Cached_Title,
            value: object.Gebiedengroep_Static.Code,
        },
    }),
    ...(object?.Documents_Statics && {
        Documents: object.Documents_Statics.map((item: any) => ({
            label: item.Cached_Title,
            value: item.Code,
        })),
    }),
    ...(object?.Geo_Statics && {
        Target_Codes: object.Geo_Statics.map((item: any) => ({
            label: item.Cached_Title,
            value: item.Code,
        })),
    }),
})

const ObjectEdit = ({ model }: ObjectEditProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation()
    const { moduleId, objectId } = useParams()
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
            if ('File' in cleanedPayload && cleanedPayload.File) {
                const res = await uploadStorageFile({
                    data: {
                        title: cleanedPayload.Filename,
                        uploaded_file: cleanedPayload.File,
                        ignore_report: Boolean(cleanedPayload.File_Ignore),
                    },
                })

                cleanedPayload.File_UUID = res.UUID
                delete cleanedPayload.File
            }

            if (
                'Source_UUID' in cleanedPayload &&
                cleanedPayload.Source_UUID !== object?.Source_UUID
            ) {
                await patchInputGeo({
                    moduleId: parseInt(moduleId, 10),
                    lineageId: parseInt(objectId, 10),
                    inputGeoWerkingsgebiedUuid: cleanedPayload.Source_UUID,
                })
            }

            await patchObject.mutateAsync({
                moduleId: parseInt(moduleId, 10),
                lineageId: parseInt(objectId, 10),
                data: cleanedPayload,
            })

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: objectQueryKey }),
                queryClient.invalidateQueries({ queryKey }),
            ])

            navigate(`/muteer/modules/${moduleId}`)
        } catch (err) {
            const error = err as AxiosError<HTTPValidationError>

            if (!error.response) return

            const hasFileError =
                'File' in cleanedPayload ||
                'File_UUID' in cleanedPayload ||
                'Source_UUID' in cleanedPayload

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
            name: data?.Module.Title || '',
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
            <div className="col-span-6 lg:col-span-4 lg:col-start-2">
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
