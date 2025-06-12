import {
    Button,
    Divider,
    FormikDate,
    FormikInput,
    FormikRte,
} from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { isNull, isUndefined, mergeWith } from 'lodash'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    usePublicationAnnouncementsAnnouncementUuidGet,
    usePublicationAnnouncementsAnnouncementUuidPost,
} from '@/api/fetchers'
import { PublicationAnnouncementEdit } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import { ModalStateMap } from '@/components/Modals/types'
import useModalStore from '@/store/modalStore'
import handleError from '@/utils/handleError'
import { ANNOUNCEMENT_EDIT_SCHEMA } from '@/validation/announcement'

const PublicationAnnouncementUpdateModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationAnnouncementUpdate']
    ) as ModalStateMap['publicationAnnouncementUpdate']

    const isLocked = modalState?.isLocked || false

    const { data, isFetching, queryKey } =
        usePublicationAnnouncementsAnnouncementUuidGet(
            modalState?.announcementUuid,
            {
                query: {
                    enabled: !!modalState?.announcementUuid,
                },
            }
        )

    const { mutateAsync, isError } =
        usePublicationAnnouncementsAnnouncementUuidPost({
            mutation: {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries({ queryKey })
                        .finally(() => setActiveModal(null))
                },
            },
        })

    const initialValues = {
        Content: {
            Texts: [
                {
                    Title: null,
                    Description: '',
                },
                {
                    Title: 'Planning',
                    Description: '',
                },
                {
                    Title: 'Reageren',
                    Description: '',
                },
                {
                    Title: 'Inzien',
                    Description: '',
                },
                {
                    Title: 'Sluiting',
                    Description: '',
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

    const handleSubmit = (
        payload: typeof mergedValues,
        helpers: FormikHelpers<typeof mergedValues>
    ) => {
        if (payload.Announcement_Date && payload.Procedural) {
            payload.Procedural.Procedural_Announcement_Date =
                payload.Announcement_Date
        }

        mutateAsync({
            announcementUuid: modalState?.announcementUuid,
            data: payload,
        }).catch(err => handleError<typeof payload>(err.response, helpers))
    }

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
                    validationSchema={toFormikValidationSchema(
                        ANNOUNCEMENT_EDIT_SCHEMA
                    )}
                    enableReinitialize
                    onSubmit={handleSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <FormikInput
                                        name="Metadata.Official_Title"
                                        label="Officiële titel van kennisgeving"
                                        placeholder="Officiële titel"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div>
                                    <FormikInput
                                        name="Content.Texts.0.Title"
                                        label="Titel van kennisgeving"
                                        placeholder="Titel"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.0.Description"
                                        label="Tekst van kennisgeving"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.1.Description"
                                        label="Planning"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.2.Description"
                                        label="Reageren"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.3.Description"
                                        label="Inzien"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="Content.Texts.4.Description"
                                        label="Sluiting"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 [&_>div]:flex-1">
                                    <div>
                                        <FormikDate
                                            name="Announcement_Date"
                                            label="Bekend op"
                                            placeholder="Kies een datum"
                                            disabled={isLocked}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <FormikDate
                                            name="Procedural.Begin_Inspection_Period_Date"
                                            label="Begin inzage"
                                            placeholder="Kies een datum"
                                            disabled={isLocked}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <FormikDate
                                            name="Procedural.End_Inspection_Period_Date"
                                            label="Eind inzage"
                                            placeholder="Kies een datum"
                                            disabled={isLocked}
                                            required
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
                                    className="text-pzh-blue-500 mr-3">
                                    Annuleren
                                </Button>
                                <Button
                                    variant="cta"
                                    type="submit"
                                    isDisabled={
                                        (isSubmitting && !isError) || isLocked
                                    }
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
