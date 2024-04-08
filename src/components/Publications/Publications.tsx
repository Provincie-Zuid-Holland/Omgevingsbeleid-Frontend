import { Button, Heading } from '@pzh-ui/components'
import { Minus, Plus } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import {
    usePublicationEnvironmentsGet,
    usePublicationsGet,
} from '@/api/fetchers'
import { DocumentType, ProcedureType } from '@/api/fetchers.schemas'

import { LoaderCard } from '../Loader'
import Publication from './Publication'
import PublicationEnvironmentAction from './PublicationEnvironmentAction'

const PROCEDURE_TYPE = {
    draft: 'Ontwerp',
    final: 'Definitief',
}

interface PublicationsProps {
    type: DocumentType
}

const Publications = ({ type }: PublicationsProps) => (
    <div className="space-y-4">
        <Heading level="2" className="capitalize">
            {type}
        </Heading>

        <div className="space-y-10">
            {Object.entries(ProcedureType).map(([key, value]) => (
                <PublicationCollection
                    key={key}
                    procedureType={value}
                    documentType={type}
                />
            ))}
        </div>
    </div>
)

interface PublicationCollection {
    procedureType: ProcedureType
    documentType: DocumentType
}

const PublicationCollection = ({
    procedureType,
    documentType,
}: PublicationCollection) => {
    const { moduleId } = useParams()

    const [isOpen, setIsOpen] = useState(false)

    const { data: environments, isFetching: environmentsFetching } =
        usePublicationEnvironmentsGet({
            is_active: true,
        })

    const { data, isFetching: publicationsFetching } = usePublicationsGet(
        { document_type: documentType, module_id: parseInt(moduleId!) },
        {
            query: {
                enabled: !!moduleId,
                select: data =>
                    data.results.filter(
                        publication =>
                            publication.Procedure_Type === procedureType
                    ),
            },
        }
    )

    return (
        <div className="space-y-4 rounded border border-pzh-gray-200 p-4">
            <div className="flex justify-between">
                <Heading size="m" level="2">
                    {PROCEDURE_TYPE[procedureType]}
                </Heading>
                <Button
                    icon={isOpen ? Minus : Plus}
                    iconSize={12}
                    variant="default"
                    onPress={() => setIsOpen(!isOpen)}
                    isDisabled={!!!data?.length}
                    aria-label={isOpen ? 'Toon meer' : 'Toon minder'}
                    className={classNames(
                        'flex h-5 w-5 items-center justify-center rounded border ring-offset-2 focus:ring focus:ring-pzh-focus [&_svg]:-mb-0.5',
                        {
                            'bg-pzh-blue-500 text-pzh-white':
                                !isOpen && !!data?.length,
                            'border-pzh-blue-500 bg-pzh-white text-pzh-blue-500':
                                isOpen && !!data?.length,
                            'border-pzh-gray-400 text-pzh-gray-400':
                                !!!data?.length,
                        }
                    )}
                />
            </div>

            {environmentsFetching || publicationsFetching ? (
                <LoaderCard />
            ) : !isOpen ? (
                <div className="flex justify-between gap-4">
                    {environments?.results.map(environment => (
                        <div key={environment.UUID} className="flex-1">
                            <PublicationEnvironmentAction
                                documentType={documentType}
                                procedureType={procedureType}
                                state={
                                    !!data?.find(
                                        publication =>
                                            publication.Environment_UUID ===
                                            environment.UUID
                                    )
                                        ? data?.find(
                                              publication =>
                                                  publication.Environment_UUID ===
                                                  environment.UUID
                                          )?.Is_Locked
                                            ? 'success'
                                            : 'pending'
                                        : undefined
                                }
                                {...environment}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {!!data?.length &&
                        data.map(publication => (
                            <Publication
                                key={publication.UUID}
                                data={publication}
                            />
                        ))}
                    {environments?.results
                        .filter(
                            environment =>
                                !data?.find(
                                    publication =>
                                        publication.Environment_UUID ===
                                        environment.UUID
                                )
                        )
                        .map(environment => (
                            <PublicationEnvironmentAction
                                key={environment.UUID}
                                documentType={documentType}
                                procedureType={procedureType}
                                {...environment}
                            />
                        ))}
                </>
            )}
        </div>
    )
}

export default Publications
