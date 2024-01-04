import { Route } from '@tanstack/react-router'

import { ThemeDetail } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const themeDetailRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/omgevingsprogramma/thematische-programmas/$uuid',
    component: () => <ThemeDetail />,
})
