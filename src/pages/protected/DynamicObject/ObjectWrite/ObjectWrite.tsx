import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import MutateLayout from '@/templates/MutateLayout'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectWriteProps {
    model: typeof models[ModelType]
}

const ObjectWrite = ({ model }: ObjectWriteProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { objectId } = useParams()

    const { singularCapitalize, plural, pluralCapitalize } = model.defaults
    const { usePatchObject, useGetLatestLineage, useGetValid } = model.fetchers

    const { data, isLoading, queryKey } = useGetLatestLineage?.(
        parseInt(objectId!),
        {
            query: { enabled: !!objectId },
        }
    )

    const { refetch } = useGetValid(undefined, { query: { enabled: false } })

    const writeObject = usePatchObject?.({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey)
                refetch().then(() => navigate(`/muteer/${plural}`))

                toastNotification('saved')
            },
        },
    })

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in typeof fields[number]]: any }

        fields?.forEach(
            field => (objectData[field] = data?.[field as keyof typeof data])
        )

        return objectData
    }, [data, model.dynamicSections])

    /**
     * Handle submit of form
     */
    const handleSubmit = (payload: typeof initialData) => {
        if (!payload) return

        writeObject?.mutate({
            lineageId: parseInt(objectId!),
            data: payload,
        })
    }

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
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
            <div className="col-span-6">
                <Heading level="1" className="mb-8">
                    {singularCapitalize} bewerken
                </Heading>

                <DynamicObjectForm
                    model={model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/${plural}`)}
                    isLoading={isLoading}
                />
            </div>
        </MutateLayout>
    )
}

export default ObjectWrite
