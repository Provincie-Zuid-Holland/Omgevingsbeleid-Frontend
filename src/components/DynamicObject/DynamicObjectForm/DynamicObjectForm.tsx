import { Form, Formik, FormikHelpers, FormikValues } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { LoaderSpinner } from '@/components/Loader'
import ScrollToFieldError from '@/components/ScrollToFieldError'
import { Model } from '@/config/objects/types'

import DynamicSection from './DynamicSection'

interface DynamicObjectFormProps<TData> {
    model: Model
    initialData: TData
    handleSubmit: (payload: TData, helpers: FormikHelpers<any>) => void
    onCancel: () => void
    isLocked?: boolean
    isLoading?: boolean
}

const DynamicObjectForm = <TData extends FormikValues>({
    model,
    initialData,
    handleSubmit,
    onCancel,
    isLoading,
    isLocked,
}: DynamicObjectFormProps<TData>) => {
    const sections = model.dynamicSections

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
                                onCancel={onCancel}
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
