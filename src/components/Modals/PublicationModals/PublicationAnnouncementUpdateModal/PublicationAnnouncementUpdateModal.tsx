import {
    Button,
    FormikDate,
    FormikInput,
    FormikRte,
    Text,
} from '@pzh-ui/components'

import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Form, Formik, FormikHelpers } from 'formik'
import { isNull, isUndefined, mergeWith } from 'lodash'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    usePublicationAnnouncementsGetDetailAnnouncement,
    usePublicationAnnouncementsPostEditAnnouncement,
} from '@/api/fetchers'
import {
    HTTPValidationError,
    PublicationAnnouncementEdit,
} from '@/api/fetchers.schemas'
import FieldArray from '@/components/Form/FieldArray'
import { LoaderSpinner } from '@/components/Loader'
import Modal, { ModalFooter } from '@/components/Modal/Modal'
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

    const isLocked = modalState?.isLocked || modalState?.readOnly || false

    const { data, isFetching, queryKey } =
        usePublicationAnnouncementsGetDetailAnnouncement(
            modalState?.announcementId,
            {
                query: {
                    enabled: !!modalState?.announcementId,
                },
            }
        )

    const { mutateAsync, isError } =
        usePublicationAnnouncementsPostEditAnnouncement({
            mutation: {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries({ queryKey })
                        .finally(() => setActiveModal(null))
                },
            },
        })

    const initialValues = {} as PublicationAnnouncementEdit

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
        if (payload.announcement_date && payload.procedural) {
            payload.procedural.procedural_announcement_date =
                payload.announcement_date
        }

        mutateAsync({
            announcementId: modalState?.announcementId,
            data: payload,
        }).catch(
            (err: AxiosError<HTTPValidationError>) =>
                err.response &&
                handleError<typeof payload>(err.response, helpers)
        )
    }

    return (
        <Modal id="publicationAnnouncementUpdate" title="Kennisgeving">
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
                                        name="meta_data.official_title"
                                        label="Officiële titel van kennisgeving"
                                        placeholder="Officiële titel"
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div>
                                    <FormikInput
                                        name="content.texts.0.title"
                                        label="Titel van kennisgeving"
                                        placeholder="Titel"
                                        disabled={isLocked}
                                    />
                                </div>
                                <div>
                                    <FormikRte
                                        name="content.texts.0.description"
                                        label="Tekst van kennisgeving"
                                        customMenuOptions={['link']}
                                        disabled={isLocked}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-4 bg-pzh-gray-100 p-4">
                                    <Text>Tekstblokken</Text>

                                    <FieldArray
                                        name="content.texts"
                                        label=""
                                        arrayLabel="Tekstblok"
                                        buttonLabel="Tekstblok toevoegen"
                                        buttonOptions={{
                                            variant: 'secondary',
                                            size: 'small',
                                        }}
                                        itemClassName="py-4 px-0 first:pt-0 first:border-t-0 border-t border-pzh-gray-600 gap-4"
                                        startIndex={1}
                                        fields={[
                                            {
                                                type: 'text',
                                                name: 'title',
                                                label: 'Titel',
                                                disabled: isLocked,
                                                placeholder:
                                                    'Voer hier een titel in, bijvoorbeeld: Planning',
                                            },
                                            {
                                                type: 'wysiwyg',
                                                name: 'description',
                                                label: 'Inhoud van tekstblok',
                                                disabled: isLocked,
                                                required: true,
                                                customMenuOptions: ['link'],
                                                menuClassName: 'top-0',
                                            },
                                        ]}
                                        disabled={isLocked}
                                    />
                                </div>
                                <div className="flex gap-4 [&_>div]:flex-1">
                                    <div>
                                        <FormikDate
                                            name="announcement_date"
                                            label="Bekend op"
                                            placeholder="Kies een datum"
                                            disabled={isLocked}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <FormikDate
                                            name="procedural.begin_inspection_period_date"
                                            label="Begin inzage"
                                            placeholder="Kies een datum"
                                            disabled={isLocked}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <FormikDate
                                            name="procedural.end_inspection_period_date"
                                            label="Eind inzage"
                                            placeholder="Kies een datum"
                                            disabled={isLocked}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <ModalFooter className="mt-4">
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
                                    isDisabled={
                                        (isSubmitting && !isError) || isLocked
                                    }
                                    isLoading={isSubmitting && !isError}>
                                    Opslaan
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            )}
        </Modal>
    )
}

export default PublicationAnnouncementUpdateModal
