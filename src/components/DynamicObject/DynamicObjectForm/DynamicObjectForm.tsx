import { FieldSelectProps } from '@pzh-ui/components'
import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { LoaderSpinner } from '@/components/Loader'
import ScrollToFieldError from '@/components/ScrollToFieldError'
import { Model } from '@/config/objects/types'
import { usePrompt } from '@/hooks/usePrompt'

import DynamicSection from './DynamicSection'

interface DynamicObjectFormProps<TData> {
    model: Model
    initialData: TData
    handleSubmit: (payload: TData, helpers: FormikHelpers<TData>) => void
    onCancel: () => void
    isLocked?: boolean
    isLoading?: boolean
    defaultValues?: {
        [key: string]: FieldSelectProps['defaultValue']
    }
}

const DynamicObjectForm = <TData extends FormikValues>({
    model,
    initialData,
    handleSubmit,
    isLoading,
    ...rest
}: DynamicObjectFormProps<TData>) => (
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
                {props => (
                    <ObjectForm
                        model={model}
                        isLoading={isLoading}
                        {...props}
                        {...rest}
                    />
                )}
            </Formik>
        ) : (
            <div className="flex justify-center">
                <LoaderSpinner />
            </div>
        )}
    </>
)

const ObjectForm = <TData extends FormikValues>({
    model,
    onCancel,
    isLocked,
    isLoading,
    isSubmitting,
    dirty,
    defaultValues,
}: Omit<DynamicObjectFormProps<TData>, 'initialData' | 'handleSubmit'> &
    FormikProps<TData>) => {
    const sections = model.dynamicSections

    /**
     * Show prompt message when leaving the page without saving changes
     */
    usePrompt(
        'Weet je zeker dat je deze pagina wilt verlaten? Wijzigingen die je hebt aangebracht, worden niet opgeslagen.',
        dirty && !isSubmitting
    )

    return (
        <Form>
            <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                {sections?.map((section, index) => (
                    <DynamicSection
                        key={`section-${index}`}
                        isLast={index + 1 === sections.length}
                        isLocked={isLocked}
                        model={model}
                        defaultValues={defaultValues}
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
    )
}

export default DynamicObjectForm
