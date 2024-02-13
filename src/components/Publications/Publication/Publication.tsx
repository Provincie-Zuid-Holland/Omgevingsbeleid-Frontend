import { Button, Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import {
    usePublicationsGet,
    usePublicationsPublicationUuidBillsGet,
} from '@/api/fetchers'
import { AppExtensionsPublicationsEnumsDocumentType } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import useModalStore from '@/store/modalStore'

import PublicationVersions from '../PublicationVersions'

interface PublicationProps {
    type: AppExtensionsPublicationsEnumsDocumentType
}

const Publication = ({ type }: PublicationProps) => {
    const { moduleId } = useParams()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: publication, isPending } = usePublicationsGet(
        { document_type: type, module_ID: parseInt(moduleId!) },
        { query: { enabled: !!moduleId, select: data => data.results?.[0] } }
    )

    const { data: latest } = usePublicationsPublicationUuidBillsGet(
        publication?.UUID || '',
        undefined,
        {
            query: {
                enabled: !!publication?.UUID,
                select: data => data.results?.slice(-1)[0],
            },
        }
    )

    return (
        <div>
            <Heading level="2" className="mb-4">
                {type}
            </Heading>

            {isPending ? (
                <LoaderSpinner />
            ) : (
                <>
                    {!!publication && (
                        <PublicationVersions publication={publication} />
                    )}

                    {!!!publication ? (
                        <Button
                            icon={Plus}
                            size="small"
                            onPress={() =>
                                setActiveModal('publicationAdd', { type })
                            }
                            isDisabled={type === 'Omgevingsverordening'}>
                            Nieuwe publicatie
                        </Button>
                    ) : (
                        <Button
                            icon={Plus}
                            size="small"
                            onPress={() =>
                                setActiveModal('publicationVersionAdd', {
                                    publication,
                                    prevUUID: latest?.UUID,
                                })
                            }>
                            Nieuwe versie aanmaken
                        </Button>
                    )}
                </>
            )}
        </div>
    )
}

export default Publication
