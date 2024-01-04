import { Route } from '@tanstack/react-router'

import { AreaOverview } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const areasRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/omgevingsprogramma/gebiedsprogrammas',
    component: () => <AreaOverview />,
})
