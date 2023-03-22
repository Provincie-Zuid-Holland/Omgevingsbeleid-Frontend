import { Divider } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikProps } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import ButtonSubmitFixed from '@/components/ButtonSubmitFixed'
import { LoaderContent } from '@/components/Loader'
import ScrollToFieldError from '@/components/ScrollToFieldError'
import { Model } from '@/config/objects/types'
import { toastNotification } from '@/utils/toastNotification'

import {
    SectionBasicInfo,
    SectionConnections,
    SectionDescription,
} from './ObjectSections'

interface DynamicObjectFormProps {
    model: Model
}

const DynamicObjectForm = ({ model }: DynamicObjectFormProps) => {
    const queryClient = useQueryClient()

    const { moduleId, objectId } = useParams()

    const { useGetLatestObjectInModule, usePatchObjectInModule } =
        model.fetchers

    const { data, isLoading, queryKey } = useGetLatestObjectInModule(
        parseInt(moduleId!),
        parseInt(objectId!),
        {
            query: {
                enabled: !!moduleId && !!objectId,
            },
        }
    )

    const patchObject = usePatchObjectInModule({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey)

                toastNotification({ type: 'saved' })
            },
        },
    })

    /**
     * Handle submit of form
     */
    const handleSubmit = (payload: typeof data) => {
        if (!payload) return

        patchObject.mutate({
            moduleId: parseInt(moduleId!),
            lineageId: parseInt(objectId!),
            data: payload,
        })
    }

    if (isLoading || !data) return <LoaderContent />

    return (
        <div>
            <Formik
                initialValues={data || {}}
                validationSchema={
                    model.validationSchema &&
                    toFormikValidationSchema(model.validationSchema)
                }
                validateOnMount
                onSubmit={handleSubmit}
                enableReinitialize>
                {({ ...props }) => (
                    <ObjectForm<typeof data>
                        model={model}
                        isLoading={patchObject.isLoading}
                        {...props}
                    />
                )}
            </Formik>
        </div>
    )
}

interface ObjectFormProps<T> extends FormikProps<T> {
    model: Model
    isLoading?: boolean
}

const ObjectForm = <T,>({
    model,
    isSubmitting,
    isLoading,
}: ObjectFormProps<T>) => {
    const navigate = useNavigate()
    const { moduleId } = useParams()

    const sections = model.dynamicSections

    return (
        <Form>
            <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                <SectionBasicInfo model={model} />
                <div className="col-span-6">
                    <Divider className="my-8" />
                </div>
                {sections?.map((section, index) => {
                    switch (section.type) {
                        case 'description':
                            return (
                                <SectionWrapper
                                    key={`section-${index}`}
                                    isLast={index + 1 === sections.length}>
                                    <SectionDescription
                                        model={model}
                                        section={section}
                                    />
                                </SectionWrapper>
                            )
                        case 'connections':
                            return (
                                <SectionWrapper
                                    key={`section-${index}`}
                                    isLast={index + 1 === sections.length}>
                                    <SectionConnections section={section} />
                                </SectionWrapper>
                            )
                        default:
                            break
                    }
                })}
            </div>

            <ButtonSubmitFixed
                onCancel={() => navigate(`/muteer/modules/${moduleId}`)}
                disabled={isSubmitting || isLoading}
                isLoading={isLoading}
            />

            <ScrollToFieldError />
        </Form>
    )
}

interface SectionWrapperProps {
    isLast: boolean
    children: JSX.Element
}

const SectionWrapper = ({ children, isLast }: SectionWrapperProps) => (
    <>
        {children}
        {!isLast && (
            <div className="col-span-6">
                <Divider className="my-8" />
            </div>
        )}
    </>
)

export default DynamicObjectForm
