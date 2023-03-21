import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Role } from '@/context/AuthContext'
import useAuth from '@/hooks/useAuth'

interface ProtectedRouteProps {
    children?: JSX.Element | null
    roles?: Role[]
    redirectTo?: string
}

function ProtectedRoute({ children, roles, redirectTo }: ProtectedRouteProps) {
    const { user } = useAuth()
    const location = useLocation()

    const userRole = user?.Rol as Role

    if (!user) {
        localStorage.removeItem(
            process.env.REACT_APP_KEY_API_ACCESS_TOKEN || ''
        )
        toast('Voor deze actie moet je ingelogd zijn')

        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (!roles?.includes(userRole) && redirectTo) {
        toast('Je hebt geen toegang tot deze pagina')

        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    if (roles && children) return children

    return <Outlet />
}

export default ProtectedRoute
