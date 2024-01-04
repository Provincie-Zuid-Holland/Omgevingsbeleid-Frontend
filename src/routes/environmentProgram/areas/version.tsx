import { Route } from '@tanstack/react-router'

import { AreaDetail } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const areaVersionRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/omgevingsprogramma/gebiedsprogrammas/ontwerpversie/$moduleId/$uuid',
    component: () => <AreaDetail />,
})
