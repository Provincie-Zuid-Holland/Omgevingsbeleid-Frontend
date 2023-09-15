import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { Badge, Button, Divider, Heading, Text } from '@pzh-ui/components'
import { Key } from '@pzh-ui/icons'

import { useUsersUserUuidGet, useUsersUserUuidPost } from '@/api/fetchers'
import { LoaderCard } from '@/components/Loader'
import UserEditModal from '@/components/Modals/UserModals/UserEditModal'
import UserGeneratePasswordModal from '@/components/Modals/UserModals/UserGeneratePasswordModal'
import ToggleSwitch from '@/components/ToggleSwitch'
import useModalStore from '@/store/modalStore'
import MutateLayout from '@/templates/MutateLayout'
import { toastNotification } from '@/utils/toastNotification'

const UserDetail = () => {
    const queryClient = useQueryClient()
    const { uuid } = useParams()
    const setActiveModal = useModalStore(state => state.setActiveModal)

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
        mutate(
            { userUuid: uuid!, data: { ...data, IsActive: activate } },
            {
                onSuccess: () =>
                    toastNotification(
                        activate ? 'userActivated' : 'userDeactivated'
                    ),
            }
        )
    }

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Gebruikers', path: '/muteer/gebruikers' },
        { name: data?.Gebruikersnaam || '', isCurrent: true },
    ]

    return (
        <>
            <MutateLayout title="Gebruiker" breadcrumbs={breadcrumbPaths}>
                <div className="col-span-6 lg:col-span-3 xl:col-span-4">
                    <Heading level="2" size="m" className="mb-2">
                        Gebruiker
                    </Heading>
                    {isLoading && <LoaderCard height="56" className="w-auto" />}
                    <Heading level="1" size="xxl">
                        {data?.Gebruikersnaam}
                    </Heading>
                </div>
                <div className="col-span-6 lg:col-span-3 xl:col-span-2">
                    <div className="flex items-center justify-between gap-4 rounded border border-pzh-gray-200 px-6 py-4">
                        <Text
                            bold
                            className="-mb-1 whitespace-nowrap"
                            color="text-pzh-blue">
                            Gebruiker status
                        </Text>
                        <div className="flex items-center gap-4">
                            <Badge
                                variant={data?.IsActive ? 'green' : 'red'}
                                text={data?.IsActive ? 'Actief' : 'Inactief'}
                                upperCase={false}
                            />
                            <ToggleSwitch
                                checked={data?.IsActive || false}
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
                <div className="col-span-6 flex flex-col gap-4 lg:col-span-3 xl:col-span-4">
                    <div className="mb-2 flex items-center justify-between">
                        <Heading level="2" size="m">
                            Gegevens gebruiker
                        </Heading>
                        <button
                            onClick={() => setActiveModal('userEdit')}
                            className="text-s text-pzh-green underline hover:text-pzh-green-dark">
                            Gegevens wijzigen
                        </button>
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
                <div className="col-span-6 mt-6 lg:col-span-3 lg:mt-0 xl:col-span-2">
                    <div className="bg-pzh-gray-100 px-8 py-6">
                        <Text className="mb-2" bold color="text-pzh-blue">
                            Wachtwoord
                        </Text>
                        <Text className="mb-2">
                            Nieuw wachtwoord genereren voor deze gebruiker.
                        </Text>
                        <Button
                            variant="secondary"
                            icon={Key}
                            iconSize={20}
                            data-testid="user-generate-password"
                            onPress={() => setActiveModal('userPasswordReset')}
                            className="whitespace-nowrap">
                            Genereer nieuw wachtwoord
                        </Button>
                    </div>
                </div>
            </MutateLayout>

            <UserEditModal />
            <UserGeneratePasswordModal />
        </>
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
