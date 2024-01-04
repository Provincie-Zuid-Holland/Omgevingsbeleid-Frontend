import { Route } from '@tanstack/react-router'

import { AreaDetail } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const areaDetailRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/omgevingsprogramma/gebiedsprogrammas/$uuid',
    component: () => <AreaDetail />,
})
