import './appConfig'

import { DNABar, Feedback } from '@pzh-ui/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import classNames from 'classnames'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { ToastContainer } from 'react-toastify'
import { useEffectOnce } from 'react-use'

import axe from '@/a11y'
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
    const userIsInMuteerEnvironment = usePage('/muteer/')
    const isAdvancedSearchPage = usePage('/zoeken-op-kaart')
    const isNetworkVisualization = usePage('/netwerkvisualisatie')

    if (process.env.NODE_ENV !== 'production' && !process.env.JEST_WORKER_ID) {
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
                    className={classNames(
                        'min-h-screen text-pzh-blue-dark relative',
                        {
                            'advanced-search-page': isAdvancedSearchPage,
                        }
                    )}
                    id="main-container">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Omgevingsbeleid - Provincie Zuid-Holland</title>
                    </Helmet>

                    <BaseLayout
                        hideFooter={
                            isAdvancedSearchPage ||
                            userIsInMuteerEnvironment ||
                            isNetworkVisualization
                        }>
                        <ErrorBoundary FallbackComponent={ErrorPage}>
                            <Suspense fallback={<LoaderContent />}>
                                <AppRoutes />
                            </Suspense>
                        </ErrorBoundary>
                        <ToastContainer limit={1} position="bottom-left" />
                        {!isAdvancedSearchPage && (
                            <>
                                <DNABar blocks={6} />
                                <Feedback
                                    email="omgevingsbeleid@pzh.nl"
                                    website="obzh.nl"
                                />
                            </>
                        )}
                    </BaseLayout>
                </div>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
