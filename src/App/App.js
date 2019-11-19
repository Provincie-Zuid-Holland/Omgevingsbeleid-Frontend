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

// Import Pages
import RaadpleegHome from './../pages/RaadpleegHome'
import RaadpleegUniversalObjectDetail from './../pages/RaadpleegUniversalObjectDetail'
import RaadpleegZoekResultatenOverzicht from './../pages/RaadpleegZoekResultatenOverzicht'
import Login from './../pages/Login'

import * as Sentry from '@sentry/browser'

// Import Components
import Navigation from './../components/Navigation'

// Import Auth Routes
import AuthRoutes from './AuthRoutes'

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
            authUser: null,
            loggedIn: null,
        }
        this.setLoginState = this.setLoginState.bind(this)
    }

    setLoginState(loginState) {
        this.setState({
            loggedIn: loginState,
        })
    }

    componentDidMount() {
        axios
            .get('/tokeninfo')
            .then(() => this.setState({ loggedIn: true }))
            .catch(error => {
                localStorage.removeItem('access_token')
                this.setState({ loggedIn: false })
            })
    }

    render() {
        const detailPaginas = [
            {
                slug: 'ambities',
                dataModel: dataModel.Ambitie,
            },
            {
                slug: 'beleidsregels',
                dataModel: dataModel.BeleidsRegel,
            },
            {
                slug: 'doelen',
                dataModel: dataModel.Doel,
            },
            {
                slug: 'provinciale-belangen',
                dataModel: dataModel.ProvincialeBelangen,
            },
            {
                slug: 'belangen',
                dataModel: dataModel.Belang,
            },
            {
                slug: 'maatregelen',
                dataModel: dataModel.Maatregelen,
            },
            {
                slug: 'beleidsbeslissingen',
                dataModel: dataModel.Beleidsbeslissingen,
            },
            // {
            //     slug: 'beleidsrelaties',
            //     dataModel: dataModel.BeleidsRelatie,
            // },
            {
                slug: 'themas',
                dataModel: dataModel.Thema,
            },
            {
                slug: 'beleidsbeslissingen',
                dataModel: dataModel.Beleidsbeslissingen,
            },
            {
                slug: 'opgaven',
                dataModel: dataModel.Opgave,
            },
        ]
        // body-bg-color
        const equalsMuteerOmgeving = this.props.location.pathname.includes(
            'muteer'
        )
        return (
            <main
                className={`min-h-screen pt-12 ${
                    equalsMuteerOmgeving ? 'body-bg-color' : ''
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
                <Switch>
                    <Route path="/" exact component={RaadpleegHome} />
                    <Route
                        exact
                        path="/zoekresultaten"
                        component={RaadpleegZoekResultatenOverzicht}
                    />
                    {/* <Route
                        path="/artikel-detail"
                        exact
                        component={RaadpleegArtikelDetail}
                    /> */}
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
                        authUser={this.state.authUser}
                        history={this.props.history}
                    />
                </Switch>
                <ToastContainer position="bottom-left" />
            </main>
        )
    }
}

export default withRouter(App)
