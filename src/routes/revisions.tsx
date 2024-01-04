import { Route } from '@tanstack/react-router'

import { Revisions } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const revisionsRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/herzieningen',
    component: () => <Revisions />,
})
