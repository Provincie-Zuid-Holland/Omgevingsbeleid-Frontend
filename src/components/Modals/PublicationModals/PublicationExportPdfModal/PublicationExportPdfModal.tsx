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
            String(version?.publication.environment_id),
            {
                query: {
                    enabled: !!version?.publication.environment_id,
                },
            }
        )

    const versionTitle = buildVersionTitle(version, environment)

    const statusDate = useMemo(
        () =>
            version?.module_status.created_date
                ? formatDate(
                      parseUtc(version.module_status.created_date),
                      "dd-MM-yyyy 'om' HH:mm"
                  )
                : '',
        [version?.module_status.created_date]
    )

    const showNewerStatusWarning =
        !!version && !!lastStatus && version.module_status.id !== lastStatus.id

    const { mutate: exportPdf, isPending } =
        usePublicationVersionsPostCreateVersionPdf({
            mutation: {
                mutationFn: async ({
                    versionId: versionUuid,
                    data,
                }): Promise<any> =>
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
                    {module?.module.title}
                </Text>{' '}
                gebaseerd op modulestatus{' '}
                <Text as="span" bold>
                    {version?.module_status.status} ({statusDate})
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
                            versionId: String(modalState?.versionUUID),
                            data: { mutation_strategy: mutation },
                        })
                    }>
                    Exporteer
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default PublicationExportPdfModal
