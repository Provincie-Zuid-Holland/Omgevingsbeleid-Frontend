import { Button, Tooltip } from '@pzh-ui/components'
import { FileWord } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
    useModulesModuleIdStatusGet,
    usePublicationsPublicationUuidBillsGet,
} from '@/api/fetchers'
import { Publication, PublicationBillShort } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'
import downloadFile from '@/utils/downloadFile'

interface PublicationVersionsProps {
    publication: Publication
}

const PublicationVersions = ({ publication }: PublicationVersionsProps) => {
    const { moduleId } = useParams()

    const { data } = usePublicationsPublicationUuidBillsGet(
        publication!.UUID,
        undefined,
        {
            query: {
                enabled: !!publication,
            },
        }
    )

    const { data: statusOptions } = useModulesModuleIdStatusGet(
        parseInt(moduleId!),
        {
            query: {
                enabled: !!moduleId,
                select: data =>
                    data.map(status => ({
                        label: status.Status,
                        value: status.ID,
                    })),
            },
        }
    )

    return (
        <table className="mb-6 w-full table-auto text-left text-s">
            <thead className="h-8 border-b border-pzh-gray-400 font-bold text-pzh-blue-500">
                <tr>
                    <th className="pl-2">#</th>
                    <th>Gebaseerd op Modulestatus</th>
                    <th>Type besluit</th>
                    <th>Doel</th>
                    <th className="pr-2">Actie</th>
                </tr>
            </thead>
            <tbody>
                {data?.results.map(bill => {
                    const status = statusOptions?.find(
                        option => option.value === bill.Module_Status_ID
                    )

                    return (
                        <VersionRow
                            key={bill.UUID}
                            publication={publication}
                            status={status?.label}
                            {...bill}
                        />
                    )
                })}
            </tbody>
        </table>
    )
}

const VersionRow = ({
    publication,
    status,
    ...bill
}: PublicationBillShort & { publication: Publication; status?: string }) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

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
        queryKey: ['downloadDiff', moduleId, bill.Module_Status_ID, bill.UUID],
        queryFn: () =>
            downloadDiff({ moduleId, Module_Status_ID: bill.Module_Status_ID }),
        enabled: false,
    })

    return (
        <tr className="h-14 odd:bg-pzh-gray-100">
            <td className="pl-2">{bill.Version_ID}</td>
            <td>{status}</td>
            <td>{bill.Procedure_Type}</td>
            <td>{bill.Is_Official ? 'Officiële' : 'Interne'} publicatie</td>
            <td className="pr-2">
                <div className="flex items-center gap-4">
                    {!bill.Locked && (
                        <Button
                            variant="link"
                            size="small"
                            className="text-pzh-green-500"
                            onPress={() =>
                                setActiveModal('publicationVersionEdit', {
                                    publication,
                                    UUID: bill.UUID,
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
                                bill,
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
