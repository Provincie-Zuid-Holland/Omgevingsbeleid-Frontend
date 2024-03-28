import { Button, Heading, Text } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import {
    usePublicationEnvironmentsGet,
    usePublicationsGet,
} from '@/api/fetchers'
import { DocumentType, ProcedureType } from '@/api/fetchers.schemas'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

import { LoaderSpinner } from '../Loader'
import Publication from './Publication'
import PublicationEnvironmentAction from './PublicationEnvironmentAction'

const PROCEDURE_TYPE = {
    draft: 'Ontwerp',
    final: 'Definitief',
}

interface PublicationsProps {
    type: DocumentType
}

const Publications = ({ type }: PublicationsProps) => {
    const { moduleId } = useParams()

    const { canCreatePublication } = usePermissions()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: environments } = usePublicationEnvironmentsGet({
        is_active: true,
    })

    const { data, isPending } = usePublicationsGet(
        { document_type: type, module_id: parseInt(moduleId!) },
        { query: { enabled: !!moduleId } }
    )

    return (
        <div className="space-y-4">
            <Heading level="2" className="capitalize">
                {type}
            </Heading>

            <div className="space-y-10">
                {Object.entries(ProcedureType).map(([key, value]) => (
                    <div
                        key={key}
                        className="rounded border border-pzh-gray-200 p-4">
                        <div className="flex justify-between">
                            <Heading size="m" className="mb-4">
                                {PROCEDURE_TYPE[value]}
                            </Heading>
                            <Button
                                icon={Plus}
                                iconSize={12}
                                variant="default"
                                className="flex h-5 w-5 items-center justify-center rounded bg-pzh-blue-500 text-pzh-white [&_svg]:-mb-0.5"
                            />
                        </div>

                        <div className="flex justify-between gap-4">
                            {environments?.results.map(environment => (
                                <div key={environment.UUID} className="flex-1">
                                    <PublicationEnvironmentAction
                                        type={type}
                                        {...environment}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {isPending ? (
                <div>
                    <LoaderSpinner />
                </div>
            ) : !!data?.results.length ? (
                data.results.map(publication => (
                    <Publication key={publication.UUID} data={publication} />
                ))
            ) : (
                <Text color="text-pzh-gray-600" className="italic">
                    Er zijn nog geen {type} publicaties aangemaakt.
                </Text>
            )}

            {canCreatePublication && (
                <Button
                    variant="secondary"
                    icon={Plus}
                    size="small"
                    onPress={() => setActiveModal('publicationAdd', { type })}>
                    Nieuwe publicatie
                </Button>
            )}
        </div>
    )
}

export default Publications
