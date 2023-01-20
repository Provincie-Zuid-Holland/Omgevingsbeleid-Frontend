import './appConfig'

import { DNABar } from '@pzh-ui/components'
import classNames from 'classnames'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import { useEffectOnce } from 'react-use'

import axe from '@/a11y'
import FeedbackComponent from '@/components/FeedbackComponent'
import { LoaderContent } from '@/components/Loader'
import AuthProvider from '@/context/AuthContext'
import usePage from '@/hooks/usePage'
import ErrorPage from '@/pages/ErrorPage'
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
    const isNetworkVisualization = usePage('/beleidsnetwerk')

    if (process.env.NODE_ENV !== 'production' && !process.env.JEST_WORKER_ID) {
        // axe()
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
                        'min-h-screen text-pzh-blue-dark relative overflow-x-hidden',
                        {
                            'bg-gray-100': userIsInMuteerEnvironment,
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
                                <FeedbackComponent />
                            </>
                        )}
                    </BaseLayout>
                </div>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
