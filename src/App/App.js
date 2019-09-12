import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'

// Import Notification Library
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import HTTP Client
import axios from './../API/axios'

// Import Styling
import './../css/tailwind.css'
import './../css/styles.scss'

// Import Pages
import RaadpleegHome from './../pages/RaadpleegHome'
import RaadpleegArtikelDetail from './../pages/RaadpleegArtikelDetail'
import RaadpleegZoekResultatenOverzicht from './../pages/RaadpleegZoekResultatenOverzicht'
import Login from './../pages/Login'

// Import Components
import Navigation from './../components/Navigation'

// Import Auth Routes
import AuthRoutes from './AuthRoutes'

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
                        component={RaadpleegArtikelDetail}
                    />
                    <Route
                        exact
                        path="/zoekresultaten"
                        component={RaadpleegZoekResultatenOverzicht}
                    />
                    <Route path="/login" component={Login} />
                    <AuthRoutes history={this.props.history} />
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
        axios.get('/tokeninfo').catch(error => {
            this.redirectToLogin()
        })
    }
}

export default withRouter(App)
