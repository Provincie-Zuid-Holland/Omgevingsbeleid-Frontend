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
import RaadpleegZoekResultatenOverzicht from './../pages/RaadpleegZoekResultatenOverzicht'
import Login from './../pages/Login'

// Import Auth Routes
import AuthRoutes from './AuthRoutes'

// Import Components
import Navigation from './../components/Navigation'
import LoaderContent from './../components/LoaderContent'

// Import Sentry (Bug tracking)
import * as Sentry from '@sentry/browser'

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: 'https://a9c9863a039942abb632f6ff844fea03@sentry.io/1777968',
        environment: process.env.NODE_ENV,
    })
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loggedIn: null,
            user: null,
            dataLoaded: false,
        }
        this.checkUserToken = this.checkUserToken.bind(this)
        this.setLoginState = this.setLoginState.bind(this)
    }

    setLoginState(loginState) {
        this.setState({
            loggedIn: loginState,
        })
    }

    // Controleerd de tokenInfo om te kijken of de gebruiker is ingelogd
    checkUserToken() {
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

    componentDidMount() {
        this.checkUserToken()
    }

    render() {
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
