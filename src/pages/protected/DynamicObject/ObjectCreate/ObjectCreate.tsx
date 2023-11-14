import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectCreateProps {
    model: (typeof models)[ModelType]
}

const ObjectCreate = ({ model }: ObjectCreateProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { singularCapitalize, plural, pluralCapitalize } = model.defaults
    const { usePostObject, useGetValid, usePutRelations } = model.fetchers

    const { queryKey } = useGetValid(undefined, { query: { enabled: false } })

    const createObject = usePostObject?.()

    const putRelations = usePutRelations?.()

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
    }, [model.dynamicSections])

    /**
     * Handle submit of form
     */
    const handleSubmit = (
        payload: typeof initialData,
        helpers: FormikHelpers<typeof initialData>
    ) => {
        if (!payload) return

        const { connections, ...rest } = payload

        createObject
            ?.mutateAsync(
                {
                    data: rest,
                },
                {
                    onSuccess: data => {
                        if (!!connections && !!data.Object_ID) {
                            putRelations?.mutateAsync(
                                {
                                    lineageId: data.Object_ID,
                                    data: connections,
                                },
                                {
                                    onSuccess: () => {
                                        queryClient
                                            .invalidateQueries({
                                                queryKey,
                                                refetchType: 'all',
                                            })
                                            .then(() =>
                                                navigate(`/muteer/${plural}`)
                                            )

                                        toastNotification('saved')
                                    },
                                }
                            )
                        } else {
                            queryClient
                                .invalidateQueries({
                                    queryKey,
                                    refetchType: 'all',
                                })
                                .then(() => navigate(`/muteer/${plural}`))

                            toastNotification('saved')
                        }
                    },
                }
            )
            .catch(err =>
                handleError<typeof initialData>(err.response, helpers)
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

                <DynamicObjectForm
                    model={model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/${plural}`)}
                    isLoading={false}
                />
            </div>
        </MutateLayout>
    )
}

export default ObjectCreate
