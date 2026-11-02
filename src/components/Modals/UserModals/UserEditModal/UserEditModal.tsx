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

    const { id } = useParams()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, queryKey } = useUserViewGetUser(id!, {
        query: { enabled: !!id },
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

    const handleSubmit = (user: EditUser) => {
        if (Array.isArray(user.roles)) {
            user.roles = user.roles.map((item: any) => item?.value ?? item)
        }

        mutateAsync({ userUuid: id!, data: user })
    }

    return (
        <Modal id="userEdit" title="Gegevens wijzigen">
            <UserForm
                initialValues={{
                    name: data?.name || '',
                    email: data?.email || '',
                    roles: data?.roles || [],
                }}
                onSubmit={handleSubmit}
                handleClose={() => setActiveModal(null)}
            />
        </Modal>
    )
}

export default UserEditModal
