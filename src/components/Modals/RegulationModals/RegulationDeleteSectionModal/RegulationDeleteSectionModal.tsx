import { Button, FormikCheckbox, Text } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useShallow } from 'zustand/react/shallow'

import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import * as sections from '@/config/regulations/sections'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'

const RegulationDeleteSectionModal = () => {
    const { itemAction, deleteItem } = useRegulationStore(
        useShallow(state => ({
            itemAction: state.itemAction,
            deleteItem: state.deleteItem,
        }))
    )
    const setActiveModal = useModalStore(state => state.setActiveModal)

    if (
        !itemAction?.uuid ||
        !itemAction?.type ||
        itemAction?.action !== 'delete'
    )
        return null

    const section = sections[itemAction.type]
    const { singular, singularCapitalize } = section.defaults

    const handleFormSubmit = () => {
        if (!itemAction.uuid) return

        deleteItem(itemAction.uuid)
        setActiveModal(null)
    }

    return (
        <Modal
            id="regulationDelete"
            title={`${singularCapitalize} ${itemAction.index} verwijderen`}>
            <Text className="mb-3">
                Je staat op het punt om {singular} {itemAction.index} met alle
                eventuele inhoud te verwijderen. Deze actie kan niet ongedaan
                gemaakt worden.
            </Text>

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{ consent: false }}
                enableReinitialize>
                {({ dirty, isSubmitting }) => (
                    <Form>
                        <FormikCheckbox name="consent">
                            Ik weet zeker dat ik {singular} {itemAction.index}{' '}
                            wil verwijderen
                        </FormikCheckbox>

                        <ModalFooter className="mt-4">
                            <Button
                                variant="link"
                                onPress={() => setActiveModal(null)}>
                                Annuleren
                            </Button>
                            <Button
                                type="submit"
                                variant="cta"
                                isDisabled={!dirty || isSubmitting}
                                isLoading={isSubmitting}>
                                Verwijderen
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default RegulationDeleteSectionModal
