import { Button, Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { usePublicationsGet } from '@/api/fetchers'
import { DocumentType } from '@/api/fetchers.schemas'
import ModuleVersionTable from '@/components/Modules/ModuleVersionTable'
import useModalStore from '@/store/modalStore'

interface PublicationProps {
    type: DocumentType
}

const Publication = ({ type }: PublicationProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data } = usePublicationsGet({ document_type: type })

    const isEmpty = useMemo(() => !data?.results.length, [data])

    return (
        <div>
            <Heading level="2" className="mb-4">
                {type}
            </Heading>

            {!isEmpty && (
                <ModuleVersionTable
                    versions={[
                        {
                            version: 1,
                            status: 'Ontwerp GS',
                            type: 'Ontwerp',
                            purpose: 'Interne publicatie',
                            uploadDate: '03-01-2024',
                        },
                        {
                            version: 2,
                            status: 'Ontwerp GS',
                            type: 'Ontwerp',
                            purpose: 'Officiële publicatie',
                        },
                    ]}
                />
            )}

            {isEmpty ? (
                <Button
                    icon={Plus}
                    size="small"
                    onPress={() => setActiveModal('moduleDecision')}
                    isDisabled={type === 'Omgevingsverordening'}>
                    Nieuwe publicatie
                </Button>
            ) : (
                <Button
                    icon={Plus}
                    size="small"
                    onPress={() => setActiveModal('moduleDecision')}>
                    Nieuwe versie aanmaken
                </Button>
            )}
        </div>
    )
}

export default Publication
