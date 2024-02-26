import { useQueryClient } from '@tanstack/react-query'

import {
    getPublicationsPublicationUuidBillsGetQueryKey,
    usePublicationsPublicationUuidBillsBillUuidGet,
    usePublicationsPublicationUuidBillsPost,
} from '@/api/fetchers'
import { PublicationBillCreate } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import PublicationVersionForm from '@/components/Publications/PublicationVersionForm'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationVersionAddModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationVersionAdd']
    ) as ModalStateMap['publicationVersionAdd']

    const { data: prefill, isFetching } =
        usePublicationsPublicationUuidBillsBillUuidGet(
            modalState?.publication.UUID,
            modalState?.prevUUID || '',
            {
                query: {
                    enabled:
                        !!modalState?.publication.UUID &&
                        !!modalState?.prevUUID,
                },
            }
        )

    const { mutate } = usePublicationsPublicationUuidBillsPost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsPublicationUuidBillsGetQueryKey(
                        modalState.publication.UUID
                    ),
                })

                setActiveModal(null)
            },
        },
    })

    const handleFormSubmit = (payload: PublicationBillCreate) => {
        payload.Is_Official = (payload.Is_Official as unknown) === 'true'

        if (payload.Procedure_Data?.Announcement_Date) {
            payload.Announcement_Date = payload.Procedure_Data.Announcement_Date
        }

        mutate({ publicationUuid: modalState.publication.UUID, data: payload })
    }

    const initialValues = !!prefill
        ? {
              ...prefill,
              Is_Official: prefill.Is_Official ? 'true' : 'false',
          }
        : ({
              Bill_Data: {
                  Bill_Title: modalState?.publication?.Official_Title,
                  Regulation_Title: modalState?.publication?.Regulation_Title,
                  Amendment_Article: {
                      Label: 'Genomen besluit',
                      Number: '1',
                  },
                  Articles: [
                      {
                          Label: 'Wijzigingen',
                          Number: '2',
                      },
                  ],
                  Time_Article: {
                      Label: 'Inwerkingtreding',
                      Number: '3',
                  },
              },
              Procedure_Data: {
                  Steps: [
                      {
                          Step_Type: 'Vaststelling',
                      },
                      {
                          Step_Type: 'Ondertekening',
                      },
                  ],
              },
          } as PublicationBillCreate)

    return (
        <Modal id="publicationVersionAdd" title="Versie" size="xl">
            {isFetching ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : (
                <PublicationVersionForm
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues as PublicationBillCreate}
                    submitLabel="Versie maken"
                />
            )}
        </Modal>
    )
}

export default PublicationVersionAddModal
