import { NotFoundRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const notFoundRoute = new NotFoundRoute({
    getParentRoute: () => rootRoute,
    component: () => <NotFoundPage />,
})
