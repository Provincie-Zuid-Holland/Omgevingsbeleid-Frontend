import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import axiosAPI from './API/axios'

// Import Styling
import './css/tailwind.css'
import './css/styles.scss'

// Import Components
import Navigation from './components/Navigation'
import RaadpleegHome from './components/RaadpleegHome'
import ZoekResultatenOverzicht from './components/ZoekResultatenOverzicht'
import ArtikelDetailRaadpleeg from './components/ArtikelDetailRaadpleeg'
import Login from './components/Login'
import ApiTest from './components/ApiTest'
import Dashboard from './components/Dashboard'
import Maatregelen from './components/Maatregelen'
import Verordening from './components/Verordening'
import APITestRoutes from './components/APITest/APITestRoutes'
import APITestDetail from './components/APITest/APITestDetail'
import APITestCRUD from './components/APITest/APITestCRUD'

// Import Auth Routes
import AuthenticatedRoutes from './components/AuthenticatedRoutes'

// Import Notification Library
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class App extends Component {
    render() {
        return (
            <main
                className="body-bg-color min-h-screen pt-12"
                id="main-container"
            >
                <Navigation />
                <Switch>
                    <Route path="/" exact component={RaadpleegHome} />
                    <Route
                        path="/artikel-detail"
                        component={ArtikelDetailRaadpleeg}
                    />
                    <Route
                        exact
                        path="/zoekresultaten"
                        component={ZoekResultatenOverzicht}
                    />
                    <Route path="/login" component={Login} />
                    <AuthenticatedRoutes history={this.props.history} />
                </Switch>
                <ToastContainer />
            </main>
        )
    }

    redirectToLogin() {
        localStorage.removeItem('access_token')
        this.props.history.push('/login')
    }

    componentDidMount() {
        // Als de app gemount wordt, wordt de huidige token gechecked
        axiosAPI
            .get('/tokeninfo')
            .then(res => {
                if (res.status !== 200) {
                    this.redirectToLogin()
                }
            })
            .catch(error => {
                this.redirectToLogin()
            })
    }
}

export default withRouter(App)
