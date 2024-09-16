import {
    Button,
    Divider,
    FormikDate,
    FormikInput,
    FormikRte,
} from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { isNull, isUndefined, mergeWith } from 'lodash'

import {
    usePublicationAnnouncementsAnnouncementUuidGet,
    usePublicationAnnouncementsAnnouncementUuidPost,
} from '@/api/fetchers'
import { PublicationAnnouncementEdit } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import { ModalStateMap } from '@/components/Modals/types'
import useModalStore from '@/store/modalStore'

const PublicationAnnouncementUpdateModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationAnnouncementUpdate']
    ) as ModalStateMap['publicationAnnouncementUpdate']

    const { data, isFetching, queryKey } =
        usePublicationAnnouncementsAnnouncementUuidGet(
            modalState?.announcementUuid,
            {
                query: {
                    enabled: !!modalState?.announcementUuid,
                },
            }
        )

    const { mutate, isError } = usePublicationAnnouncementsAnnouncementUuidPost(
        {
            mutation: {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries({ queryKey })
                        .finally(() => setActiveModal(null))
                },
            },
        }
    )

    const handleSubmit = (payload: PublicationAnnouncementEdit) => {
        mutate({
            announcementUuid: modalState?.announcementUuid,
            data: payload,
        })
    }

    const initialValues = {
        Content: {
            Texts: [
                {
                    Title: null,
                },
                {
                    Title: 'Planning',
                },
                {
                    Title: 'Reageren',
                },
                {
                    Title: 'Inzien',
                },
                {
                    Title: 'Sluiting',
                },
            ],
        },
    } as PublicationAnnouncementEdit

    const mergedValues = mergeWith(
        initialValues,
        data,
        (objValue, srcValue) => {
            if (isUndefined(objValue) || isNull(objValue)) {
                return srcValue
            }
        }
    )

    return (
        <Modal
            id="publicationAnnouncementUpdate"
            title="Kennisgeving"
            size="xl">
            {isFetching ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : (
                <Formik
                    initialValues={mergedValues}
                    enableReinitialize
                    onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="space-y-4">
                                <div>
                                    <FormikInput
                                        name="Metadata.Official_Title"
                                        label="Officiële titel van kennisgeving"
                                        placeholder="Officiële titel"
                                    />
                                </div>
                                <div>
                                    <FormikInput
                                        name="Content.Texts.0.Title"
                                        label="Titel van kennisgeving"
                                        placeholder="Titel"
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.0.Description"
                                        label="Tekst van kennisgeving"
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.1.Description"
                                        label="Planning"
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.2.Description"
                                        label="Reageren"
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.3.Description"
                                        label="Inzien"
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.4.Description"
                                        label="Sluiting"
                                    />
                                </div>
                                <div className="flex space-x-4 [&_>div]:flex-1">
                                    <div>
                                        <FormikDate
                                            name="Announcement_Date"
                                            label="Bekend op"
                                            placeholder="Kies een datum"
                                        />
                                    </div>
                                    <div>
                                        <FormikDate
                                            name="Procedural.Begin_Inspection_Period_Date"
                                            label="Begin inzage"
                                            placeholder="Kies een datum"
                                        />
                                    </div>
                                    <div>
                                        <FormikDate
                                            name="Procedural.End_Inspection_Period_Date"
                                            label="Eind inzage"
                                            placeholder="Kies een datum"
                                        />
                                    </div>
                                </div>
                            </div>
                            <Divider className="my-6" />
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="link"
                                    type="button"
                                    onPress={() => setActiveModal(null)}
                                    className="mr-3 text-pzh-blue-500">
                                    Annuleren
                                </Button>
                                <Button
                                    variant="cta"
                                    type="submit"
                                    isDisabled={isSubmitting && !isError}
                                    isLoading={isSubmitting && !isError}>
                                    Opslaan
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </Modal>
    )
}

export default PublicationAnnouncementUpdateModal
