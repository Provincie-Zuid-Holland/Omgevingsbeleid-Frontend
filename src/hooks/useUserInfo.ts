import { useUserGetListUsers } from '@/api/fetchers'

import useAuth from './useAuth'

const useUserInfo = (uuid: string) => {
    const { user } = useAuth()

    const { data } = useUserGetListUsers(
        { limit: 500 },
        {
            query: {
                enabled: !!user,
                select: data => data.results.find(user => user.UUID === uuid),
            },
        }
    )

    return data
}

export default useUserInfo
