import { Route } from '@tanstack/react-router'

import { EnvironmentProgram } from '@/pages/public'
import { rootRoute } from '@/services/router'

export const environmentProgramRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/omgevingsprogramma',
    component: () => <EnvironmentProgram />,
})
