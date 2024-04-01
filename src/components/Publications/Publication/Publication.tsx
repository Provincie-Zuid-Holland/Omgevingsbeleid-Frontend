import { Button, Heading } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'

import { usePublicationEnvironmentsGet } from '@/api/fetchers'
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

    const { data: environment } = usePublicationEnvironmentsGet(undefined, {
        query: {
            select: e =>
                e.results.find(
                    environment => environment.UUID === data.Environment_UUID
                ),
        },
    })

    return (
        <div className="rounded border border-pzh-gray-200 p-6">
            <div className="mb-4 flex items-center justify-between">
                <Heading size="m">
                    {data.Title || data.Document_Type} - {environment?.Title}{' '}
                    publicatie
                </Heading>
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
                    variant="secondary"
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
