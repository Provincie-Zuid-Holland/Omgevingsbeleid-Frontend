import { Button, Heading, Text } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import { usePublicationsGet } from '@/api/fetchers'
import { DocumentType } from '@/api/fetchers.schemas'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

import { LoaderSpinner } from '../Loader'
import Publication from './Publication'

interface PublicationsProps {
    type: DocumentType
}

const Publications = ({ type }: PublicationsProps) => {
    const { moduleId } = useParams()

    const { canCreatePublication } = usePermissions()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, isPending } = usePublicationsGet(
        { document_type: type, module_id: parseInt(moduleId!) },
        { query: { enabled: !!moduleId } }
    )

    return (
        <div className="space-y-4">
            <Heading level="2">{type}</Heading>

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
                    Er zijn nog geen {type.toLowerCase()} publicaties
                    aangemaakt.
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
