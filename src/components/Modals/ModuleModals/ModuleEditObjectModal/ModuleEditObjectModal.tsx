import { Button, FormikSelect, FormikTextArea, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getModulesModuleIdGetQueryKey,
    getModulesModuleIdObjectContextObjectTypeLineageIdGetQueryKey,
    useModulesModuleIdObjectContextObjectTypeLineageIdGet,
    useModulesModuleIdObjectContextObjectTypeLineageIdPost,
} from '@/api/fetchers'
import {
    ModuleEditObjectContext,
    ModuleObjectShort,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

import { ModalStateMap } from '../../types'

const ModuleEditObjectModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['moduleEditObject']
    ) as ModalStateMap['moduleEditObject']

    const { object = {} as ModuleObjectShort } = modalState || {}

    const model = models[object.Object_Type as ModelType] || {}
    const { singularReadable, singularCapitalize, prefixSingular } =
        model.defaults || {}

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
    const { mutate, isPending, isError } =
        useModulesModuleIdObjectContextObjectTypeLineageIdPost({
            mutation: {
                onSuccess: () => {
                    Promise.all([
                        queryClient.invalidateQueries({
                            queryKey:
                                getModulesModuleIdObjectContextObjectTypeLineageIdGetQueryKey(
                                    object.Module_ID,
                                    object.Object_Type,
                                    object.Object_ID
                                ),
                        }),
                        queryClient.invalidateQueries({
                            queryKey: getModulesModuleIdGetQueryKey(
                                object.Module_ID
                            ),
                        }),
                    ]).then(() => setActiveModal(null)),
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
        <Modal id="moduleEditObject" title={`${singularCapitalize} bewerken`}>
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
                                description={`Gaat ${prefixSingular} ${singularReadable} wijzigen in deze module, of komt hij te vervallen?`}
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
                                noOptionsMessage={({ inputValue }) =>
                                    !!inputValue && 'Geen resultaten gevonden'
                                }
                                blurInputOnSelect
                                required
                            />
                        )}
                        <div className="mt-3">
                            <FormikTextArea
                                name="Explanation"
                                label="Toelichting"
                                placeholder="Vul de toelichting in"
                                description={`Geef aan waarom ${prefixSingular} ${singularReadable} gaat worden aangepast in deze module`}
                                optimized={false}
                            />
                        </div>
                        <div className="mt-3">
                            <FormikTextArea
                                name="Conclusion"
                                label="Conclusie"
                                placeholder="Vul de conclusie in"
                                description={`Geef aan welke wijzigingen doorgevoerd gaan worden aan ${prefixSingular} ${singularReadable}`}
                                optimized={false}
                            />
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <Button
                                variant="link"
                                onPress={() => setActiveModal(null)}>
                                Annuleren
                            </Button>
                            <Button
                                variant="cta"
                                type="submit"
                                isDisabled={isPending && !isError}
                                isLoading={isPending && !isError}>
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
