import {
    Button,
    FormikSelect,
    FormikTextArea,
    Heading,
    Modal,
    Text,
} from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getModulesModuleIdObjectContextObjectTypeLineageIdGetQueryKey,
    useModulesModuleIdObjectContextObjectTypeLineageIdGet,
    useModulesModuleIdObjectContextObjectTypeLineageIdPost,
} from '@/api/fetchers'
import {
    ModuleEditObjectContext,
    ModuleObjectShort,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

interface ModuleEditObjectModalProps {
    isOpen: boolean
    onClose: () => void
    object: ModuleObjectShort
}

const ModuleEditObjectModal = ({
    isOpen,
    onClose,
    object,
}: ModuleEditObjectModalProps) => {
    const queryClient = useQueryClient()

    const isAdded =
        object.ModuleObjectContext?.Action === 'Create' ||
        object.ModuleObjectContext?.Action === 'Toevoegen'

    const {
        data: objectData,
        isLoading: isDataLoading,
        isFetching: isDataFetching,
    } = useModulesModuleIdObjectContextObjectTypeLineageIdGet(
        object.Module_ID,
        object.Object_Type,
        object.Object_ID,
        {
            query: {
                enabled: !!object.Object_ID,
            },
        }
    )

    /**
     * Edit object
     */
    const { mutate, isLoading } =
        useModulesModuleIdObjectContextObjectTypeLineageIdPost({
            mutation: {
                onError: () => {
                    toastNotification('error')
                },
                onSuccess: () => {
                    queryClient
                        .invalidateQueries(
                            getModulesModuleIdObjectContextObjectTypeLineageIdGetQueryKey(
                                object.Module_ID,
                                object.Object_Type,
                                object.Object_ID
                            )
                        )
                        .then(() => onClose()),
                        toastNotification('saved')
                },
            },
        })

    const handleFormSubmit = (payload: ModuleEditObjectContext) => {
        if (object) {
            mutate({
                moduleId: object.Module_ID,
                objectType: object.Object_Type,
                lineageId: object.Object_ID,
                data: {
                    Explanation: payload.Explanation,
                    Conclusion: payload.Conclusion,
                    ...(!isAdded && { Action: payload.Action }),
                },
            })
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel="Object bewerken"
            maxWidth="sm:max-w-[812px]">
            {isDataLoading && isDataFetching ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : (
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={objectData as ModuleEditObjectContext}
                    validationSchema={toFormikValidationSchema(
                        modules.SCHEMA_EDIT_EXISTING_OBJECT
                    )}
                    enableReinitialize>
                    <Form>
                        <Heading
                            level="2"
                            className="mb-4 first-letter:uppercase">
                            {object.Object_Type} bewerken
                        </Heading>
                        <Text className="mb-4">
                            Hier kun je de {!isAdded ? 'actie, ' : ''}
                            toelichting en conclusie aanpassen van “
                            {object.Title}”.
                        </Text>
                        {!isAdded && (
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
                        )}
                        <div className="mt-3">
                            <FormikTextArea
                                name="Explanation"
                                label="Toelichting"
                                placeholder="Vul de toelichting in"
                                description="Geef aan waarom deze beleidskeuze gaat worden aangepast in deze module"
                            />
                        </div>
                        <div className="mt-3">
                            <FormikTextArea
                                name="Conclusion"
                                label="Conclusie"
                                placeholder="Vul de conclusie in"
                                description="Geef aan welke wijzigingen doorgevoerd gaan worden aan deze beleidskeuze"
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={onClose}>
                                Annuleren
                            </Button>
                            <Button
                                variant="cta"
                                type="submit"
                                isDisabled={isLoading}
                                isLoading={isLoading}>
                                Opslaan
                            </Button>
                        </div>
                    </Form>
                </Formik>
            )}
        </Modal>
    )
}

export default ModuleEditObjectModal
