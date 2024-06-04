import { DNABar, ToastContainer } from '@pzh-ui/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

import Axe from '@/Axe'
import { LoaderContent } from '@/components/Loader'
import AuthProvider from '@/context/AuthContext'
import usePage from '@/hooks/usePage'
import { ErrorPage } from '@/pages/public'
import { BaseLayout } from '@/templates/BaseLayout'
import globalRouter from '@/utils/globalRouter'
import { toastNotification } from '@/utils/toastNotification'

import AppRoutes from './Routes'

import './appConfig'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: 1000 * 60 * 60 * 24,
            retry: false,
            retryOnMount: true,
        },
        mutations: {
            onError: () => toastNotification('error'),
        },
    },
})

const App = () => {
    const navigate = useNavigate()
    globalRouter.navigate = navigate

    const userIsInMuteerEnvironment = usePage('/muteer')
    const isAdvancedSearchPage = usePage('/zoeken-op-kaart')
    const isNetworkPage = usePage('/beleidsnetwerk')

    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <div
                        className="relative flex min-h-screen flex-col text-pzh-blue-dark"
                        id="main-container">
                        <Helmet titleTemplate="%s - Omgevingsbeleid Provincie Zuid-Holland">
                            <meta charSet="utf-8" />
                            <title>
                                Omgevingsbeleid - Provincie Zuid-Holland
                            </title>
                        </Helmet>

                        <BaseLayout hideFooter={isAdvancedSearchPage}>
                            <ErrorBoundary FallbackComponent={ErrorPage}>
                                <Suspense fallback={<LoaderContent />}>
                                    <AppRoutes />
                                </Suspense>
                            </ErrorBoundary>
                            <ToastContainer position="bottom-left" />
                            {!isAdvancedSearchPage &&
                                !userIsInMuteerEnvironment &&
                                !isNetworkPage && (
                                    <DNABar
                                        blocks={6}
                                        className="top-24 hidden lg:block"
                                    />
                                )}
                        </BaseLayout>
                    </div>
                </AuthProvider>
            </QueryClientProvider>
            {!import.meta.env.PROD &&
                !import.meta.env.JEST_WORKER_ID &&
                import.meta.env.VITE_ENABLE_AXE === 'true' && <Axe />}
        </HelmetProvider>
    )
}

export default App
