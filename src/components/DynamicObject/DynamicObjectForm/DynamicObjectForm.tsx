import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { LoaderSpinner } from '@/components/Loader'
import ScrollToFieldError from '@/components/ScrollToFieldError'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'

import DynamicSection from './DynamicSection'

interface DynamicObjectFormProps {
    model: Model
    isLocked?: boolean
}

const DynamicObjectForm = ({ model, isLocked }: DynamicObjectFormProps) => {
    const navigate = useNavigate()

    const { moduleId, objectId } = useParams()

    const { data, isLoading, usePatchObject } = useObject()

    const sections = model.dynamicSections

    const patchObject = usePatchObject(() =>
        navigate(`/muteer/modules/${moduleId}`)
    )

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in typeof fields[number]]: any }

        fields?.forEach(field => {
            if (field === 'Gebied_UUID') {
                return (objectData[field] = data?.['Gebied']?.UUID)
            }

            return (objectData[field] = data?.[field as keyof typeof data])
        })

        return objectData
    }, [data, model.dynamicSections])

    /**
     * Handle submit of form
     */
    const handleSubmit = (payload: typeof initialData) => {
        if (!payload) return

        patchObject.mutate({
            moduleId: parseInt(moduleId!),
            lineageId: parseInt(objectId!),
            data: payload,
        })
    }

    return (
        <>
            {!isLoading ? (
                <Formik
                    initialValues={initialData}
                    validationSchema={
                        model.validationSchema &&
                        toFormikValidationSchema(model.validationSchema)
                    }
                    validateOnMount
                    onSubmit={handleSubmit}
                    enableReinitialize>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                                {sections?.map((section, index) => (
                                    <DynamicSection
                                        key={`section-${index}`}
                                        isLast={index + 1 === sections.length}
                                        isLocked={isLocked}
                                        {...section}
                                    />
                                ))}
                            </div>

                            <ButtonSubmitFixed
                                onCancel={() =>
                                    navigate(`/muteer/modules/${moduleId}`)
                                }
                                disabled={isSubmitting || isLoading || isLocked}
                                isLoading={isSubmitting}
                            />

                            <ScrollToFieldError />
                        </Form>
                    )}
                </Formik>
            ) : (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            )}
        </>
    )
}

export default DynamicObjectForm
