import { Badge, BadgeProps, Button, Heading, Text } from '@pzh-ui/components'
import { FilePdf, Gear, PencilLight, PenNib, PenToSquare } from '@pzh-ui/icons'

import {
    usePublicationsPublicationUuidVersionsGet,
    usePublicationVersionsVersionUuidPdfExportPost,
} from '@/api/fetchers'
import {
    DocumentType,
    ProcedureType,
    Publication,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'
import { LoaderCard, LoaderSpinner } from '@/components/Loader'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'
import { useMemo } from 'react'
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

    const Icon = config[documentType].icon

    const { data: version, isFetching } =
        usePublicationsPublicationUuidVersionsGet(
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

    const { mutate: download, isPending } =
        usePublicationVersionsVersionUuidPdfExportPost({
            mutation: {
                mutationFn: async ({ versionUuid, data }): Promise<any> =>
                    downloadFile(
                        `publication-versions/${versionUuid}/pdf_export`,
                        data
                    ),
            },
        })

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

    return (
        <div className="border-pzh-gray-200 hover:bg-pzh-blue-10 hover:ring-pzh-blue-100 flex h-16 border-b first:border-t last:border-b-0 hover:ring-1 hover:ring-inset">
            <div className="border-pzh-gray-200 flex h-[inherit] w-5/12 items-center border-r pr-6 pl-8">
                <div className="border-pzh-gray-200 flex h-[inherit] w-full items-center gap-4">
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

                {environment?.Has_State &&
                    (isFetching ? (
                        <LoaderCard height="24" className="w-20" mb="0" />
                    ) : (
                        <Badge upperCase={false} {...status} />
                    ))}
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
                            <Text size="s" bold color="text-pzh-blue-500">
                                {version?.Module_Status.Status}
                            </Text>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-2 px-6">
                        <Button size="small" variant="cta" asChild>
                            <Link
                                to={`/muteer/modules/${moduleId}/besluiten/${version.UUID}/leveringen`}>
                                Leveringen
                            </Link>
                        </Button>
                        <Button
                            size="small"
                            variant="secondary"
                            icon={FilePdf}
                            iconSize={16}
                            aria-label="Download PDF export"
                            onPress={() =>
                                download({
                                    versionUuid: version.UUID,
                                    data: { Mutation: 'renvooi' },
                                })
                            }
                            isLoading={isPending}
                            isDisabled={isPending || !version.Effective_Date}
                        />
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
