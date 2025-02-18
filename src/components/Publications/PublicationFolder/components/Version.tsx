import {
    Badge,
    BadgeProps,
    Button,
    formatDate,
    Heading,
    Text,
} from '@pzh-ui/components'
import { FilePdf, Notes, PenToSquare, TrashCan } from '@pzh-ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
    getPublicationsPublicationUuidVersionsGetQueryKey,
    usePublicationVersionsVersionUuidDelete,
    usePublicationVersionsVersionUuidPdfExportPost,
} from '@/api/fetchers'
import {
    Publication,
    PublicationEnvironment,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'

interface VersionProps extends PublicationVersionShort {
    environment?: PublicationEnvironment
    publication: Publication
}

const Version = ({
    UUID,
    Created_Date,
    Module_Status,
    Is_Locked,
    Act_Packages,
    Effective_Date,
    Status,
    environment,
    publication,
}: VersionProps) => {
    const queryClient = useQueryClient()

    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const date = useMemo(
        () => formatDate(new Date(Created_Date), 'd MMMM yyyy'),
        [Created_Date]
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
        const steps = publication.Procedure_Type === 'draft' ? '3' : '2'

        switch (Status) {
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
    }, [Status, publication])

    const handleDeleteVersion = usePublicationVersionsVersionUuidDelete({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsPublicationUuidVersionsGetQueryKey(
                        publication.UUID,
                        {
                            limit: 100,
                        }
                    ),
                })
            },
        },
    })

    return (
        <div className="flex h-16 border-b border-pzh-gray-200 last:border-b-0 hover:bg-pzh-blue-10 hover:ring-1 hover:ring-inset hover:ring-pzh-blue-100">
            <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-10 pr-6">
                <div className="flex h-[inherit] w-full border-l border-pzh-gray-200 pl-10">
                    <div className="flex w-full items-center justify-between border-l border-pzh-gray-200 pl-16">
                        <div className="flex items-center gap-4">
                            <Notes size={20} className="text-pzh-blue-100" />
                            <Heading
                                level="3"
                                size="s"
                                className="-mb-1 capitalize">
                                Versie
                            </Heading>
                        </div>
                        {environment?.Has_State && (
                            <Badge upperCase={false} {...status} />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex w-2/12 items-center pl-6 pr-2">
                <div>
                    <Text size="s" color="text-pzh-blue-500">
                        Datum aangemaakt
                    </Text>
                    <Text size="s" bold color="text-pzh-blue-500">
                        {date}
                    </Text>
                </div>
            </div>
            <div className="flex w-3/12 items-center px-2">
                <div>
                    <Text size="s" color="text-pzh-blue-500">
                        Gebaseerd op modulestatus
                    </Text>
                    <Text size="s" bold color="text-pzh-blue-500">
                        {Module_Status.Status}
                    </Text>
                </div>
            </div>
            <div className="flex w-2/12 items-center justify-end gap-2 px-6">
                <Button size="small" variant="cta" asChild>
                    <Link
                        to={`/muteer/modules/${moduleId}/besluiten/${UUID}/leveringen`}>
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
                            versionUuid: UUID,
                            data: { Mutation: 'renvooi' },
                        })
                    }
                    isLoading={isPending}
                    isDisabled={isPending || !Effective_Date}
                />
                <Button
                    size="small"
                    variant="secondary"
                    icon={PenToSquare}
                    iconSize={16}
                    aria-label="Wijzig publicatie"
                    isDisabled={Is_Locked}
                    onPress={() =>
                        setActiveModal('publicationVersionEdit', {
                            publication,
                            UUID,
                        })
                    }
                />
                {!!!Act_Packages.length && (
                    <Button
                        variant="default"
                        className="ml-2"
                        onPress={() =>
                            handleDeleteVersion.mutate({ versionUuid: UUID })
                        }>
                        <TrashCan className="text-pzh-red-500" size={16} />
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Version
