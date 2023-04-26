import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { getRegulationsGetQueryKey } from '@/api/fetchers'
import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import * as models from '@/config/regulations'
import { ModelType } from '@/config/regulations/types'
import MutateLayout from '@/templates/MutateLayout'
import { toastNotification } from '@/utils/toastNotification'

interface RegulationEditProps {
    model: typeof models[ModelType]
}

const RegulationEdit = ({ model }: RegulationEditProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { singularCapitalize, plural, pluralCapitalize, regulationType } =
        model.defaults
    const { usePost } = models.default.fetchers

    const createRegulation = usePost({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                queryClient
                    .invalidateQueries(getRegulationsGetQueryKey())
                    .then(() => navigate(`/muteer/${plural}`))

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

        const objectData = {
            Type: regulationType,
        } as { [key in typeof fields[number]]: any }

        fields?.forEach(field => {
            return (objectData[field] = null)
        })

        return objectData
    }, [model.dynamicSections, regulationType])

    /**
     * Handle submit of form
     */
    const handleSubmit = (payload: typeof initialData) => {
        if (!payload) return

        createRegulation.mutate({
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
                    isLoading={false}
                />
            </div>
        </MutateLayout>
    )
}

export default RegulationEdit
