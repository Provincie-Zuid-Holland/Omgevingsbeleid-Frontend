import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import {
    getPublicationTemplatesGetListTemplatesQueryKey,
    usePublicationTemplatesPostCreateTemplate,
} from '@/api/fetchers'
import { HTTPValidationError, TemplateCreate } from '@/api/fetchers.schemas'
import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import { Model } from '@/config/objects/types'
import model from '@/config/publicationTemplates'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'
import { AxiosError } from 'axios'

const PublicationTemplateCreate = () => {
    const queryClient = useQueryClient()

    const navigate = useNavigate()

    const { plural, pluralCapitalize, singularCapitalize } = model.defaults

    const { mutateAsync } = usePublicationTemplatesPostCreateTemplate()

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in (typeof fields)[number]]: any }

        fields?.forEach(field => {
            return (objectData[field] = null)
        })

        return objectData
    }, [])

    const handleSubmit = (
        payload: TemplateCreate,
        helpers: FormikHelpers<TemplateCreate>
    ) => {
        if (!!payload.Object_Templates?.length) {
            payload.Object_Templates = (payload.Object_Templates as any).reduce(
                (acc: any, curr: { key: string; value: string }) => (
                    (acc[curr.key] = curr.value), acc
                ),
                {}
            )
        }

        mutateAsync(
            { data: payload },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationTemplatesGetListTemplatesQueryKey(),
                        refetchType: 'all',
                    })

                    toastNotification('saved')
                    navigate('/muteer/publicatietemplates')
                },
            }
        ).catch(
            (err: AxiosError<HTTPValidationError>) =>
                err.response &&
                handleError<TemplateCreate>(err.response, helpers)
        )
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        {
            name: pluralCapitalize,
            path: `/muteer/${plural}`,
        },
        { name: `${singularCapitalize} toevoegen`, isCurrent: true },
    ]

    return (
        <MutateLayout
            title={`${singularCapitalize} toevoegen`}
            breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <Heading level="1" size="xxl" className="mb-8">
                    {singularCapitalize} toevoegen
                </Heading>

                <DynamicObjectForm<TemplateCreate>
                    model={model as Model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/${plural}`)}
                />
            </div>
        </MutateLayout>
    )
}

export default PublicationTemplateCreate
