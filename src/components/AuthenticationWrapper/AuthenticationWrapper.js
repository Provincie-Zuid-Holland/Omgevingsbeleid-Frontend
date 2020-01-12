import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import differenceInMinutes from 'date-fns/difference_in_minutes'

import axios from './../../API/axios'

function AuthenticationWrapper(AuthComponent) {
    return class AuthWrapped extends Component {
        constructor() {
            super()
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
            return (
                <AuthComponent
                    history={this.props.history}
                    user={this.state.user}
                    setLoginState={this.setLoginState}
                    loggedIn={this.state.loggedIn}
                    dataLoaded={this.state.dataLoaded}
                />
            )
        }
    }
}

export default AuthenticationWrapper
