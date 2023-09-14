import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { Badge, Button, Divider, Heading, Text } from '@pzh-ui/components'

import { useUsersUserUuidGet, useUsersUserUuidPost } from '@/api/fetchers'
import { LoaderCard } from '@/components/Loader'
import ToggleSwitch from '@/components/ToggleSwitch'
import MutateLayout from '@/templates/MutateLayout'

const UserDetail = () => {
    const queryClient = useQueryClient()
    const { uuid } = useParams()

    const { data, isLoading, queryKey } = useUsersUserUuidGet(uuid!, {
        query: {
            enabled: !!uuid,
        },
    })

    const { mutate } = useUsersUserUuidPost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries(queryKey)
            },
        },
    })

    const handleUserStatus = (activate: boolean) => {
        mutate({ userUuid: uuid!, data: { ...data, IsActive: activate } })
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Gebruikers', path: '/muteer/gebruikers' },
        { name: data?.Gebruikersnaam || '', isCurrent: true },
    ]

    return (
        <MutateLayout title="Gebruiker" breadcrumbs={breadcrumbPaths}>
            <div className="col-span-4">
                <Heading level="2" size="m" className="mb-2">
                    Gebruiker
                </Heading>
                {isLoading && <LoaderCard height="56" className="w-auto" />}
                <Heading level="1" size="xxl">
                    {data?.Gebruikersnaam}
                </Heading>
            </div>
            <div className="col-span-2">
                <div className="flex items-center justify-between rounded border border-pzh-gray-200 px-6 py-4">
                    <Text bold className="-mb-1" color="text-pzh-blue">
                        Gebruiker status
                    </Text>
                    <div className="flex items-center gap-4">
                        <Badge
                            variant={data?.IsActive ? 'green' : 'red'}
                            text={data?.IsActive ? 'Actief' : 'Inactief'}
                            upperCase={false}
                        />
                        <ToggleSwitch
                            checked={data?.IsActive}
                            title={
                                data?.IsActive
                                    ? 'Gebruiker deactiveren'
                                    : 'Gebruiker activeren'
                            }
                            onClick={handleUserStatus}
                        />
                    </div>
                </div>
            </div>
            <div className="col-span-6">
                <Divider className="mb-10 mt-6" />
            </div>
            <div className="col-span-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <Heading level="2" size="m">
                        Gegevens gebruiker
                    </Heading>
                    <Button
                        variant="link"
                        className="text-pzh-green hover:text-pzh-green-dark">
                        Gegevens wijzigen
                    </Button>
                </div>

                <Item
                    label="Naam"
                    value={data?.Gebruikersnaam}
                    isLoading={isLoading}
                />
                <Item
                    label="E-mailadres"
                    value={data?.Email}
                    isLoading={isLoading}
                />
                <Item label="Rol" value={data?.Rol} isLoading={isLoading} />
            </div>
        </MutateLayout>
    )
}

const Item = ({
    label,
    value,
    isLoading,
}: {
    label: string
    value?: string
    isLoading: boolean
}) => (
    <div className="flex border-b border-pzh-gray-200 pb-2">
        <Text bold className="w-40">
            {label}
        </Text>
        {isLoading && <LoaderCard height="30" className="w-auto" />}
        <Text>{value}</Text>
    </div>
)

export default UserDetail
