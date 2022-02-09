import './appConfig'

import {
    Suspense,
    lazy,
    useCallback,
    useLayoutEffect,
    useState,
    FC,
    useEffect,
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
    Route,
    Switch,
    withRouter,
    useHistory,
    RouteComponentProps,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { getTokeninfo } from '@/api/fetchers'
import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'
import FeedbackComponent from '@/components/FeedbackComponent'
import { LoaderContent } from '@/components/Loader'
import Navigation from '@/components/Navigation'
import { NetworkGraph } from '@/components/Network'
import { PopupWelcomeBeta } from '@/components/Popup'
import useMuteerEnvironment from '@/hooks/useMuteerEnvironment'
import ErrorPage from '@/pages/ErrorPage'
import Login from '@/pages/Login'
import RaadpleegDigiToegankelijkheid from '@/pages/RaadpleegDigiToegankelijkheid'
import RaadpleegHome from '@/pages/RaadpleegHome'
import RaadpleegInProgress from '@/pages/RaadpleegInProgress'
import RaadpleegMapSearch from '@/pages/RaadpleegMapSearch'
import RaadpleegObjectDetail from '@/pages/RaadpleegObjectDetail'
import RaadpleegPlanningAndReleases from '@/pages/RaadpleegPlanningAndReleases'
import RaadpleegSearchResults from '@/pages/RaadpleegSearchResults'
import RaadpleegUniversalObjectOverview from '@/pages/RaadpleegUniversalObjectOverview'
import RaadpleegVerordening from '@/pages/RaadpleegVerordening'
import detailPages from '@/utils/detailPages'

// Import Context
import UserContext from './UserContext'

const AuthRoutes = lazy(() => import('./AuthRoutes'))

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

const App: FC<RouteComponentProps> = () => {
    const userIsInMuteerEnvironment = useMuteerEnvironment()

    const [user, setUser] = useState<GetTokeninfo200Identifier | undefined>(
        undefined
    )
    const [loggedIn, setLoggedIn] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    const [showWelcomePopup, setShowWelcomePopup] = useState(false)

    useEffect(() => {
        window.addEventListener('authEvent', e => listenForExpiredSession(e))

        checkIfUserIsAuthenticated()
        checkForInternetExplorer()
        checkForWelcomePopupInLocalStorage()

        return () => {
            window.removeEventListener('authEvent', e =>
                listenForExpiredSession(e)
            )
        }
    }, [])

    // Function to show popup when the API gets an 401 unauthorized request, which indicates the token has expired.
    const listenForExpiredSession = (e: any) => {
        // In api/instance.ts we make a new CustomEvent with the message below to indicate the token session has ended. In the mount we add an eventlistener and listen for this event to prompt the popup so the user can login again.
        if (e.detail.message === 'Authenticated sessie is afgelopen') {
            setLoggedIn(false)
            // TODO: Add opnieuw inlog popup
            // showReAuthenticatePopup(e)
        }
    }

    // Makes a request on mount to the API to see if we get a 200 response, which means the user is logged in.
    const checkIfUserIsAuthenticated = () => {
        getTokeninfo()
            .then(data => {
                if (!data.identifier) return

                setLoggedIn(true)
                setUser(data.identifier)
                setDataLoaded(true)
            })
            .catch(() => {
                setLoggedIn(false)
                setUser(undefined)
                setDataLoaded(true)
            })
    }

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

    // User gets shown a popup to communicate the application is still in BETA. This popup is only shown on the first visit. A localstorage item is set after it is shown.
    const checkForWelcomePopupInLocalStorage = () => {
        const isInStorage = localStorage.getItem(
            process.env.REACT_APP_KEY_WELCOME_POPUP || ''
        )
        if (!isInStorage) {
            setShowWelcomePopup(true)
            localStorage.setItem(
                process.env.REACT_APP_KEY_WELCOME_POPUP || '',
                'true'
            )
        }
    }

    return (
        <UserContext.Provider value={{ user }}>
            <QueryClientProvider client={queryClient}>
                <div
                    className={`min-h-screen text-pzh-blue-dark relative ${
                        userIsInMuteerEnvironment ? 'bg-gray-100' : ''
                    }`}
                    id="main-container">
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Omgevingsbeleid - Provincie Zuid-Holland</title>
                    </Helmet>

                    {showWelcomePopup && dataLoaded ? (
                        <PopupWelcomeBeta
                            closePopup={() => setShowWelcomePopup(false)}
                        />
                    ) : null}

                    <Navigation loggedIn={loggedIn} />

                    <ErrorBoundary FallbackComponent={ErrorPage}>
                        {dataLoaded ? (
                            <Suspense fallback={<LoaderContent />}>
                                <Switch>
                                    {/* Raadpleeg - The homepage where users can search for policies and regulations */}
                                    <Route
                                        path="/"
                                        exact
                                        component={RaadpleegHome}
                                    />

                                    {/* Raadpleeg - Result page for search */}
                                    <Route
                                        exact
                                        path="/zoekresultaten"
                                        component={RaadpleegSearchResults}
                                    />

                                    {/* Raadpleeg - Search on map page */}
                                    <Route
                                        exact
                                        path="/zoeken-op-kaart"
                                        component={RaadpleegMapSearch}
                                    />

                                    <Route
                                        path={`/detail/verordening`}
                                        render={() => <RaadpleegVerordening />}
                                    />

                                    {/* Raadpleeg - Overview and Detail pages for all the dimensions */}
                                    {detailPages.map(item => (
                                        <Route
                                            key={item.slug}
                                            path={`/detail/${item.slug}/:id`}
                                            render={() => (
                                                <RaadpleegObjectDetail
                                                    {...item}
                                                />
                                            )}
                                        />
                                    ))}
                                    {/* Raadpleeg - Overview and Detail pages for all the dimensions */}
                                    {detailPages.map(item => (
                                        <Route
                                            key={item.slug}
                                            path={`/overzicht/${item.slug}`}
                                            render={() => (
                                                <RaadpleegUniversalObjectOverview
                                                    {...item}
                                                    dataEndpoint={
                                                        item.dataValidEndpoint
                                                    }
                                                />
                                            )}
                                        />
                                    ))}

                                    <Route
                                        path="/login"
                                        render={() => (
                                            <Login
                                                setLoginUser={setUser}
                                                setLoginState={setLoggedIn}
                                            />
                                        )}
                                    />
                                    <Route
                                        path="/logout"
                                        render={() => (
                                            <Logout
                                                setLoginState={setLoggedIn}
                                            />
                                        )}
                                    />
                                    <Route
                                        path="/planning-en-releases"
                                        render={() => (
                                            <RaadpleegPlanningAndReleases />
                                        )}
                                    />
                                    <Route
                                        path="/digi-toegankelijkheid"
                                        render={() => (
                                            <RaadpleegDigiToegankelijkheid />
                                        )}
                                    />
                                    <Route
                                        path="/in-bewerking"
                                        render={() => <RaadpleegInProgress />}
                                    />
                                    <Route
                                        path="/netwerkvisualisatie"
                                        component={NetworkGraph}
                                    />

                                    <AuthRoutes
                                        authUser={user}
                                        loggedIn={loggedIn}
                                    />
                                </Switch>
                            </Suspense>
                        ) : (
                            <LoaderContent />
                        )}
                    </ErrorBoundary>
                    <ToastContainer limit={1} position="bottom-left" />
                    <FeedbackComponent />
                </div>
            </QueryClientProvider>
        </UserContext.Provider>
    )
}

interface LogoutProps {
    setLoginState: (state: boolean) => void
}

const Logout = ({ setLoginState }: LogoutProps) => {
    const history = useHistory()

    const cleanup = useCallback(() => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem(
            process.env.REACT_APP_KEY_API_ACCESS_TOKEN || ''
        )
        localStorage.removeItem(process.env.REACT_APP_KEY_IDENTIFIER || '')

        setLoginState(false)
        history.push('/')
    }, [setLoginState, history])

    useLayoutEffect(() => {
        cleanup()
    }, [cleanup])

    return null
}

export default withRouter(App)
