import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
    getUserGetSearchUsersQueryKey,
    useUserPostEditUser,
    useUserViewGetUser,
} from '@/api/fetchers'
import { EditUser } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import UserForm from '@/components/Users/UserForm'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'

const UserEditModal = () => {
    const queryClient = useQueryClient()

    const { uuid } = useParams()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, queryKey } = useUserViewGetUser(uuid!, {
        query: { enabled: !!uuid },
    })

    const { mutateAsync } = useUserPostEditUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey })
                queryClient.invalidateQueries({
                    queryKey: getUserGetSearchUsersQueryKey(),
                    refetchType: 'all',
                })

                setActiveModal(null)

                toastNotification('saved')
            },
        },
    })

    const handleSubmit = (user: EditUser) =>
        mutateAsync({ userUuid: uuid!, data: user })

    return (
        <Modal id="userEdit" title="Gegevens wijzigen">
            <UserForm
                initialValues={{
                    Gebruikersnaam: data?.Gebruikersnaam || '',
                    Email: data?.Email || '',
                    Rol: data?.Rol || '',
                }}
                onSubmit={handleSubmit}
                handleClose={() => setActiveModal(null)}
            />
        </Modal>
    )
}

export default UserEditModal
