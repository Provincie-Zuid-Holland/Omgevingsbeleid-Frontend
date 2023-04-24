import './appConfig'

import { DNABar, ToastContainer } from '@pzh-ui/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { useEffectOnce } from 'react-use'

import { LoaderContent } from '@/components/Loader'
import AuthProvider from '@/context/AuthContext'
import usePage from '@/hooks/usePage'
import { ErrorPage } from '@/pages/public'
import { BaseLayout } from '@/templates/BaseLayout'

import AppRoutes from './Routes'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: 1000 * 60 * 60 * 24,
            retry: false,
            retryOnMount: true,
        },
    },
})

const App = () => {
    const userIsInMuteerEnvironment = usePage('/muteer')
    const isAdvancedSearchPage = usePage('/zoeken-op-kaart')
    const isNetworkPage = usePage('/beleidsnetwerk')

    if (
        process.env.NODE_ENV !== 'production' &&
        !process.env.JEST_WORKER_ID &&
        process.env.REACT_APP_ENABLE_AXE === 'true'
    ) {
        const axe = require('@/a11y').default

        axe()
    }

    useEffectOnce(() => {
        checkForInternetExplorer()
    })

    // Used to check for Internet Explorer on mount and display an alert that we only support modern browsers. We do polyfill functionalities where needed for Internet Explorer.
    const checkForInternetExplorer = () => {
        const ua = window.navigator.userAgent
        const msie = ua.indexOf('MSIE ')
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
            // If Internet Explorer, return version number
            window.alert(
                'Deze website werkt met moderne browsers als Chrome, Firefox, Safari, etc'
            )
        }
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <div
                    className="text-pzh-blue-dark relative flex flex-col min-h-screen"
                    id="main-container">
                    <Helmet titleTemplate="%s - Omgevingsbeleid Provincie Zuid-Holland">
                        <meta charSet="utf-8" />
                        <title>Omgevingsbeleid - Provincie Zuid-Holland</title>
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
                                <DNABar blocks={6} className="top-[96px]" />
                            )}
                    </BaseLayout>
                </div>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
