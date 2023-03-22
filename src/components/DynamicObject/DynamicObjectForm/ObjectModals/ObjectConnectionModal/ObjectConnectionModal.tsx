import {
    Button,
    FormikRadioGroup,
    FormikTextArea,
    Heading,
    Modal,
    Text,
} from '@pzh-ui/components'
import { Formik, Form, useFormikContext } from 'formik'
import { useState } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { RelationShort } from '@/api/fetchers.schemas'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import * as objectRelation from '@/validation/objectRelation'

interface ObjectConnectionModalProps {
    isOpen: boolean
    onClose: () => void
    initialValues?: Partial<RelationShort>
    initialStep?: number
    isEdit?: boolean
}

const ObjectConnectionModal = ({
    isOpen,
    onClose,
    initialValues = {},
    initialStep = 1,
    isEdit,
}: ObjectConnectionModalProps) => {
    const { values, setFieldValue } = useFormikContext<{
        relations?: RelationShort[]
    }>()

    const [step, setStep] = useState(initialStep)

    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    const handleFormSubmit = (payload?: Partial<RelationShort>) => {
        if (!payload) return

        if (isEdit) {
            const index = values.relations?.findIndex(
                relation =>
                    relation.ID === payload.ID &&
                    relation.Object_Type === payload.Object_Type
            )

            setFieldValue(`relations.${index}`, payload)
            handleClose()
        } else {
            setFieldValue('relations', [...(values.relations || []), payload])
            handleClose()
        }
    }

    const isFinalStep = step === 3

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Nieuwe koppeling"
            maxWidth="sm:max-w-[812px]">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    objectRelation.SCHEMA
                )}
                enableReinitialize>
                {({ isValid, isSubmitting }) => (
                    <Form>
                        <Wizard step={step} />
                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            <Button
                                variant={isFinalStep ? 'cta' : 'primary'}
                                type={isFinalStep ? 'submit' : 'button'}
                                isDisabled={
                                    (isFinalStep && !isValid) ||
                                    (isFinalStep && isSubmitting)
                                }
                                onPress={
                                    !isFinalStep
                                        ? () => setStep(step + 1)
                                        : undefined
                                }
                                isLoading={isSubmitting}>
                                {isFinalStep ? 'Opslaan' : 'Volgende'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

const Wizard = ({ step }: { step: number }) => {
    const { values, setFieldValue } = useFormikContext<
        RelationShort & { Title?: string }
    >()

    switch (step) {
        case 1:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Wat wil je koppelen?
                    </Heading>
                    <Text className="mb-4">
                        Je wilt een koppeling maken vanuit deze maatregel naar
                        een ander object, wat voor object?
                    </Text>
                    <FormikRadioGroup
                        name="Object_Type"
                        options={[
                            { label: 'Ambitie', value: 'ambitie' },
                            { label: 'Beleidskeuze', value: 'beleidskeuze' },
                            { label: 'Maatregel', value: 'maatregel' },
                            { label: 'Beleidsregel', value: 'beleidsregel' },
                            { label: 'Beleidsdoel', value: 'beleidsdoel' },
                        ]}
                    />
                </div>
            )
        case 2:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Wat wil je koppelen?
                    </Heading>
                    <Text className="mb-4">
                        Geef een zoekopdracht op en selecteer een{' '}
                        {values.Object_Type} om deze te koppelen
                    </Text>
                    <DynamicObjectSearch
                        onChange={object =>
                            setFieldValue('Title', object?.Title)
                        }
                        objectKey="id"
                        placeholder={`Zoek een ${values.Object_Type}`}
                    />
                    <input name="Title" type="hidden" />
                </div>
            )
        case 3:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Koppeling
                    </Heading>
                    <Text className="mb-4">
                        Beschrijf de koppeling tussen ‘{values.Title}’ en ‘titel
                        gebiedsprogramma’
                    </Text>
                    <FormikTextArea
                        name="Description"
                        placeholder="Beschrijving / Motivering van de koppeling"
                    />
                </div>
            )
        default:
            return <></>
    }
}

export default ObjectConnectionModal
