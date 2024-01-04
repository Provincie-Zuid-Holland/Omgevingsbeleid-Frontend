import { Route } from '@tanstack/react-router'

import { Accessibility } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const accessibilityRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/digi-toegankelijkheid',
    component: () => <Accessibility />,
})
