import { Route, useNavigate } from '@tanstack/react-router'
import { useCallback, useLayoutEffect } from 'react'

import useAuth from '@/hooks/useAuth'
import { rootRoute } from '@/services/router'

export const logoutRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/logout',
    component: function Logout() {
        const navigate = useNavigate()
        const { signout } = useAuth()

        const cleanup = useCallback(
            () => signout(() => navigate({ to: '/' })),
            [signout, navigate]
        )

        useLayoutEffect(() => cleanup(), [cleanup])

        return null
    },
})
