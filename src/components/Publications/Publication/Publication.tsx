import { Button, Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'

import { Publication as PublicationType } from '@/api/fetchers.schemas'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

import PublicationVersions from '../PublicationVersions'

interface PublicationProps {
    data: PublicationType
}

const Publication = ({ data }: PublicationProps) => {
    const { canEditPublication, canCreatePublicationVersion } = usePermissions()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <div className="mb-6 rounded border border-pzh-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
                <Heading size="m">{data.Title || data.Document_Type}</Heading>
                {canEditPublication && (
                    <Button
                        variant="link"
                        className="text-pzh-green-500"
                        size="small"
                        onPress={() =>
                            setActiveModal('publicationEdit', {
                                publication: data,
                            })
                        }>
                        Publicatie bewerken
                    </Button>
                )}
            </div>

            {!!data && (
                <div className="mb-6">
                    <PublicationVersions publication={data} />
                </div>
            )}

            {canCreatePublicationVersion && (
                <Button
                    icon={Plus}
                    size="small"
                    onPress={() =>
                        setActiveModal('publicationVersionAdd', {
                            publication: data,
                        })
                    }>
                    Nieuwe versie aanmaken
                </Button>
            )}
        </div>
    )
}

export default Publication
