import { useLocation, useNavigate } from 'react-router-dom'

import useAuth from '@/hooks/useAuth'
import { toastNotification } from '@/utils/toastNotification'

/**
 * Redirects a user if they are not authenticated
 */
const useIsUserAuthenticated = (
    authenticatedRoles: string[],
    options?: {
        customRedirect?: string
        urlExceptions?: string[]
    }
) => {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    if (isLoading) return null

    const userRole = user?.Rol

    if (!userRole) {
        // User is not logged in
        toastNotification({ type: 'user is not logged in' })
        navigate('/login', { replace: true })
        return false
    } else if (options?.urlExceptions?.includes(location.pathname)) {
        // User is visiting a page that is not protected
        return true
    } else if (authenticatedRoles.includes(userRole)) {
        // User is Authenticated
        return true
    } else {
        // User is logged in, but not authenticated
        toastNotification({ type: 'user is not authenticated for this page' })

        if (options?.customRedirect) {
            navigate(options.customRedirect, { replace: true })
        } else {
            navigate('/muteer/mijn-beleid', { replace: true })
        }

        return false
    }
}

export default useIsUserAuthenticated
