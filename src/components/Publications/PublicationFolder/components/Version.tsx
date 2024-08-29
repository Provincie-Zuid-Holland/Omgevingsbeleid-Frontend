import { Badge, Button, formatDate, Heading, Text } from '@pzh-ui/components'
import { FileWord, Notes } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { PublicationVersionShort } from '@/api/fetchers.schemas'
import { downloadFile } from '@/utils/file'

const Version = ({
    UUID,
    Created_Date,
    Module_Status,
}: PublicationVersionShort) => {
    const { moduleId } = useParams()

    const date = useMemo(
        () => formatDate(new Date(Created_Date), 'd MMMM yyyy'),
        [Created_Date]
    )

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
        queryKey: ['downloadDiff', moduleId, Module_Status.ID, UUID],
        queryFn: () =>
            downloadDiff({
                moduleId,
                Module_Status_ID: Module_Status.ID,
            }),
        enabled: false,
    })

    return (
        <div className="flex h-16 border-b border-pzh-gray-200 last:border-b-0 hover:bg-pzh-blue-10 hover:ring-1 hover:ring-inset hover:ring-pzh-blue-100">
            <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-10 pr-6">
                <div className="flex h-[inherit] w-full border-l border-pzh-gray-200 pl-10">
                    <div className="flex w-full items-center justify-between border-l border-pzh-gray-200 pl-[67px]">
                        <div className="flex items-center gap-4">
                            <Notes size={20} className="text-pzh-blue-100" />
                            <Heading
                                level="3"
                                size="s"
                                className="-mb-1 capitalize">
                                Versie
                            </Heading>
                        </div>
                        <Badge text="Actief" upperCase={false} />
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
            <div className="flex w-2/12 items-center justify-end gap-2 px-2">
                <Button size="small" variant="cta">
                    Leveringen
                </Button>
                <Button
                    size="small"
                    variant="secondary"
                    icon={FileWord}
                    iconSize={16}
                    aria-label="Download Word export"
                    onPress={() => download()}
                    isLoading={isFetching}
                    isDisabled={isFetching}
                />
            </div>
        </div>
    )
}

export default Version
