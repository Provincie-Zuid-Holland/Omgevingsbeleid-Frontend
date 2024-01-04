import { Route } from '@tanstack/react-router'

import { SearchResults } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const searchResultsRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/zoekresultaten',
    component: () => <SearchResults />,
})
