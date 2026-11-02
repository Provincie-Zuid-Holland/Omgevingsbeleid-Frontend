import { useMemo } from 'react'

import { Divider, formatDate, Heading, Text } from '@pzh-ui/components'
import { Eye } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import { LoaderSpinner } from '@/components/Loader'
import { Model, ModelReturnTypeBasicUnion } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import { parseUtc } from '@/utils/parseUtc'

interface ObjectValidArchivedProps {
    model: Model
}

const ObjectValidArchived = ({ model }: ObjectValidArchivedProps) => {
    const { data: object } = useObject()

    const { slugOverview, plural } = model.defaults
    const { useGetValidLineage } = model.fetchers

    const { data, isLoading } =
        (useGetValidLineage?.(object?.object_id || 0, undefined, {
            query: { enabled: !!object?.object_id },
        }) as {
            data?: {
                results?: ModelReturnTypeBasicUnion[]
            }
            isLoading: boolean
        }) || {}

    /** Filter out first object which is the valid one */
    const archivedObjects = useMemo(
        () =>
            (data?.results &&
                data?.results.length > 1 &&
                data?.results.filter(item => item.id !== object?.id)) ||
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
                    <div className="grid grid-cols-9 p-2">
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
                                key={object.id}
                                to={`/${slugOverview}/${plural}/${object.id}`}
                                target="_blank"
                                className="grid grid-cols-9 border-b border-pzh-gray-300 p-2 hover:bg-pzh-gray-100">
                                <div className="col-span-5">
                                    <Text bold color="text-pzh-blue-500">
                                        {object.title}
                                    </Text>
                                </div>
                                <div className="col-span-2">
                                    <Text>
                                        {'start_validity' in object &&
                                            object.start_validity &&
                                            formatDate(
                                                parseUtc(object.start_validity),
                                                'dd-MM-yyyy'
                                            )}
                                    </Text>
                                </div>
                                <div className="col-span-2 flex items-center justify-between">
                                    <Text>
                                        {'next_version' in object &&
                                        object.next_version
                                            ? formatDate(
                                                  parseUtc(
                                                      (
                                                          object.next_version as {
                                                              start_validity: string
                                                          }
                                                      ).start_validity
                                                  ),
                                                  'dd-MM-yyyy'
                                              )
                                            : null}
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
