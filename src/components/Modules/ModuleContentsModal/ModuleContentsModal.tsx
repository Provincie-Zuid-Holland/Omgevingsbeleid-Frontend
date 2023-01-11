import {
    Button,
    FormikInput,
    FormikRadioGroup,
    FormikSelect,
    FormikTextArea,
    Heading,
    Modal,
    Text,
} from '@pzh-ui/components'
import { Form, Formik, useFormikContext } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'

interface ContentsModalForm {
    state: string
    type: string
}

interface ModuleContentsModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    initialStep: number
    initialValues: ContentsModalForm
}

const ModuleContentsModal = ({
    isOpen,
    setIsOpen,
    initialStep = 1,
    initialValues,
}: ModuleContentsModalProps) => {
    const [step, setStep] = useState(initialStep)

    const handleClose = () => {
        setIsOpen(false)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    /**
     * Handle steps logic of wizard
     */
    const handleWizard = (state: string, type: string) => {
        if (state === 'new' && !!type) {
            return setStep(3)
        } else if (state === 'new') {
            return setStep(2)
        } else if (state === 'existing') {
            return setStep(4)
        }

        return
    }

    const handleFormSubmit = () => {}

    const isFinalStep = step === 3

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Onderdeel toevoegen aan een module"
            maxWidth="sm:max-w-[812px]">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={getValidationSchema(step)}>
                {({ values, handleSubmit, isValid, isSubmitting, ...rest }) => (
                    <Form onSubmit={handleSubmit}>
                        {console.log(rest)}
                        <Wizard step={step} />
                        <div className="mt-6 flex items-center justify-between">
                            <button className="underline" onClick={handleClose}>
                                Annuleren
                            </button>
                            <Button
                                variant={isFinalStep ? 'cta' : 'primary'}
                                type={isFinalStep ? 'submit' : 'button'}
                                onPress={() => {
                                    handleWizard(values.state, values.type)
                                }}
                                isDisabled={
                                    (isFinalStep && !isValid) ||
                                    (isFinalStep && isSubmitting)
                                }>
                                {isFinalStep ? 'Toevoegen' : 'Volgende'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

const Wizard = ({ step }: { step: number }) => {
    const { values } = useFormikContext<ContentsModalForm>()

    switch (step) {
        case 1:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Wat wil je toevoegen?
                    </Heading>
                    <Text className="mb-4">
                        Wil je een nieuw object toevoegen, of een bestaand
                        object?
                    </Text>
                    <FormikRadioGroup
                        name="state"
                        options={[
                            { label: 'Nieuw', value: 'new' },
                            { label: 'Bestaand', value: 'existing' },
                        ]}
                        required
                    />
                </div>
            )
        case 2:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Wat wil je toevoegen?
                    </Heading>
                    <Text className="mb-4">
                        Je wilt een nieuw onderdeel toevoegen aan deze module.
                        Wil je een maatregel, beleidskeuze of beleidsregel
                        toevoegen?
                    </Text>
                    <FormikRadioGroup
                        name="type"
                        options={[
                            { label: 'Beleidskeuze', value: 'beleidskeuze' },
                            { label: 'Maatregel', value: 'maatregel' },
                            { label: 'Beleidsregel', value: 'beleidsregel' },
                        ]}
                    />
                </div>
            )
        case 3:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Nieuwe {values.type}
                    </Heading>
                    <Text className="mb-4">
                        Geef alvast een titel, een eerste en een tweede eigenaar
                        op.
                    </Text>
                    <FormikInput
                        name="Titel"
                        label="Titel"
                        placeholder="Geef een titel op"
                        required
                    />
                    <div className="mt-3">
                        <FormikSelect
                            name="Eigenaar1"
                            label="Eerste eigenaar"
                            placeholder="Kies een eigenaar"
                            options={[
                                {
                                    label: 'Erik Verhaar',
                                    value: 1,
                                },
                                {
                                    label: 'Tom van Gelder',
                                    value: 2,
                                },
                            ]}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <FormikSelect
                            name="Eigenaar2"
                            label="Tweede eigenaar"
                            placeholder="Kies een eigenaar"
                            options={[
                                {
                                    label: 'Erik Verhaar',
                                    value: 1,
                                },
                                {
                                    label: 'Tom van Gelder',
                                    value: 2,
                                },
                            ]}
                        />
                    </div>
                    <div className="mt-3">
                        <FormikTextArea
                            name="Toelichting"
                            label="Toelichting"
                            placeholder="Vul de toelichting in (dit kan ook later)"
                            description="Geef aan waarom deze beleidskeuze gaat worden aangepast in deze module"
                        />
                    </div>
                    <div className="mt-3">
                        <FormikTextArea
                            name="Conclusie"
                            label="Conclusie"
                            placeholder="Vul de conclusie in (dit kan ook later)"
                            description="Geef aan welke wijzigingen doorgevoerd gaan worden aan deze beleidskeuze"
                        />
                    </div>
                </div>
            )
        case 4:
            return <></>
        default:
            return <></>
    }
}

const getValidationSchema = (step: number) => {
    switch (step) {
        case 1:
        case 2:
            return Yup.object().shape({})
        case 3:
            return Yup.object().shape({
                Titel: Yup.string().required('Vul een titel in'),
            })
        default:
            break
    }
}

export default ModuleContentsModal
