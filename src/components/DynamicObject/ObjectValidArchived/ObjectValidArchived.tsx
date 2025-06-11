import { Divider, Heading, Text, formatDate } from '@pzh-ui/components'
import { Eye } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { LoaderSpinner } from '@/components/Loader'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'

interface ObjectValidArchivedProps {
    model: Model
}

const ObjectValidArchived = ({ model }: ObjectValidArchivedProps) => {
    const { data: object } = useObject()

    const { slugOverview, plural } = model.defaults
    const { useGetValidLineage } = model.fetchers

    const { data, isLoading } =
        useGetValidLineage?.(object?.Object_ID || 0, undefined, {
            query: { enabled: !!object?.Object_ID },
        }) || {}

    /** Filter out first object which is the valid one */
    const archivedObjects = useMemo(
        () =>
            (data?.results &&
                data?.results.length > 1 &&
                data?.results.filter(item => item.UUID !== object?.UUID)) ||
            [],
        [data, object]
    )

    return (
        <div>
            <Heading level="2" size="m" className="mb-2">
                Vigerend gearchiveerd
            </Heading>

            {isLoading ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : !!archivedObjects?.length ? (
                <div>
                    <div className="grid grid-cols-9 px-3 py-2">
                        <div className="col-span-5">
                            <Text bold color="text-pzh-blue-500">
                                Naam
                            </Text>
                        </div>
                        <div className="col-span-2">
                            <Text bold color="text-pzh-blue-500">
                                Van
                            </Text>
                        </div>
                        <div className="col-span-2">
                            <Text bold color="text-pzh-blue-500">
                                Tot
                            </Text>
                        </div>
                    </div>

                    <Divider className="mb-0" />

                    <div className="grid grid-cols-1 gap-y-2">
                        {archivedObjects?.map(object => (
                            <Link
                                key={object.UUID}
                                to={`/${slugOverview}/${plural}/${object.UUID}`}
                                target="_blank"
                                className="grid grid-cols-9 border-b border-pzh-gray-300 px-3 py-2 hover:bg-pzh-gray-100">
                                <div className="col-span-5">
                                    <Text bold color="text-pzh-blue-500">
                                        {object.Title}
                                    </Text>
                                </div>
                                <div className="col-span-2">
                                    <Text>
                                        {object.Start_Validity &&
                                            formatDate(
                                                new Date(object.Start_Validity),
                                                'dd-MM-yyyy'
                                            )}
                                    </Text>
                                </div>
                                <div className="col-span-2 flex items-center justify-between">
                                    <Text>
                                        {object.Next_Version &&
                                            formatDate(
                                                new Date(
                                                    object.Next_Version.Start_Validity
                                                ),
                                                'dd-MM-yyyy'
                                            )}
                                    </Text>
                                    <Eye
                                        className="text-pzh-green-500"
                                        size={20}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="italic">
                    Er zijn geen gearchiveerde versies van dit object.
                </p>
            )}
        </div>
    )
}

export default ObjectValidArchived
