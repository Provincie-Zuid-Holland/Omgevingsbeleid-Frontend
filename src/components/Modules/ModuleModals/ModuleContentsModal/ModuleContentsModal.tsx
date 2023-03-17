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
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, useFormikContext } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getModulesModuleIdGetQueryKey,
    useModulesModuleIdAddExistingObjectPost,
    useModulesModuleIdAddNewObjectPost,
    useUsersGet,
} from '@/api/fetchers'
import {
    Module,
    ModuleAddExistingObject,
    ModuleAddNewObject,
    SearchObject,
} from '@/api/fetchers.schemas'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

import ModuleObjectSearch from '../../ModuleObjectSearch'

export type ContentsModalForm = (
    | ModuleAddNewObject
    | ModuleAddExistingObject
) & {
    state?: 'new' | 'existing'
}

interface ModuleContentsModalProps {
    isOpen: boolean
    onClose: () => void
    initialStep: number
    initialValues: ContentsModalForm
    module?: Module
    selectedObject?: SearchObject
}

const ModuleContentsModal = ({
    isOpen,
    onClose,
    initialStep = 1,
    initialValues,
    module,
    selectedObject,
}: ModuleContentsModalProps) => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const [step, setStep] = useState(initialStep)

    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    /**
     * Handle steps logic of wizard
     */
    const handleWizard = (
        state: ContentsModalForm['state'],
        Object_Type?: ModuleAddNewObject['Object_Type'],
        ExistingObject?: ModuleAddExistingObject['Object_UUID']
    ) => {
        if (state === 'new' && !!Object_Type) {
            return setStep(3)
        } else if (state === 'new') {
            return setStep(2)
        } else if (state === 'existing' && !!ExistingObject) {
            return setStep(5)
        } else if (state === 'existing') {
            return setStep(4)
        }

        return
    }

    /**
     * Add new object to module
     */
    const addNewObjectToModule = useModulesModuleIdAddNewObjectPost({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                queryClient
                    .invalidateQueries(
                        getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                    )
                    .then(() => onClose())

                toastNotification({ type: 'saved' })
            },
        },
    })

    /**
     * Add existing object to module
     */
    const addExistingObjectToModule = useModulesModuleIdAddExistingObjectPost({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                queryClient
                    .invalidateQueries(
                        getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                    )
                    .then(() => onClose())

                toastNotification({ type: 'saved' })
            },
        },
    })

    const handleFormSubmit = (payload: ContentsModalForm) => {
        const { state, ...data } = payload

        if (state === 'new' && 'Object_Type' in data) {
            addNewObjectToModule.mutate({ moduleId: parseInt(moduleId!), data })
        } else if (state === 'existing' && 'Action' in data) {
            addExistingObjectToModule.mutate({
                moduleId: parseInt(moduleId!),
                data,
            })
        }
    }

    const isFinalStep = step === 3 || step === 5

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Onderdeel toevoegen aan een module"
            maxWidth="sm:max-w-[812px]">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    modules.SCHEMA_ADD_OBJECT
                )}
                enableReinitialize>
                {({ values, handleSubmit, isValid, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <Wizard
                            step={step}
                            module={module}
                            selectedObject={selectedObject}
                        />
                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            <Button
                                variant={isFinalStep ? 'cta' : 'primary'}
                                type={isFinalStep ? 'submit' : 'button'}
                                onPress={() => {
                                    handleWizard(
                                        values.state,
                                        ('Object_Type' in values &&
                                            values.Object_Type) ||
                                            '',
                                        ('Object_UUID' in values &&
                                            values.Object_UUID) ||
                                            ''
                                    )
                                }}
                                isDisabled={
                                    (isFinalStep && !isValid) ||
                                    (isFinalStep && isSubmitting)
                                }
                                isLoading={isSubmitting}>
                                {isFinalStep ? 'Toevoegen' : 'Volgende'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

const Wizard = ({
    step,
    module,
    selectedObject,
}: Pick<ModuleContentsModalProps, 'module' | 'selectedObject'> & {
    step: number
}) => {
    const { values } = useFormikContext<ContentsModalForm>()
    const { data: users, isFetching, isLoading } = useUsersGet()

    const [existingObject, setExistingObject] = useState<
        SearchObject | undefined
    >(selectedObject)

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
        case 3:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Nieuwe {'Object_Type' in values && values.Object_Type}
                    </Heading>
                    <Text className="mb-4">
                        Geef alvast een titel, een eerste en een tweede eigenaar
                        op.
                    </Text>
                    <FormikInput
                        name="Title"
                        label="Titel"
                        placeholder="Geef een titel op"
                        required
                    />
                    <div className="mt-3">
                        <FormikSelect
                            name="Owner_1_UUID"
                            label="Eerste eigenaar"
                            placeholder="Kies een eigenaar"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={users?.map(user => ({
                                label: user.Gebruikersnaam,
                                value: user.UUID,
                            }))}
                            required
                        />
                    </div>
                    <div className="mt-3">
                        <FormikSelect
                            name="Owner_2_UUID"
                            label="Tweede eigenaar"
                            placeholder="Kies een eigenaar"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={users?.map(user => ({
                                label: user.Gebruikersnaam,
                                value: user.UUID,
                            }))}
                        />
                    </div>
                    <div className="mt-3">
                        <FormikTextArea
                            name="Explanation"
                            label="Toelichting"
                            placeholder="Vul de toelichting in (dit kan ook later)"
                            description="Geef aan waarom deze beleidskeuze gaat worden aangepast in deze module"
                        />
                    </div>
                    <div className="mt-3">
                        <FormikTextArea
                            name="Conclusion"
                            label="Conclusie"
                            placeholder="Vul de conclusie in (dit kan ook later)"
                            description="Geef aan welke wijzigingen doorgevoerd gaan worden aan deze beleidskeuze"
                        />
                    </div>
                </div>
            )
        case 4:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Wat wil je toevoegen?
                    </Heading>
                    <Text className="mb-4">
                        Je wilt een bestaand onderdeel toevoegen aan deze
                        module. Welk object wil je toevoegen?
                    </Text>
                    <ModuleObjectSearch onChange={setExistingObject} />
                </div>
            )
        case 5:
            return (
                <div>
                    <Heading level="2" className="mb-4">
                        Bestaande {existingObject?.Object_Type}
                    </Heading>
                    <Text className="mb-4">
                        “{existingObject?.Title}” toevoegen aan de module “
                        {module?.Title}”
                    </Text>
                    <FormikSelect
                        key="Action"
                        name="Action"
                        placeholder="Selecteer de actie"
                        label="Actie"
                        description="Gaat deze beleidskeuze wijzigen in deze module, of komt hij te vervallen?"
                        options={[
                            {
                                label: 'Wijzigen',
                                value: 'Edit',
                            },
                            {
                                label: 'Verwijderen',
                                value: 'Terminate',
                            },
                        ]}
                        required
                    />
                    <div className="mt-3">
                        <FormikTextArea
                            name="Explanation"
                            label="Toelichting"
                            placeholder="Vul de toelichting in (dit kan ook later)"
                            description="Geef aan waarom deze beleidskeuze gaat worden aangepast in deze module"
                        />
                    </div>
                    <div className="mt-3">
                        <FormikTextArea
                            name="Conclusion"
                            label="Conclusie"
                            placeholder="Vul de conclusie in (dit kan ook later)"
                            description="Geef aan welke wijzigingen doorgevoerd gaan worden aan deze beleidskeuze"
                        />
                    </div>
                </div>
            )
        default:
            return <></>
    }
}

export default ModuleContentsModal
