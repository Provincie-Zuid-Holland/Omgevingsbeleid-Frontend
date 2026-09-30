import { Button, formatDate, Text, Tooltip } from '@pzh-ui/components'
import { FilePdf, ListCheck, TriangleExclamationSolid } from '@pzh-ui/icons'

import { ModuleStatus, PublicationShort } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'
import { parseUtc } from '@/utils/parseUtc'

interface RegelingActionsProps {
    publication: PublicationShort
    versionUUID: string
    procedureLabel: string
    moduleStatus: ModuleStatus
    isPublished: boolean
    requiredFieldsFilled: boolean
    isLastStatus: boolean
    isClosed?: boolean
    isLocked?: boolean
}

const RegelingActions = ({
    publication,
    versionUUID,
    procedureLabel,
    moduleStatus,
    isPublished,
    requiredFieldsFilled,
    isLastStatus,
    isClosed,
    isLocked,
}: RegelingActionsProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const readOnly = isPublished || isClosed || isLocked

    const moduleStatusLabel = `${moduleStatus.Status} (${formatDate(
        parseUtc(moduleStatus.Created_Date),
        "dd-MM-yyyy 'om' HH:mm"
    )})`

    return (
        <>
            {!isLastStatus && (
                <Tooltip
                    label={
                        <Text size="s" color="text-pzh-white">
                            Regeling {procedureLabel.toLowerCase()} is gebaseerd
                            op {moduleStatusLabel}. Er is een nieuwere versie
                            beschikbaar.
                        </Text>
                    }>
                    <TriangleExclamationSolid
                        size={18}
                        className="mr-1 cursor-help text-pzh-red-500"
                    />
                </Tooltip>
            )}

            <Button
                size="small"
                variant={readOnly ? 'secondary' : 'primary'}
                onPress={() =>
                    setActiveModal('publicationVersionEdit', {
                        publication,
                        UUID: versionUUID,
                        readOnly,
                    })
                }>
                {readOnly ? 'Bekijk besluit' : 'Bewerk besluit'}
            </Button>

            {requiredFieldsFilled && (
                <Button
                    size="small"
                    variant="secondary"
                    icon={FilePdf}
                    iconSize={16}
                    onPress={() =>
                        setActiveModal('publicationExportPdf', {
                            versionUUID,
                        })
                    }>
                    Export PDF
                </Button>
            )}

            <Button
                size="small"
                variant="secondary"
                icon={ListCheck}
                iconSize={16}
                aria-label="Publicatie-validator"
                onPress={() =>
                    setActiveModal('publicationScan', { versionUUID })
                }
            />
        </>
    )
}

export default RegelingActions
