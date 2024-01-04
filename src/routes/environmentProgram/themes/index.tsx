import { Route } from '@tanstack/react-router'

import { ThemeOverview } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const themesRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/omgevingsprogramma/thematische-programmas',
    component: () => <ThemeOverview />,
})
