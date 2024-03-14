import { Button, Pagination, Tooltip, formatDate } from '@pzh-ui/components'
import { FileWord } from '@pzh-ui/icons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import classNames from 'clsx'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
    usePublicationEnvironmentsGet,
    usePublicationsPublicationUuidVersionsGet,
} from '@/api/fetchers'
import { Publication, PublicationVersionShort } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
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
            <div className={classNames({ relative: isFetching })}>
                {isFetching && (
                    <div className="absolute left-0 top-0 flex h-full w-full animate-pulse items-center justify-center bg-pzh-gray-600/15">
                        <LoaderSpinner />
                    </div>
                )}
                <table className="w-full table-auto text-left text-s">
                    <thead className="h-8 border-b border-pzh-gray-400 font-bold text-pzh-blue-500">
                        <tr>
                            <th className="pl-2">Datum aangemaakt</th>
                            <th>Publicatieomgeving</th>
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
            </div>
            {!!data?.total && !!data?.limit && data.total > data.limit && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        onChange={setCurrPage}
                        forcePage={currPage - 1}
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
}: PublicationVersionShort & { publication: Publication }) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: environment } = usePublicationEnvironmentsGet(undefined, {
        query: {
            select: data =>
                data.results.find(
                    environment => environment.UUID === version.Environment_UUID
                ),
        },
    })

    const downloadDiff = async ({
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
            <td>{environment?.Title}</td>
            <td>{version.Module_Status.Status}</td>
            <td className="pr-2">
                <div className="flex items-center gap-4">
                    {!version.Is_Locked && (
                        <Button
                            variant="link"
                            size="small"
                            className="text-pzh-green-500"
                            onPress={() =>
                                setActiveModal('publicationVersionEdit', {
                                    publication,
                                    UUID: version.UUID,
                                })
                            }>
                            Bewerken
                        </Button>
                    )}
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
                    <Tooltip
                        label={
                            isFetching
                                ? 'De download wordt gegenereerd, dit kan even duren'
                                : 'Download Word export'
                        }>
                        <div className="ml-auto">
                            <Button
                                size="small"
                                variant="secondary"
                                icon={FileWord}
                                iconSize={16}
                                onPress={() => download()}
                                isLoading={isFetching}
                                // Disable Word export untill endpoint is fixed
                                isDisabled // ={isFetching}
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
