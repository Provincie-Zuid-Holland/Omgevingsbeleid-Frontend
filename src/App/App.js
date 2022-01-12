// Import and initialize Sentry for tracking bugs
import * as Sentry from '@sentry/browser'
import { Component, Suspense, lazy, useCallback, useLayoutEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Route, Switch, withRouter, useHistory } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import axios from '../API/axios'
import 'react-toastify/dist/ReactToastify.css'
// Import Styling
import './../css/tailwind.css'
import './../css/styles.scss'
import './../../node_modules/leaflet/dist/leaflet.css'
// Import Components
import FeedbackComponent from '../components/FeedbackComponent'
import { LoaderContent } from '../components/Loader'
import Navigation from '../components/Navigation'
import { PopUpAnimatedContainer, PopupWelcomeBeta } from '../components/Popup'
// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITLE_SINGULAR
import allDimensies from '../constants/dimensies'
// Import non authenticated pages
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login'
import Planning from '../pages/Planning'
import RaadpleegDigiToegankelijkheid from '../pages/RaadpleegDigiToegankelijkheid'
import RaadpleegHome from '../pages/RaadpleegHome'
import RaadpleegInProgress from '../pages/RaadpleegInProgress'
import RaadpleegObjectDetail from '../pages/RaadpleegObjectDetail'
import RaadpleegPlanningAndReleases from '../pages/RaadpleegPlanningAndReleases'
import RaadpleegUniversalObjectOverview from '../pages/RaadpleegUniversalObjectOverview'
import RaadpleegVerordening from '../pages/RaadpleegVerordening'
import RaadpleegZoekResultatenOverzicht from '../pages/RaadpleegZoekResultatenOverzicht'
// Import Context
import GraphContext from './GraphContext'
import UserContext from './UserContext'

const AuthRoutes = lazy(() => import('./AuthRoutes'))

if (
    process.env.REACT_APP_SENTRY_DSN &&
    process.env.NODE_ENV !== 'development'
) {
    Sentry.init({
        environment: process.env.NODE_ENV,
        release: process.env.REACT_APP_RELEASE_VERSION,
        dsn: process.env.REACT_APP_SENTRY_DSN,
    })
}

// Create array with detail pages to map through to create the routes
const detailPaginas = [
    {
        slug: 'ambities',
        dataModel: allDimensies.AMBITIES,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSKEUZES,
    },
    {
        slug: 'beleidsprestaties',
        dataModel: allDimensies.BELEIDSPRESTATIES,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
    },
    {
        slug: 'beleidsdoelen',
        dataModel: allDimensies.BELEIDSDOELEN,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
    },
]

const queryClient = new QueryClient()

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: null,
            user: null,
            dataLoaded: false,
            showReAuthenticatePopup: false,
            showWelcomePopup: false,
            showEnvironmentBanner: false,
            graphIsOpen: false,
        }
        this.checkIfUserIsAuthenticated =
            this.checkIfUserIsAuthenticated.bind(this)
        this.setGraphIsOpen = this.setGraphIsOpen.bind(this)
        this.setLoginState = this.setLoginState.bind(this)
        this.setLoginUser = this.setLoginUser.bind(this)
        this.listenForExpiredSession = this.listenForExpiredSession.bind(this)
    }

    setGraphIsOpen(newState) {
        this.setState({
            graphIsOpen: newState,
        })
    }

    // Used to pass to various components to update the loggedIn state, e.g. the <Navigation />
    setLoginState(loginState) {
        this.setState({
            loggedIn: loginState,
        })
    }

    setLoginUser(identifier) {
        this.setState({
            user: identifier,
        })
    }

    // Makes a request on mount to the API to see if we get a 200 response, which means the user is logged in.
    checkIfUserIsAuthenticated() {
        axios
            .get('/tokeninfo')
            .then(res => {
                this.setState({
                    loggedIn: true,
                    user: res.data.identifier,
                    dataLoaded: true,
                })
            })
            .catch(() => {
                this.setState({
                    loggedIn: false,
                    user: null,
                    dataLoaded: true,
                })
            })
    }

    // Used to check for Internet Explorer on mount and display an alert that we only support modern browsers. We do polyfill functionalities where needed for Internet Explorer.
    checkForInternetExplorer() {
        var ua = window.navigator.userAgent
        var msie = ua.indexOf('MSIE ')
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
            // If Internet Explorer, return version number
            window.alert(
                'Deze website werkt met moderne browsers als Chrome, Firefox, Safari, etc'
            )
        }
    }

    // Used if users token session expires and needs to login again
    showReAuthenticatePopup() {
        this.setState({
            showReAuthenticatePopup: true,
        })
    }

    // Function to show popup when the API gets an 401 unauthorized request, which indicates the token has expired.
    listenForExpiredSession(e) {
        // In API/axios.js we make a new CustomEvent with the message below to indicate the token session has ended. In the mount we add an eventlistener and listen for this event to prompt the popup so the user can login again.
        if (e.detail.message === 'Authenticated sessie is afgelopen') {
            this.setLoginState(false)
            // TODO: Add opnieuw inlog popup
            // this.showReAuthenticatePopup(e)
        }
    }

    // User gets shown a popup to communicate the application is still in BETA. This popup is only shown on the first visit. A localstorage item is set after it is shown.
    checkForWelcomePopupInLocalStorage() {
        const isInStorage = localStorage.getItem(
            process.env.REACT_APP_KEY_WELCOME_POPUP
        )
        if (!isInStorage) {
            this.setState({
                showWelcomePopup: true,
            })
            localStorage.setItem(process.env.REACT_APP_KEY_WELCOME_POPUP, true)
        }
    }

    componentDidMount() {
        window.addEventListener('authEvent', e =>
            this.listenForExpiredSession(e)
        )

        this.checkIfUserIsAuthenticated()
        this.checkForInternetExplorer()
        this.checkForWelcomePopupInLocalStorage()
    }

    componentWillUnmount() {
        window.removeEventListener('authEvent', e =>
            this.listenForExpiredSession(e)
        )
    }

    render() {
        // If user is in Mutate environment of the application
        const locationEqualsMutateEnv =
            this.props.location.pathname.includes('muteer')

        return (
            <GraphContext.Provider
                value={{
                    graphIsOpen: this.state.graphIsOpen,
                    setGraphIsOpen: this.setGraphIsOpen,
                }}>
                <UserContext.Provider value={{ user: this.state.user }}>
                    <QueryClientProvider client={queryClient}>
                        <div
                            className={`min-h-screen text-pzh-blue-dark relative ${
                                locationEqualsMutateEnv ? 'bg-gray-100' : ''
                            }`}
                            id="main-container">
                            <Helmet>
                                <meta charSet="utf-8" />
                                <title>
                                    Omgevingsbeleid - Provincie Zuid-Holland
                                </title>
                            </Helmet>

                            {this.state.showWelcomePopup &&
                            this.state.dataLoaded ? (
                                <PopupWelcomeBeta
                                    closePopup={() =>
                                        this.setState({
                                            showWelcomePopup: false,
                                        })
                                    }
                                />
                            ) : null}

                            {this.state.showReAuthenticatePopup ? (
                                <PopUpAnimatedContainer
                                    setLoginState={this.setLoginState}
                                />
                            ) : null}

                            <Navigation
                                setLoginState={this.setLoginState}
                                loggedIn={this.state.loggedIn}
                            />

                            <Navigation
                                setLoginState={this.setLoginState}
                                loggedIn={this.state.loggedIn}
                            />
                            <ErrorBoundary FallbackComponent={ErrorPage}>
                                {this.state.dataLoaded ? (
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
                                                component={
                                                    RaadpleegZoekResultatenOverzicht
                                                }
                                            />

                                            <Route
                                                path={`/detail/verordening`}
                                                render={() => (
                                                    <RaadpleegVerordening />
                                                )}
                                            />

                                            {/* Raadpleeg - Overview and Detail pages for all the dimensions */}
                                            {detailPaginas.map(item => (
                                                <Route
                                                    key={item.slug}
                                                    path={`/detail/${item.slug}/:id`}
                                                    render={() => (
                                                        <RaadpleegObjectDetail
                                                            dataModel={
                                                                item.dataModel
                                                            }
                                                        />
                                                    )}
                                                />
                                            ))}
                                            {/* Raadpleeg - Overview and Detail pages for all the dimensions */}
                                            {detailPaginas.map(item => (
                                                <Route
                                                    key={item.slug}
                                                    path={`/overzicht/${item.slug}`}
                                                    render={() => (
                                                        <RaadpleegUniversalObjectOverview
                                                            dataModel={
                                                                item.dataModel
                                                            }
                                                        />
                                                    )}
                                                />
                                            ))}

                                            {/* Planning page contains the development roadmap */}
                                            <Route
                                                path="/planning"
                                                exact
                                                component={Planning}
                                            />

                                            <Route
                                                path="/login"
                                                render={() => (
                                                    <Login
                                                        setLoginUser={
                                                            this.setLoginUser
                                                        }
                                                        setLoginState={
                                                            this.setLoginState
                                                        }
                                                        history={
                                                            this.props.history
                                                        }
                                                    />
                                                )}
                                            />
                                            <Route
                                                path="/logout"
                                                render={() => (
                                                    <Logout
                                                        setLoginState={
                                                            this.setLoginState
                                                        }
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
                                                render={() => (
                                                    <RaadpleegInProgress />
                                                )}
                                            />
                                            <Route
                                                path="/netwerkvisualisatie"
                                                render={() => null}
                                            />

                                            <AuthRoutes
                                                authUser={this.state.user}
                                                loggedIn={this.state.loggedIn}
                                                setLoginState={
                                                    this.setLoginState
                                                }
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
            </GraphContext.Provider>
        )
    }
}

const Logout = ({ setLoginState }) => {
    const history = useHistory()

    const cleanup = useCallback(() => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)
        localStorage.removeItem(process.env.REACT_APP_KEY_IDENTIFIER)

        setLoginState(false)
        history.push('/')
    }, [setLoginState, history])

    useLayoutEffect(() => {
        cleanup()
    }, [cleanup])

    return null
}

export default withRouter(App)
