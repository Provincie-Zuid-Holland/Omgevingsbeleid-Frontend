import React, { Component } from 'react'
import differenceInMinutes from 'date-fns/difference_in_minutes'

export default function AuthenticationWrapper(AuthComponent) {
    return class AuthWrapped extends Component {
        constructor() {
            super()
            this.state = {
                user: null,
            }
        }

        // Checks if there is a saved token
        loggedIn() {
            let token = this.getToken() // Gets token from localstorage

            const tokenDate = localStorage.getItem('token_date')
            const tokenTimeDiffMinutes = differenceInMinutes(
                new Date(),
                tokenDate
            )

            if (!!token) {
                console.log(
                    '%cLogged in!',
                    'background-color: green; color: white; padding: 2px; border-radius: 3px; font-size: 12px;'
                )
            } else {
                console.log(
                    '%cNot Logged in!',
                    'background-color: red; color: white; padding: 2px; border-radius: 3px; font-size: 12px;'
                )
            }
            if (!!token && tokenTimeDiffMinutes < 60) {
                return true // If token exists
            } else {
                return false
            }
        }

        // Retrieve token from the local storage
        getToken() {
            return localStorage.getItem('access_token')
        }

        componentDidMount() {
            if (!this.loggedIn()) {
                this.props.history.push('/login')
            }
        }

        render() {
            return <AuthComponent history={this.props.history} />
        }
    }
}
