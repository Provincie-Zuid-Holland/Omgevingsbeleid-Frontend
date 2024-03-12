import { Button, Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'

import { usePublicationsPublicationUuidVersionsGet } from '@/api/fetchers'
import { Publication as PublicationType } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

import PublicationVersions from '../PublicationVersions'

interface PublicationProps {
    data: PublicationType
}

const Publication = ({ data }: PublicationProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: latest } = usePublicationsPublicationUuidVersionsGet(
        data?.UUID || '',
        {
            limit: 10,
            offset: 0,
        },
        {
            query: {
                enabled: !!data?.UUID,
                select: data => data.results?.slice(-1)[0],
            },
        }
    )

    return (
        <div className="mb-6 rounded border border-pzh-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
                <Heading size="m">{data.Document_Type}</Heading>
                <Button
                    variant="link"
                    className="text-pzh-green"
                    size="small"
                    onPress={() =>
                        setActiveModal('publicationEdit', {
                            publication: data,
                        })
                    }>
                    Publicatie bewerken
                </Button>
            </div>

            {!!data && (
                <div className="mb-6">
                    <PublicationVersions publication={data} />
                </div>
            )}

            <div className="flex gap-2">
                <Button
                    icon={Plus}
                    size="small"
                    onPress={() =>
                        setActiveModal('publicationVersionAdd', {
                            publication: data,
                            prevUUID: latest?.UUID,
                        })
                    }>
                    Nieuwe versie aanmaken
                </Button>
                <Button variant="secondary" size="small">
                    Publicatie afbreken
                </Button>
            </div>
        </div>
    )
}

export default Publication
