import { Role } from '@/context/AuthContext'
import useAuth from '@/hooks/useAuth'

/**
 * Check if user has one of provided roles
 */
const useRoles = (roles: Role[]) => {
    const { role } = useAuth()

    if (!role) throw 'No role found.'

    return roles.includes(role)
}

export default useRoles
