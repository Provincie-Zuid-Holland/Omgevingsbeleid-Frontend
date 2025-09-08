import { Badge, Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useMemo } from 'react'
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
import { toastNotification } from '@/utils/toastNotification'
import { AxiosError } from 'axios'

const PublicationTemplateEdit = () => {
    const queryClient = useQueryClient()

    const { uuid } = useParams()

    const navigate = useNavigate()

    const { canEditPublicationTemplate } = usePermissions()

    const { plural, pluralCapitalize, singularCapitalize } = model.defaults

    const { data, isFetching, queryKey } =
        usePublicationTemplatesGetDetailTemplate(uuid!, {
            query: {
                enabled: !!uuid,
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
                field === 'Object_Templates' &&
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
        if (!!payload.Object_Templates?.length) {
            payload.Object_Templates = (payload.Object_Templates as any).reduce(
                (acc: any, curr: { key: string; value: string }) => (
                    (acc[curr.key] = curr.value), acc
                ),
                {}
            )
        }

        mutateAsync({ templateUuid: uuid!, data: payload })
            .then(() => {
                Promise.all([
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationTemplatesGetListTemplatesQueryKey(),
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries({ queryKey }),
                ]).then(() => navigate('/muteer/publicatietemplates'))
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
            { templateUuid: uuid!, data: { Is_Active: activate } },
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
            <div className="col-span-6 mb-8 flex items-center justify-between">
                <Heading level="1" size="xxl">
                    {singularCapitalize} bewerken
                </Heading>

                <div className="border-pzh-gray-200 flex items-center justify-between gap-4 rounded border px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Badge
                            variant={data?.Is_Active ? 'green' : 'red'}
                            text={data?.Is_Active ? 'Actief' : 'Inactief'}
                            upperCase={false}
                        />
                        <ToggleSwitch
                            checked={data?.Is_Active || false}
                            title={
                                data?.Is_Active
                                    ? 'Template deactiveren'
                                    : 'Template activeren'
                            }
                            onClick={handleTemplateStatus}
                        />
                    </div>
                </div>
            </div>

            <div className="col-span-6">
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
