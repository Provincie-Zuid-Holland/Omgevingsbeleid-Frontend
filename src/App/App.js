import React, { Component, useLayoutEffect } from 'react'

// For the routing we use React Router (https://reacttraining.com/react-router/)
import { Route, Switch, withRouter, useHistory } from 'react-router-dom'

// Helmet is the Document Head manager that we use, mostly for building dynamic page titles
import { Helmet } from 'react-helmet'

// Import axios instance
import axios from './../API/axios'

// Import Notification Library
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import Styling
import './../css/tailwind.css'
import './../css/styles.scss'
import './../../node_modules/leaflet/dist/leaflet.css'

// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITEL_ENKELVOUD
import allDimensies from './../constants/dimensies'

// Import non authenticated pages
import RaadpleegHome from './../pages/RaadpleegHome'
import RaadpleegUniversalObjectDetail from './../pages/RaadpleegUniversalObjectDetail'
import RaadpleegVerordeningsArtikelDetail from './../pages/RaadpleegVerordeningsArtikelDetail'
import RaadpleegZoekResultatenOverzicht from './../pages/RaadpleegZoekResultatenOverzicht'
import Login from './../pages/Login'
import Planning from './../pages/Planning'

// Import authenticated routes,
import AuthRoutes from './AuthRoutes'

// Import Components
import Navigation from './../components/Navigation'
import LoaderContent from './../components/LoaderContent'
import PopupWelcomeBeta from './../components/PopupWelcomeBeta'
import PopUpAnimatedContainer from './../components/PopUpAnimatedContainer'
import PopupReauthenticate from './../components/PopupReauthenticate'
import Transition from './../components/Transition'

// Import and initialize Sentry for tracking bugs
import * as Sentry from '@sentry/browser'

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        environment: process.env.NODE_ENV,
        release: process.env.REACT_APP_RELEASE_VERSION,
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
        slug: 'doelen',
        dataModel: allDimensies.DOELEN,
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
        slug: 'beleidsbeslissingen',
        dataModel: allDimensies.BELEIDSBESLISSINGEN,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
    },
    {
        slug: 'opgaven',
        dataModel: allDimensies.OPGAVEN,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
    },
]

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
        }
        this.checkIfUserIsAuthenticated = this.checkIfUserIsAuthenticated.bind(
            this
        )
        this.setLoginState = this.setLoginState.bind(this)
        this.listenForExpiredSession = this.listenForExpiredSession.bind(this)
    }

    // Used to pass to various components to update the loggedIn state, e.g. the <Navigation />
    setLoginState(loginState) {
        this.setState({
            loggedIn: loginState,
        })
    }

    // Makes a request on mount to the API to see if we get a 200 response, which means the user is logged in.
    checkIfUserIsAuthenticated() {
        axios
            .get('/tokeninfo')
            .then((res) => {
                this.setState({
                    loggedIn: true,
                    user: res.data.identifier,
                    dataLoaded: true,
                })
            })
            .catch((error) => {
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
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            // If Internet Explorer, return version number
            window.alert(
                'Deze website werkt met moderne browsers als Chrome, Firefox, Safari, etc'
            )
        }
    }

    // Used if users token session expires and needs to login again
    showReAuthenticatePopup(e) {
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
        window.addEventListener('authEvent', (e) =>
            this.listenForExpiredSession(e)
        )

        this.checkIfUserIsAuthenticated()
        this.checkForInternetExplorer()
        this.checkForWelcomePopupInLocalStorage()
    }

    componentWillUnmount() {
        window.removeEventListener('authEvent', (e) =>
            this.listenForExpiredSession(e)
        )
    }

    render() {
        // If user is in Mutate environment of the application
        const locationEqualsMutateEnv =
            this.props.location.pathname.includes('muteer') ||
            this.props.location.pathname.includes('login')

        return (
            <main
                className={`min-h-screen pt-12 ${
                    locationEqualsMutateEnv ? 'bg-gray-100' : ''
                }`}
                id="main-container"
            >
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Omgevingsbeleid - Provincie Zuid-Holland</title>
                </Helmet>

                {this.state.showWelcomePopup && this.state.dataLoaded ? (
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

                {this.state.dataLoaded ? (
                    <Switch>
                        {/* Raadpleeg - The homepage where users can search for policies and regulations */}
                        <Route path="/" exact component={RaadpleegHome} />

                        {/* Raadpleeg - Result page for search */}
                        <Route
                            exact
                            path="/zoekresultaten"
                            component={RaadpleegZoekResultatenOverzicht}
                        />

                        {/* Raadpleeg - Detail page for Article objects of the regulations */}
                        <Route
                            path={`/detail/verordeningen/:lineageID/:objectUUID`}
                            render={() => (
                                <RaadpleegVerordeningsArtikelDetail
                                    dataModel={allDimensies.VERORDENINGSARTIKEL}
                                    history={this.props.history}
                                />
                            )}
                        />

                        {/* Raadpleeg - Detail pages for all the dimensions */}
                        {detailPaginas.map((item) => {
                            return (
                                <Route
                                    key={item.slug}
                                    path={`/detail/${item.slug}/:id`}
                                    render={({ match }) => (
                                        <RaadpleegUniversalObjectDetail
                                            dataModel={item.dataModel}
                                            history={this.props.history}
                                            match={match}
                                        />
                                    )}
                                />
                            )
                        })}

                        {/* Planning page contains the development roadmap */}
                        <Route path="/planning" exact component={Planning} />

                        {/*  */}
                        <Route
                            path="/login"
                            render={() => (
                                <Login
                                    setLoginState={this.setLoginState}
                                    history={this.props.history}
                                />
                            )}
                        />
                        <Route
                            path="/logout"
                            render={() => (
                                <Logout setLoginState={this.setLoginState} />
                            )}
                        />
                        <AuthRoutes
                            authUser={this.state.user}
                            loggedIn={this.state.loggedIn}
                            setLoginState={this.setLoginState}
                            history={this.props.history}
                        />
                    </Switch>
                ) : (
                    <LoaderContent />
                )}

                <ToastContainer position="bottom-left" />
            </main>
        )
    }
}

const Logout = ({ setLoginState }) => {
    const history = useHistory()

    React.useLayoutEffect(() => {
        // Clear user token and profile data from localStorage
        localStorage.removeItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)
        localStorage.removeItem(process.env.REACT_APP_KEY_IDENTIFIER)

        setLoginState(false)
        history.push('/')
    }, [])

    return null
}

export default withRouter(App)
