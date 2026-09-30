import { useMemo, useState } from 'react'

import {
    Button,
    FieldRadioGroup,
    formatDate,
    Notification,
    Text,
} from '@pzh-ui/components'

import { useParams } from 'react-router-dom'

import {
    usePublicationEnvironmentsGetDetailEnvironment,
    usePublicationVersionsGetDetailVersion,
    usePublicationVersionsPostCreateVersionPdf,
} from '@/api/fetchers'
import { MutationStrategy } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import useModule from '@/hooks/useModule'
import { useModuleStatusData } from '@/hooks/useModuleStatusData'
import { buildVersionTitle } from '@/pages/protected/Packages/config'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'
import { parseUtc } from '@/utils/parseUtc'

import { ModalStateMap } from '../../types'

const PublicationExportPdfModal = () => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationExportPdf']
    ) as ModalStateMap['publicationExportPdf']

    const [mutation, setMutation] = useState<MutationStrategy>(
        MutationStrategy.renvooi
    )

    const { data: module } = useModule()
    const { lastStatus } = useModuleStatusData(moduleId)

    const { data: version } = usePublicationVersionsGetDetailVersion(
        String(modalState?.versionUUID),
        {
            query: {
                enabled: !!modalState?.versionUUID,
            },
        }
    )

    const { data: environment } =
        usePublicationEnvironmentsGetDetailEnvironment(
            String(version?.Publication.Environment_UUID),
            {
                query: {
                    enabled: !!version?.Publication.Environment_UUID,
                },
            }
        )

    const versionTitle = buildVersionTitle(version, environment)

    const statusDate = useMemo(
        () =>
            version?.Module_Status.Created_Date
                ? formatDate(
                      parseUtc(version.Module_Status.Created_Date),
                      "dd-MM-yyyy 'om' HH:mm"
                  )
                : '',
        [version?.Module_Status.Created_Date]
    )

    const showNewerStatusWarning =
        !!version && !!lastStatus && version.Module_Status.ID !== lastStatus.ID

    const { mutate: exportPdf, isPending } =
        usePublicationVersionsPostCreateVersionPdf({
            mutation: {
                mutationFn: async ({ versionUuid, data }): Promise<any> =>
                    downloadFile(
                        `/publication-versions/${versionUuid}/pdf_export`,
                        data
                    ),
                onSuccess: () => setActiveModal(null),
            },
        })

    return (
        <Modal id="publicationExportPdf" title="Exporteer PDF">
            <Text>
                Je staat op het punt een pdf te exporteren van de regeling:{' '}
                <Text as="span" bold>
                    {versionTitle}
                </Text>{' '}
                van module{' '}
                <Text as="span" bold>
                    {module?.Module.Title}
                </Text>{' '}
                gebaseerd op modulestatus{' '}
                <Text as="span" bold>
                    {version?.Module_Status.Status} ({statusDate})
                </Text>
            </Text>

            {showNewerStatusWarning && (
                <Notification
                    variant="info"
                    title="Nieuwere modulestatus beschikbaar">
                    De huidige modulestatus van het besluit is niet de meest
                    recente modulestatus die beschikbaar is.
                </Notification>
            )}

            <FieldRadioGroup
                name="pdf-mutation"
                label="Type export"
                value={mutation}
                onChange={e => setMutation(e.target.value as MutationStrategy)}
                optionLayout="horizontal"
                options={[
                    {
                        label: 'Renvooi (was-wordt)',
                        value: MutationStrategy.renvooi,
                    },
                    {
                        label: 'Volledige weergave (nieuwe situatie)',
                        value: MutationStrategy.replace,
                    },
                ]}
            />

            <ModalFooter>
                <Button
                    variant="link"
                    type="button"
                    onPress={() => setActiveModal(null)}
                    className="text-pzh-blue-500">
                    Annuleren
                </Button>
                <Button
                    type="submit"
                    isLoading={isPending}
                    isDisabled={isPending}
                    onPress={() =>
                        exportPdf({
                            versionUuid: String(modalState?.versionUUID),
                            data: { Mutation: mutation },
                        })
                    }>
                    Exporteer
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default PublicationExportPdfModal
