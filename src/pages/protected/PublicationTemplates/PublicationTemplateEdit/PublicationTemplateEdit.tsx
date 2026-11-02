import { useMemo } from 'react'

import { Badge, Heading } from '@pzh-ui/components'

import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormikHelpers } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'

import {
    getPublicationTemplatesGetListTemplatesQueryKey,
    usePublicationTemplatesGetDetailTemplate,
    usePublicationTemplatesPostEditTemplate,
} from '@/api/fetchers'
import { HTTPValidationError, TemplateEdit } from '@/api/fetchers.schemas'
import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import ToggleSwitch from '@/components/ToggleSwitch'
import { Model } from '@/config/objects/types'
import model from '@/config/publicationTemplates'
import usePermissions from '@/hooks/usePermissions'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'
import { normalizeFieldMap } from '@/utils/normalizeFieldMap'
import { toastNotification } from '@/utils/toastNotification'

const PublicationTemplateEdit = () => {
    const queryClient = useQueryClient()

    const { id } = useParams()

    const navigate = useNavigate()

    const { canEditPublicationTemplate } = usePermissions()

    const { plural, pluralCapitalize, singularCapitalize } = model.defaults

    const { data, isFetching, queryKey } =
        usePublicationTemplatesGetDetailTemplate(id!, {
            query: {
                enabled: !!id,
            },
        })

    const { mutate, mutateAsync } = usePublicationTemplatesPostEditTemplate()

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in (typeof fields)[number]]: any }

        fields?.forEach(field => {
            if (
                (field === 'object_templates' ||
                    field === 'object_field_map') &&
                !!data?.[field as keyof typeof data] &&
                typeof data[field] === 'object'
            ) {
                return (objectData[field] = Object.keys(data[field] || {}).map(
                    template => ({
                        key: template,
                        value: (data[field] as Record<string, unknown>)[
                            template
                        ],
                    })
                ))
            }

            return (objectData[field] = data?.[field as keyof typeof data])
        })

        return objectData
    }, [data])

    const handleSubmit = (
        payload: TemplateEdit,
        helpers: FormikHelpers<typeof initialData>
    ) => {
        if (!!payload.object_templates?.length) {
            payload.object_templates = (payload.object_templates as any).reduce(
                (acc: any, curr: { key: string; value: string }) => (
                    (acc[curr.key] = curr.value),
                    acc
                ),
                {}
            )
        }

        if (!!payload.object_field_map?.length) {
            payload.object_field_map = normalizeFieldMap(
                payload.object_field_map as any
            )
        }

        if (!!payload.object_types?.length) {
            payload.object_types = (payload.object_types as any).map(
                (item: any) => (typeof item === 'string' ? item : item.value)
            )
        }

        mutateAsync({ templateId: id!, data: payload })
            .then(() => {
                Promise.all([
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationTemplatesGetListTemplatesQueryKey(),
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries({ queryKey }),
                ]).then(() => {
                    toastNotification('templateEdit')
                    navigate('/muteer/publicatietemplates')
                })
            })
            .catch(
                (err: AxiosError<HTTPValidationError>) =>
                    err.response &&
                    handleError<typeof initialData>(err.response, helpers)
            )
    }

    const handleTemplateStatus = (activate: boolean) => {
        if (!data) return

        mutate(
            { templateId: id!, data: { is_active: activate } },
            {
                onSuccess: () =>
                    Promise.all([
                        queryClient.invalidateQueries({
                            queryKey:
                                getPublicationTemplatesGetListTemplatesQueryKey(),
                            refetchType: 'all',
                        }),
                        queryClient.invalidateQueries({ queryKey }),
                    ]).then(() =>
                        toastNotification(
                            activate
                                ? 'templateActivated'
                                : 'templateDeactivated'
                        )
                    ),
            }
        )
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        {
            name: pluralCapitalize,
            path: `/muteer/${plural}`,
        },
        { name: `${singularCapitalize} bewerken`, isCurrent: true },
    ]

    return (
        <MutateLayout
            title={`${singularCapitalize} bewerken`}
            breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6 mb-8 flex items-center justify-between md:col-span-4 md:col-start-2">
                <Heading level="1" size="xxl">
                    {singularCapitalize} bewerken
                </Heading>

                <div className="flex items-center justify-between gap-4 rounded border border-pzh-gray-200 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Badge
                            variant={data?.is_active ? 'green' : 'red'}
                            text={data?.is_active ? 'Actief' : 'Inactief'}
                            upperCase={false}
                        />
                        <ToggleSwitch
                            checked={data?.is_active || false}
                            title={
                                data?.is_active
                                    ? 'Template deactiveren'
                                    : 'Template activeren'
                            }
                            onClick={handleTemplateStatus}
                        />
                    </div>
                </div>
            </div>

            <div className="col-span-6 md:col-span-4 md:col-start-2">
                <DynamicObjectForm
                    model={model as Model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/${plural}`)}
                    isLoading={isFetching}
                    canEdit={canEditPublicationTemplate}
                />
            </div>
        </MutateLayout>
    )
}

export default PublicationTemplateEdit
