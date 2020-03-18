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

// Import Sentry (Bug tracking)
import * as Sentry from '@sentry/browser'
import dimensies from '../constants/dimensies'

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://a9c9863a039942abb632f6ff844fea03@sentry.io/1777968',
        environment: process.env.NODE_ENV,
    })
}

// !REFACTOR! - Algemene refactor punten
// - Implement spread operator ({...this.state}) op elke 'variabele = this.state' (reference -> new)
// - Add propTypes for type checking

function ReAuthenticatePopup({ setLoginState }) {
    return (
        <React.Fragment>
            <div className="bg-gray-900 opacity-50 z-40 absolute w-full h-full left-0 top-0"></div>
            <div className="absolute w-full h-full z-40 left-0 top-0 flex justify-center items-center">
                <div className="bg-white rounded p-5 text-gray-700">
                    <h2 className="font-bold text-xl mb-2">Opnieuw inloggen</h2>
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

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: null,
            user: null,
            dataLoaded: false,
            showReAuthenticatePopup: false,
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
            .catch(() => {
                localStorage.removeItem('access_token')
                this.setState({
                    loggedIn: false,
                    user: null,
                    dataLoaded: true,
                })
            })
    }

    checkForInternetExplorer() {
        // detecteerd IE8+ en Edge
        if (document.documentMode || /Edge/.test(navigator.userAgent)) {
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

    componentDidMount() {
        window.addEventListener('authEvent', e =>
            this.listenForExpiredSession(e)
        )

        this.checkIfUserIsAuthenticated()
        this.checkForInternetExplorer()
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
                            path={`/detail/verordeningen/:lineageID`}
                            render={() => (
                                <RaadpleegVerordeningsArtikelDetail
                                    dataModel={dimensies.VERORDENINGSARTIKEL}
                                    history={this.props.history}
                                />
                            )}
                        />

                        {/* Render raadpleeg dNeetail pagina's */}
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
