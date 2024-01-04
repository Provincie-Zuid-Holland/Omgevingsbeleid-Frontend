import { Route } from '@tanstack/react-router'

import { MapSearch } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const mapSearchRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/zoeken-op-kaart',
    component: () => <MapSearch />,
})
