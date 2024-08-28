import { Button, formatDate, Heading } from '@pzh-ui/components'
import { XmarkLarge } from '@pzh-ui/icons'
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    useModulesModuleIdStatusGet,
    usePublicationActsGet,
    usePublicationEnvironmentsGet,
    usePublicationsPost,
    usePublicationsPublicationUuidVersionPost,
    usePublicationTemplatesGet,
} from '@/api/fetchers'
import { PublicationCreate } from '@/api/fetchers.schemas'
import {
    EMPTY_PUBLICATION_OBJECT,
    SCHEMA_PUBLICATION,
    SCHEMA_PUBLICATION_STEPS,
} from '@/validation/publication'

import {
    StepFive,
    StepFour,
    StepOne,
    StepSix,
    StepThree,
    StepTwo,
} from './steps'

export type PublicationWizardSchema = z.infer<typeof SCHEMA_PUBLICATION>

const steps = [StepOne, StepTwo, StepThree, StepFour, StepFive, StepSix]

const PublicationWizard = () => {
    const { moduleId } = useParams()

    const [step, setStep] = useState(0)

    const isFinalStep = step === 5
    const currentValidationSchema = SCHEMA_PUBLICATION_STEPS[step]

    const { mutateAsync: postPublication } = usePublicationsPost()
    const { mutate: postVersion } = usePublicationsPublicationUuidVersionPost()

    const initialValues = {
        ...EMPTY_PUBLICATION_OBJECT,
        Module_ID: parseInt(moduleId!),
    }

    /**
     * Handle submit of contents form
     */
    const handleFormSubmit = (
        { Module_Status_ID, ...payload }: PublicationWizardSchema,
        helpers: FormikHelpers<PublicationWizardSchema>
    ) => {
        if (isFinalStep) {
            postPublication({ data: payload }).then(data => {
                postVersion({
                    publicationUuid: data.UUID,
                    data: {
                        Module_Status_ID,
                    },
                })
            })
        } else {
            setStep(step + 1)
            helpers.setTouched({})
            helpers.setSubmitting(false)
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            validationSchema={toFormikValidationSchema(
                // @ts-ignore
                currentValidationSchema
            )}
            enableReinitialize>
            {({ isSubmitting, isValid, submitForm }) => (
                <Form className="rounded-lg border border-pzh-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <Heading level="2" size="s">
                            Nieuwe publicatie aanmaken
                        </Heading>
                        <Button variant="default">
                            <XmarkLarge size={16} />
                        </Button>
                    </div>
                    <WizardForm step={step} />
                    <div className="flex items-center justify-between">
                        <Button
                            size="small"
                            variant="secondary"
                            isDisabled={step === 0}
                            onPress={() => setStep(step - 1)}>
                            Vorige stap
                        </Button>
                        <Button
                            variant="cta"
                            size="small"
                            type="button"
                            isDisabled={
                                isSubmitting || (isFinalStep && !isValid)
                            }
                            onPress={submitForm}>
                            {isFinalStep ? 'Aanmaken' : 'Volgende stap'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

interface WizardFormProps {
    step: number
}

const WizardForm = ({ step }: WizardFormProps) => {
    const { moduleId } = useParams()

    const { values } = useFormikContext<PublicationCreate>()

    const {
        data: publicationTemplateOptions = [],
        isFetching: publicationTemplatesFetching,
    } = usePublicationTemplatesGet(
        { limit: 100 },
        {
            query: {
                select: data =>
                    data.results.map(template => ({
                        label: template.Title,
                        value: template.UUID,
                    })),
            },
        }
    )

    const { data: environmentOptions = [], isFetching: environmentsFetching } =
        usePublicationEnvironmentsGet(
            { limit: 100 },
            {
                query: {
                    select: data =>
                        data.results.map(environment => ({
                            label: environment.Title,
                            value: environment.UUID,
                        })),
                },
            }
        )

    const {
        data: publicationActOptions = [],
        isFetching: publicationActsFetching,
    } = usePublicationActsGet(
        {
            limit: 100,
            is_active: true,
            environment_uuid: values.Environment_UUID,
            document_type: values.Document_Type,
            procedure_type: values.Procedure_Type,
        },
        {
            query: {
                select: data =>
                    data.results.map(act => ({
                        label: act.Title,
                        value: act.UUID,
                    })),
                enabled:
                    !!values.Environment_UUID &&
                    !!values.Document_Type &&
                    !!values.Procedure_Type,
            },
        }
    )

    const { data: moduleStatusOptions = [], isFetching: moduleStatusFetching } =
        useModulesModuleIdStatusGet(parseInt(moduleId!), {
            query: {
                enabled: !!moduleId,
                select: data =>
                    data
                        .filter(status => status.Status !== 'Niet-Actief')
                        .map(status => ({
                            label: `${status.Status} (${formatDate(
                                new Date(status.Created_Date + 'Z'),
                                'dd-MM-yyyy'
                            )})`,
                            value: status.ID,
                        })),
            },
        })

    const CurrentStep = steps[step]

    return (
        <div className="flex flex-col items-center gap-4 py-12">
            <CurrentStep
                data={{
                    environments: {
                        options: environmentOptions,
                        isLoading: environmentsFetching,
                    },
                    acts: {
                        options: publicationActOptions,
                        isLoading: publicationActsFetching,
                    },
                    templates: {
                        options: publicationTemplateOptions,
                        isLoading: publicationTemplatesFetching,
                    },
                    moduleStatus: {
                        options: moduleStatusOptions,
                        isLoading: moduleStatusFetching,
                    },
                }}
            />
        </div>
    )
}

export default PublicationWizard
