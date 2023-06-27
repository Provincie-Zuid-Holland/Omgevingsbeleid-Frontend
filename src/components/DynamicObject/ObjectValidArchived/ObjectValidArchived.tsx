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

    const { slugOverview } = model.defaults
    const { useGetValidLineage } = model.fetchers

    const { data, isLoading } =
        useGetValidLineage?.(object?.Object_ID || 0, undefined, {
            query: { enabled: !!object?.Object_ID },
        }) || {}

    /** Filter out first object which is the valid one */
    const archivedObjects = useMemo(() => data?.slice(1), [data])

    return (
        <div>
            <Heading as="2" level="3" className="mb-2">
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
                            <Text type="body-bold">Naam</Text>
                        </div>
                        <div className="col-span-2">
                            <Text type="body-bold">Van</Text>
                        </div>
                        <div className="col-span-2">
                            <Text type="body-bold">Tot</Text>
                        </div>
                    </div>

                    <Divider className="mb-0" />

                    <div className="grid grid-cols-1 gap-y-2">
                        {archivedObjects?.map(object => (
                            <Link
                                key={object.UUID}
                                to={`/${slugOverview}/${object.UUID}`}
                                className="grid grid-cols-9 px-3 py-2 border-b border-pzh-gray-300 hover:bg-pzh-gray-100">
                                <div className="col-span-5">
                                    <Text>{object.Title}</Text>
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
                                        {object.End_Validity &&
                                            formatDate(
                                                new Date(object.End_Validity),
                                                'dd-MM-yyyy'
                                            )}
                                    </Text>
                                    <Eye className="text-pzh-green" />
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
