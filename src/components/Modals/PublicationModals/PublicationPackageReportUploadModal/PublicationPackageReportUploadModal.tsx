import {
    Badge,
    Button,
    File,
    formatBytes,
    formatDate,
    FormikFileUpload,
    Text,
} from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { useMemo } from 'react'

import {
    getPublicationActReportsGetQueryKey,
    getPublicationAnnouncementReportsGetQueryKey,
    usePublicationActReportsGet,
    usePublicationAnnouncementReportsGet,
} from '@/api/fetchers'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal'
import { useActions } from '@/components/Publications/PublicationPackages/components/actions'
import { getStatus } from '@/components/Publications/PublicationPackages/components/utils'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationPackageReportUploadModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationPackageReportUpload']
    ) as ModalStateMap['publicationPackageReportUpload']

    const { uploadReports } = useActions(modalState || {})

    const handleSubmit = (
        payload: { uploaded_files: File[] },
        helpers: FormikHelpers<{ uploaded_files: never[] }>
    ) => {
        uploadReports
            .mutateAsync({
                actPackageUuid: modalState.packageUUID,
                announcementPackageUuid: modalState.packageUUID,
                data: payload,
            })
            .then(() => {
                queryClient.invalidateQueries({
                    queryKey:
                        modalState.publicationType === 'act'
                            ? getPublicationActReportsGetQueryKey()
                            : getPublicationAnnouncementReportsGetQueryKey(),
                })
                helpers.resetForm()
            })
    }

    return (
        <Modal
            id="publicationPackageReportUpload"
            title="Upload rapporten"
            size="xl">
            <Formik
                initialValues={{
                    uploaded_files: [],
                }}
                onSubmit={handleSubmit}>
                {props => <InnerForm {...props} />}
            </Formik>
            <div className="mt-12 flex justify-end">
                <Button onPress={() => setActiveModal(null)}>Sluiten</Button>
            </div>
        </Modal>
    )
}

const InnerForm = <TData extends { uploaded_files: File[] }>({
    values,
    setFieldValue,
    isSubmitting,
}: FormikProps<TData>) => {
    const modalState = useModalStore(
        state => state.modalStates['publicationPackageReportUpload']
    ) as ModalStateMap['publicationPackageReportUpload']

    const { data: actReports } = usePublicationActReportsGet(
        {
            act_package_uuid: modalState.packageUUID,
        },
        {
            query: {
                enabled: modalState.publicationType === 'act',
            },
        }
    )

    const { data: announcementReports } = usePublicationAnnouncementReportsGet(
        {
            announcement_package_uuid: modalState.packageUUID,
        },
        {
            query: {
                enabled: modalState.publicationType === 'announcement',
            },
        }
    )

    const reports =
        modalState.publicationType === 'act' ? actReports : announcementReports

    const removeFile = (file: File) => () => {
        const newFiles = [...values.uploaded_files]
        newFiles.splice(newFiles.indexOf(file), 1)

        setFieldValue('uploaded_files', newFiles)
    }

    const count = useMemo(
        () => values.uploaded_files.length,
        [values.uploaded_files]
    )

    return (
        <Form>
            <FormikFileUpload
                name="uploaded_files"
                hideDescription
                hideIcon
                hideSelectedFiles
                className="py-24"
                accept={{ '*': [] }}
            />
            {!!values.uploaded_files.length && (
                <div className="mt-6 rounded border border-pzh-gray-300 p-4">
                    <Text bold color="text-pzh-blue-500 mb-2">
                        Geselecteerde bestanden
                    </Text>
                    <ul className="flex flex-col gap-2">
                        {values.uploaded_files.map((file, index) => (
                            <li
                                key={file.path || `file-${index}`}
                                className="pzh-form-input overflow-hidden border-pzh-gray-200">
                                <div className="flex items-center justify-between gap-2 px-4">
                                    <Text
                                        bold
                                        color="text-pzh-blue-500"
                                        className="truncate">
                                        {file.path}
                                    </Text>
                                    <div className="flex items-center">
                                        <Text
                                            as="span"
                                            size="s"
                                            color="text-pzh-gray-600"
                                            className="whitespace-nowrap">
                                            {formatBytes(file.size)}
                                        </Text>
                                        <Button
                                            variant="default"
                                            onPress={removeFile(file)}
                                            aria-label="Verwijderen">
                                            {!isSubmitting ? (
                                                <TrashCan
                                                    size={16}
                                                    className="-mt-[2px] ml-4 text-pzh-red-500"
                                                />
                                            ) : (
                                                <LoaderSpinner className="-mt-[2px] ml-4 text-pzh-blue-500" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <Button
                        type="submit"
                        variant="cta"
                        className="mt-4"
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}>
                        {count} {count > 1 ? 'Bestanden' : 'Bestand'} uploaden
                    </Button>
                </div>
            )}
            {!!reports?.results.length && (
                <div className="mt-6 rounded border border-pzh-gray-300 p-4">
                    <Text bold color="text-pzh-blue-500 mb-2">
                        Laatst geüploade rapporten
                    </Text>
                    <ul className="flex flex-col gap-2">
                        {reports.results.map(file => {
                            const status = getStatus(file.Report_Status)

                            return (
                                <li
                                    key={file.UUID}
                                    className="pzh-form-input overflow-hidden border-pzh-gray-200">
                                    <div className="flex items-center justify-between gap-2 px-4">
                                        <Text
                                            bold
                                            color="text-pzh-blue-500"
                                            className="truncate">
                                            {file.Filename}
                                        </Text>
                                        <div className="flex items-center gap-4">
                                            <Text
                                                as="span"
                                                size="s"
                                                color="text-pzh-gray-600"
                                                className="whitespace-nowrap">
                                                {formatDate(
                                                    new Date(
                                                        file.Created_Date + 'Z'
                                                    ),
                                                    "dd-MM-yyyy 'om' kk:mm"
                                                )}
                                            </Text>
                                            {status && (
                                                <Badge
                                                    className="-mt-1"
                                                    upperCase={false}
                                                    {...status}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}
        </Form>
    )
}

export default PublicationPackageReportUploadModal
