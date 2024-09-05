import {
    Button,
    Pagination,
    Text,
    Tooltip,
    formatDate,
} from '@pzh-ui/components'
import { FileWord } from '@pzh-ui/icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { usePublicationsPublicationUuidVersionsGet } from '@/api/fetchers'
import { Publication, PublicationVersionShort } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'

const PAGE_LIMIT = 10

interface PublicationVersionsProps {
    publication: Publication
}

const PublicationVersions = ({ publication }: PublicationVersionsProps) => {
    const [currPage, setCurrPage] = useState(1)

    const { data, isFetching } = usePublicationsPublicationUuidVersionsGet(
        publication!.UUID,
        {
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
        },
        {
            query: {
                enabled: !!publication,
                placeholderData: keepPreviousData,
            },
        }
    )

    return (
        <>
            <div>
                {isFetching ? (
                    <LoaderCard />
                ) : !!data?.results.length ? (
                    <table className="w-full table-auto text-left text-s">
                        <thead className="h-8 border-b border-pzh-gray-400 font-bold text-pzh-blue-500">
                            <tr>
                                <th className="pl-2">Datum aangemaakt</th>
                                <th>Gebaseerd op Modulestatus</th>
                                <th className="pr-2">Actie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.results.map(version => (
                                <VersionRow
                                    key={version.UUID}
                                    publication={publication}
                                    {...version}
                                />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <Text className="italic text-pzh-gray-600">
                        Er is nog geen versie aangemaakt
                    </Text>
                )}
            </div>
            {!!data?.total && !!data?.limit && data.total > data.limit && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        onPageChange={setCurrPage}
                        current={currPage}
                        total={data?.total}
                        limit={data?.limit}
                    />
                </div>
            )}
        </>
    )
}

const VersionRow = ({
    publication,
    ...version
}: PublicationVersionShort & {
    publication: Publication
}) => {
    const { moduleId } = useParams()

    const { canEditPublicationVersion, canViewPublicationPackage } =
        usePermissions()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const downloadDiff = ({
        moduleId,
        Module_Status_ID,
    }: {
        moduleId?: string
        Module_Status_ID: number
    }) =>
        downloadFile(
            `modules/${moduleId}/diff?output_format=doc&status_id=${Module_Status_ID}`
        )

    const { isFetching, refetch: download } = useQuery({
        queryKey: [
            'downloadDiff',
            moduleId,
            version.Module_Status.ID,
            version.UUID,
        ],
        queryFn: () =>
            downloadDiff({
                moduleId,
                Module_Status_ID: version.Module_Status.ID,
            }),
        enabled: false,
    })

    const date = useMemo(
        () => formatDate(new Date(version.Created_Date), 'dd-MM-yyyy'),
        [version.Created_Date]
    )

    return (
        <tr className="h-14 odd:bg-pzh-gray-100">
            <td className="pl-2">{date}</td>
            <td>{version.Module_Status.Status}</td>
            <td className="pr-2">
                <div className="flex items-center gap-4">
                    {!version.Is_Locked && canEditPublicationVersion && (
                        <Button
                            variant="link"
                            size="small"
                            className="text-pzh-green-500">
                            Bewerken
                        </Button>
                    )}
                    {canViewPublicationPackage && (
                        <Button
                            variant="link"
                            size="small"
                            className="text-pzh-green-500"
                            onPress={() =>
                                setActiveModal('publicationPackages', {
                                    publication,
                                    version,
                                })
                            }>
                            Leveringen
                        </Button>
                    )}
                    <Tooltip
                        label={
                            isFetching
                                ? 'De download wordt gegenereerd, dit kan even duren'
                                : 'Download Word export'
                        }>
                        <div className="ml-auto">
                            <Button
                                size="small"
                                icon={FileWord}
                                iconSize={16}
                                onPress={() => download()}
                                isLoading={isFetching}
                                isDisabled={isFetching}
                                aria-label="Download Word export"
                            />
                        </div>
                    </Tooltip>
                </div>
            </td>
        </tr>
    )
}

export default PublicationVersions
