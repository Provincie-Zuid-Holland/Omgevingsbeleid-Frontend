import { useMemo } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import useAuth from '@/hooks/useAuth'
import usePermissions, { Permissions } from '@/hooks/usePermissions'
import { toastNotification } from '@/utils/toastNotification'

interface ProtectedRouteProps {
    children?: JSX.Element | null
    redirectTo?: string
    permissions?: Partial<Permissions>
}

function ProtectedRoute({
    children,
    redirectTo = '/muteer',
    permissions: providedPermissions,
}: ProtectedRouteProps) {
    const { user } = useAuth()
    const userPermissions = usePermissions()
    const location = useLocation()

    /**
     * Check if user has access to page
     */
    const hasAccess = useMemo(() => {
        if (!providedPermissions) return true

        return Object.keys(providedPermissions).every(
            permission =>
                userPermissions[permission as keyof Permissions] ===
                providedPermissions[permission as keyof Permissions]
        )
    }, [providedPermissions, userPermissions])

    if (!user) {
        localStorage.removeItem(
            process.env.REACT_APP_KEY_API_ACCESS_TOKEN || ''
        )
        toastNotification('notLoggedIn')

        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (!hasAccess && redirectTo) {
        toastNotification('notAllowed')

        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    if (providedPermissions && children) return children

    return <Outlet />
}

export default ProtectedRoute
