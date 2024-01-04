import { Route } from '@tanstack/react-router'

import { PlanningAndReleases } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const releasesRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/planning-en-releases',
    component: () => <PlanningAndReleases />,
})
