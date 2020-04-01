import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import axios from './../API/axios'
import { Helmet } from 'react-helmet'

// Import Notification Library
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import Styling
import './../css/tailwind.css'
import './../css/styles.scss'

// Import Data Model
import dataModel from './dataModel'

// Import non-auth Pages
import RaadpleegHome from './../pages/RaadpleegHome'
import RaadpleegUniversalObjectDetail from './../pages/RaadpleegUniversalObjectDetail'
import RaadpleegVerordeningsArtikelDetail from './../pages/RaadpleegVerordeningsArtikelDetail'
import RaadpleegZoekResultatenOverzicht from './../pages/RaadpleegZoekResultatenOverzicht'
import Login from './../pages/Login'

// Import Auth Routes
import AuthRoutes from './AuthRoutes'

// Import Components
import Navigation from './../components/Navigation'
import LoaderContent from './../components/LoaderContent'
import LoginForm from './../components/LoginForm'
import PopUpAnimatedContainer from './../components/PopUpAnimatedContainer'

// Import Sentry (Bug tracking)
import * as Sentry from '@sentry/browser'
import dimensies from '../constants/dimensies'

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://a9c9863a039942abb632f6ff844fea03@sentry.io/1777968',
        environment: process.env.NODE_ENV,
        release: 'omgevingsbeleid@1.0.0',
    })
}

function ReAuthenticatePopup({ setLoginState }) {
    return (
        <React.Fragment>
            <div className="absolute top-0 left-0 z-40 w-full h-full bg-gray-900 opacity-50"></div>
            <div className="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full">
                <div className="p-5 text-gray-700 bg-white rounded">
                    <h2 className="mb-2 text-xl font-bold">Opnieuw inloggen</h2>
                    <p>
                        De sessie is verlopen. U kunt hieronder opnieuw
                        inloggen.
                    </p>
                    <LoginForm setLoginState={setLoginState} />
                </div>
            </div>
        </React.Fragment>
    )
}

function WelcomePopup({ closePopup }) {
    return (
        <React.Fragment>
            <div className="absolute top-0 left-0 z-40 w-full h-full bg-gray-900 opacity-50"></div>
            <div className="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full">
                <div className="max-w-xl p-10 text-gray-700 bg-white rounded">
                    <div className="block mb-4">
                        <div className="w-full h-16 logo-main" />
                    </div>
                    <h2 className="mt-4 mb-2 text-lg font-bold">
                        Welkom op het vernieuwde Digitaal Omgevingsbeleid van
                        provincie Zuid-Holland!
                    </h2>
                    <p>
                        Welkom op het vernieuwde Digitaal Omgevingsbeleid van
                        provincie Zuid-Holland. Net als in de oude omgeving kun
                        je hier zoeken op provinciaal beleid, maar ziet alles er
                        net even anders uit. Zo is er onder andere gewerkt aan
                        een gebruiksvriendelijkere omgeving en betere weergaven.
                        Omdat de website nog in ontwikkeling is kan het zijn dat
                        sommige functionaliteiten niet goed werken. Kom je een
                        fout tegen? Neem dan contact op door te mailen naar{' '}
                        <a
                            href="mailto:omgevingsbeleid@pzh.nl?subject=Feedback Omgevingsbeleid&body=Probeer zo duidelijk mogelijk te omschrijven waar je tegenaan liep"
                            className="underline cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            omgevingsbeleid@pzh.nl
                        </a>
                    </p>
                    <span
                        onClick={closePopup}
                        id="aan-de-slag-close-popup"
                        className="block px-4 py-3 mt-8 text-sm font-bold leading-tight text-center text-white rounded cursor-pointer mbg-color hover:underline"
                    >
                        Aan de slag
                    </span>
                </div>
            </div>
        </React.Fragment>
    )
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: null,
            user: null,
            dataLoaded: false,
            showReAuthenticatePopup: false,
            showWelcomePopup: false,
        }
        this.checkIfUserIsAuthenticated = this.checkIfUserIsAuthenticated.bind(
            this
        )
        this.setLoginState = this.setLoginState.bind(this)
        this.listenForExpiredSession = this.listenForExpiredSession.bind(this)
    }

    setLoginState(loginState) {
        this.setState({
            loggedIn: loginState,
        })
    }

    // Controleerd de tokenInfo om te kijken of de gebruiker is ingelogd
    // !REFACTOR! Duidelijkere naam
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
            .catch(error => {
                this.setState({
                    loggedIn: false,
                    user: null,
                    dataLoaded: true,
                })
            })
    }

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

    showReAuthenticatePopup(e) {
        this.setState({
            showReAuthenticatePopup: true,
        })
    }

    listenForExpiredSession(e) {
        if (e.detail.message === 'Authenticated sessie is afgelopen') {
            // !REFACTOR! Add opnieuw inlog popup
            // this.showReAuthenticatePopup(e)
        }
    }

    listenForLocalStorageChange(e) {
        this.setLoginState(!!e.newValue)
    }

    checkForWelcomePopupInLocalStorage() {
        const isInStorage = localStorage.getItem('omgevingsbeleid-welcome')
        if (!isInStorage) {
            this.setState({
                showWelcomePopup: true,
            })
            localStorage.setItem('omgevingsbeleid-welcome', true)
        }
    }

    componentDidMount() {
        // window.location.replace('https://omgevingsbeleidpzh.mendixcloud.com/p/')

        window.addEventListener('authEvent', e =>
            this.listenForExpiredSession(e)
        )

        window.addEventListener('storage', e =>
            this.listenForLocalStorageChange(e)
        )

        this.checkIfUserIsAuthenticated()
        this.checkForInternetExplorer()
        this.checkForWelcomePopupInLocalStorage()
    }

    componentWillUnmount() {
        window.removeEventListener('authEvent', e =>
            this.listenForExpiredSession(e)
        )
        window.removeEventListener('storage', e =>
            this.listenForLocalStorageChange(e)
        )
    }

    render() {
        // Array die gebruikt wordt om de routes te renderen van de detail pagina's
        const detailPaginas = [
            {
                slug: 'ambities',
                dataModel: dataModel.Ambities,
            },
            {
                slug: 'beleidsregels',
                dataModel: dataModel.BeleidsRegels,
            },
            {
                slug: 'doelen',
                dataModel: dataModel.Doelen,
            },
            {
                slug: 'provinciale-belangen',
                dataModel: dataModel.ProvincialeBelangen,
            },
            {
                slug: 'belangen',
                dataModel: dataModel.Belangen,
            },
            {
                slug: 'maatregelen',
                dataModel: dataModel.Maatregelen,
            },
            {
                slug: 'beleidsbeslissingen',
                dataModel: dataModel.Beleidsbeslissingen,
            },
            {
                slug: 'themas',
                dataModel: dataModel["Thema's"],
            },
            {
                slug: 'opgaven',
                dataModel: dataModel.Opgaven,
            },
            {
                slug: 'verordeningen',
                dataModel: dataModel.Verordeningen,
            },
        ]

        return (
            <main
                className={`min-h-screen pt-12 ${
                    this.props.location.pathname.includes('muteer') ||
                    this.props.location.pathname.includes('login')
                        ? 'bg-gray-100'
                        : ''
                }`}
                id="main-container"
            >
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Omgevingsbeleid - Provincie Zuid-Holland</title>
                </Helmet>

                {this.state.showWelcomePopup && this.state.dataLoaded ? (
                    <WelcomePopup
                        closePopup={() =>
                            this.setState({
                                showWelcomePopup: false,
                            })
                        }
                    />
                ) : null}

                {this.state.showReAuthenticatePopup ? (
                    <ReAuthenticatePopup setLoginState={this.setLoginState} />
                ) : null}

                <Navigation
                    setLoginState={this.setLoginState}
                    loggedIn={this.state.loggedIn}
                />
                {this.state.dataLoaded ? (
                    <Switch>
                        <Route path="/" exact component={RaadpleegHome} />
                        <Route
                            exact
                            path="/zoekresultaten"
                            component={RaadpleegZoekResultatenOverzicht}
                        />

                        {/* Raadpleeg verordeningspagina */}
                        <Route
                            path={`/detail/verordeningen/:lineageID/:objectUUID`}
                            render={() => (
                                <RaadpleegVerordeningsArtikelDetail
                                    dataModel={dimensies.VERORDENINGSARTIKEL}
                                    history={this.props.history}
                                />
                            )}
                        />

                        {/* Render raadpleeg detail pagina's */}
                        {detailPaginas.map(item => {
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
                        <Route
                            path="/login"
                            render={() => (
                                <Login
                                    setLoginState={this.setLoginState}
                                    history={this.props.history}
                                />
                            )}
                        />
                        <AuthRoutes
                            authUser={this.state.user}
                            loggedIn={this.state.loggedIn}
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

export default withRouter(App)
