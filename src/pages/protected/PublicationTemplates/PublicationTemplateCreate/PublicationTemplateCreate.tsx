import { Heading } from '@pzh-ui/components'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import model from '@/config/publicationTemplates'
import MutateLayout from '@/templates/MutateLayout'

const PublicationTemplateCreate = () => {
    const navigate = useNavigate()

    const { plural, pluralCapitalize, singularCapitalize } = model.defaults

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

    const handleSubmit = () => {}

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
                />
            </div>
        </MutateLayout>
    )
}

export default PublicationTemplateCreate
