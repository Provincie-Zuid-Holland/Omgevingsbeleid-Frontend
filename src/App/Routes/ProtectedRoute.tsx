import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

import useAuth from '@/hooks/useAuth'

function ProtectedRoute() {
    const { user } = useAuth()
    const location = useLocation()

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

    return <Outlet />
}

export default ProtectedRoute
