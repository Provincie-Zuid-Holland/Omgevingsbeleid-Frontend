import { useObjectRelatedFilesDeleteObjectRelatedFilesDelete } from '@/api/fetchers'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import { Button, FormikCheckbox, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useParams } from 'react-router-dom'
import { ModalStateMap } from '../../types'

const ObjectRelatedFileDeleteModal = () => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()
    const lineageId = Number(objectId)

    const { queryKey } = useObject()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['objectRelatedFileDelete']
    ) as ModalStateMap['objectRelatedFileDelete']

    const { mutate, isPending, isError } =
        useObjectRelatedFilesDeleteObjectRelatedFilesDelete({
            mutation: {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey }).finally(() => {
                        toastNotification('objectRelatedFileDeleted')
                        setActiveModal(null)
                    })
                },
            },
        })

    return (
        <Modal
            id="objectRelatedFileDelete"
            title="Gerelateerd bestand ontkoppelen"
            description={
                <Text>
                    Weet je zeker dat je{' '}
                    <Text as="span" bold>
                        {modalState?.file?.Title}
                    </Text>{' '}
                    van dit doel wilt ontkoppelen en verwijderen? Je zal het
                    bestand opnieuw moeten uploaden om het opnieuw te
                    koppelen.
                </Text>
            }
            size="s">
            <Formik
                initialValues={{ consent: false }}
                onSubmit={() => {}}>
                {({ dirty }) => (
                    <Form>
                        <FormikCheckbox name="consent">
                            Ik weet zeker dat ik dit bestand wil ontkoppelen
                            en verwijderen
                        </FormikCheckbox>

                        <ModalFooter className="mt-4">
                            <Button
                                variant="link"
                                type="button"
                                onPress={() => setActiveModal(null)}
                                className="text-pzh-blue-500 mr-3">
                                Annuleren
                            </Button>
                            <Button
                                type="submit"
                                isDisabled={
                                    !dirty || (isPending && !isError)
                                }
                                isLoading={isPending && !isError}
                                onPress={() =>
                                    mutate({
                                        lineageId,
                                        params: {
                                            related_file_uuid:
                                                modalState?.file.UUID,
                                        },
                                    })
                                }>
                                Verwijderen
                            </Button>
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectRelatedFileDeleteModal
