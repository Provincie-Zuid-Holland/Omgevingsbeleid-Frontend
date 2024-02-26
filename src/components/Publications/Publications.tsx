import { Button, Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import { usePublicationsGet } from '@/api/fetchers'
import { AppExtensionsPublicationsEnumsDocumentType } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

import { LoaderSpinner } from '../Loader'
import Publication from './Publication'

interface PublicationsProps {
    type: AppExtensionsPublicationsEnumsDocumentType
}

const Publications = ({ type }: PublicationsProps) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, isPending } = usePublicationsGet(
        { document_type: type, module_ID: parseInt(moduleId!) },
        { query: { enabled: !!moduleId } }
    )

    return (
        <div>
            <Heading level="2" className="mb-4">
                {type}
            </Heading>

            {isPending ? (
                <div>
                    <LoaderSpinner />
                </div>
            ) : (
                data?.results.map(publication => (
                    <Publication key={publication.UUID} data={publication} />
                ))
            )}

            <Button
                variant="secondary"
                icon={Plus}
                size="small"
                onPress={() => setActiveModal('publicationAdd', { type })}
                isDisabled={type === 'Omgevingsverordening'}>
                Nieuwe publicatie
            </Button>
        </div>
    )
}

export default Publications
