import {
    Badge,
    BadgeProps,
    Button,
    formatDate,
    Heading,
    Text,
    Tooltip,
} from '@pzh-ui/components'
import {
    FilePdf,
    Gear,
    PencilLight,
    PenNib,
    PenToSquare,
    TriangleExclamationSolid,
} from '@pzh-ui/icons'

import {
    usePublicationVersionsGetListVersions,
    usePublicationVersionsPostCreatePdf,
} from '@/api/fetchers'
import {
    DocumentType,
    ProcedureType,
    Publication,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'
import Dropdown, { DropdownItem } from '@/components/Dropdown'
import { LoaderCard, LoaderSpinner } from '@/components/Loader'
import { useModuleStatusData } from '@/hooks/useModuleStatusData'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'
import { parseUtc } from '@/utils/parseUtc'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const config = {
    omgevingsvisie: {
        label: 'Visie',
        icon: PencilLight,
    },
    programma: {
        label: 'Programma',
        icon: PenNib,
    },
}

interface DocumentProps {
    environment: PublicationEnvironment
    documentType: DocumentType
    procedureType: ProcedureType
    publication?: Publication
}

const Document = ({
    environment,
    documentType,
    procedureType,
    publication,
}: DocumentProps) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { lastStatus } = useModuleStatusData(moduleId)

    const [isDownloadOpen, setIsDownloadOpen] = useState(false)

    const Icon = config[documentType].icon

    const { data: version, isFetching } = usePublicationVersionsGetListVersions(
        publication?.UUID || '',
        {
            limit: 100,
        },
        {
            query: {
                enabled: !!publication?.UUID,
                select: data => data.results[0],
            },
        }
    )

    const { mutate: download, isPending } = usePublicationVersionsPostCreatePdf(
        {
            mutation: {
                mutationFn: async ({ versionUuid, data }): Promise<any> =>
                    downloadFile(
                        `publication-versions/${versionUuid}/pdf_export`,
                        data
                    ),
            },
        }
    )

    const isLastStatus = useMemo(
        () => version?.Module_Status.ID === lastStatus?.ID,
        [lastStatus, version?.Module_Status]
    )

    const statusCreatedDate = useMemo(
        () =>
            version &&
            formatDate(
                parseUtc(version.Module_Status.Created_Date),
                "dd-MM-yyyy 'om' HH:mm"
            ),
        [version?.Module_Status.Created_Date]
    )

    const status = useMemo((): BadgeProps => {
        const steps = publication?.Procedure_Type === 'draft' ? '3' : '2'

        switch (version?.Status) {
            case 'validation':
                return {
                    text: `1/${steps}: Validatie`,
                    solid: true,
                    variant: 'yellow',
                }
            case 'validation_failed':
                return {
                    text: 'Validatie gefaald',
                    variant: 'yellow',
                }
            case 'publication':
                return {
                    text: `2/${steps}: Publicatie`,
                    solid: true,
                    variant: 'yellow',
                }
            case 'publication_failed':
                return {
                    text: 'Publicatie gefaald',
                    variant: 'red',
                }
            case 'announcement':
                return {
                    text: '3/3: Kennisgeving',
                    solid: true,
                    variant: 'yellow',
                }
            case 'completed':
                return {
                    text: 'Afgerond',
                    solid: true,
                }
            default:
                return {
                    text: 'Actief',
                }
        }
    }, [version, publication])

    const dropdownItems: DropdownItem[] = [
        {
            text: 'PDF Renvooi',
            callback: () =>
                download({
                    versionUuid: String(version?.UUID),
                    data: { Mutation: 'renvooi' },
                }),
            className:
                'font-bold text-m hover:no-underline hover:text-pzh-green-500 hover:bg-inherit',
        },
        {
            text: 'PDF Initieel',
            callback: () =>
                download({
                    versionUuid: String(version?.UUID),
                    data: { Mutation: 'replace' },
                }),
            className:
                'font-bold text-m hover:no-underline hover:text-pzh-green-500 hover:bg-inherit border-t-0',
        },
    ]

    return (
        <div className="border-pzh-gray-200 flex h-16 border-b first:border-t last:border-b-0">
            <div className="border-pzh-gray-200 flex h-[inherit] w-5/12 items-center border-r pr-6 pl-8">
                <div className="border-pzh-gray-200 flex h-[inherit] items-center gap-4">
                    <Icon
                        size={24}
                        className="text-pzh-blue-100 group-data-[disabled]/procedure:text-pzh-gray-300"
                    />
                    <Heading
                        level="3"
                        size="m"
                        className="group-data-[disabled]/procedure:text-pzh-gray-300 capitalize">
                        {config[documentType].label}
                    </Heading>
                </div>

                {environment?.Has_State && !!version && (
                    <div className="ml-auto">
                        {isFetching ? (
                            <LoaderCard height="24" className="w-20" mb="0" />
                        ) : (
                            <Badge upperCase={false} {...status} />
                        )}
                    </div>
                )}
            </div>

            {isFetching ? (
                <LoaderSpinner className="ml-6 place-self-center" />
            ) : !!version && !!publication ? (
                <>
                    <div className="flex items-center pr-2 pl-6">
                        <div>
                            <Text size="s" color="text-pzh-blue-500">
                                Gebaseerd op modulestatus
                            </Text>
                            <div className="flex items-center">
                                <Text size="s" bold color="text-pzh-blue-500">
                                    {version?.Module_Status.Status} (
                                    {statusCreatedDate})
                                </Text>
                                {!isLastStatus && (
                                    <Tooltip
                                        label={
                                            <Text
                                                size="s"
                                                color="text-pzh-white">
                                                Deze levering is niet gebaseerd
                                                op de meest recente
                                                modulestatus.
                                            </Text>
                                        }>
                                        <TriangleExclamationSolid
                                            size={18}
                                            className="text-pzh-red-500 -mt-0.5 ml-2 cursor-help"
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-2 px-6">
                        <Button size="small" variant="cta" asChild>
                            <Link
                                to={`/muteer/modules/${moduleId}/besluiten/${version.UUID}/leveringen`}>
                                Leveringen
                            </Link>
                        </Button>
                        <div className="relative">
                            <Button
                                size="small"
                                variant="secondary"
                                icon={FilePdf}
                                iconSize={16}
                                aria-label="Download PDF export"
                                onPress={() =>
                                    setIsDownloadOpen(!isDownloadOpen)
                                }
                                isLoading={isPending}
                                isDisabled={
                                    isPending || !version.Effective_Date
                                }
                            />
                            <Dropdown
                                items={dropdownItems}
                                isOpen={isDownloadOpen}
                                setIsOpen={setIsDownloadOpen}
                                className="-right-1 mt-8"
                            />
                        </div>
                        <Button
                            size="small"
                            variant="secondary"
                            icon={PenToSquare}
                            iconSize={16}
                            aria-label="Wijzig publicatie versie"
                            isDisabled={version.Is_Locked}
                            onPress={() =>
                                setActiveModal('publicationVersionEdit', {
                                    publication,
                                    UUID: version.UUID,
                                })
                            }
                        />
                        <Button
                            size="small"
                            variant="secondary"
                            icon={Gear}
                            iconSize={16}
                            aria-label="Wijzig publicatie"
                            isDisabled={version.Is_Locked}
                            onPress={() =>
                                setActiveModal('publicationEdit', {
                                    publication,
                                })
                            }
                        />
                    </div>
                </>
            ) : (
                <div className="ml-auto flex items-center gap-2 px-6">
                    <Button
                        variant="secondary"
                        size="small"
                        onPress={() =>
                            setActiveModal('publicationAdd', {
                                documentType,
                                procedureType,
                                environmentUUID: environment.UUID,
                            })
                        }>
                        Voeg instrument toe
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Document
