import { Heading } from '@pzh-ui/components'
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
    model: typeof models[ModelType]
}

const ObjectCreate = ({ model }: ObjectCreateProps) => {
    const navigate = useNavigate()

    const { singularCapitalize, plural, pluralCapitalize } = model.defaults
    const { usePostObject, useGetValid } = model.fetchers

    const { refetch } = useGetValid(undefined, { query: { enabled: false } })

    const createObject = usePostObject?.({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
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

        createObject
            ?.mutateAsync({
                data: payload,
            })
            .catch(err => handleError<typeof initialData>(err, helpers))
    }

    const breadcrumbPaths = [
        { name: 'Muteeromgeving', path: '/muteer' },
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
                <Heading level="1" className="mb-8">
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
