import React, { Component } from 'react'
import axios from './../../API/axios'

function WrapperUserInfo(AuthComponent) {
    return class UserWrapped extends Component {
        constructor() {
            super()
            this.state = {
                user: null,
            }
        }

        // Controleerd de tokenInfo om te kijken of de gebruiker is ingelogd
        checkUserToken() {
            axios
                .get('/tokeninfo')
                .then(res => {
                    this.setState({
                        user: res.data.identifier,
                    })
                })
                .catch(() => {
                    localStorage.removeItem('access_token')
                    this.setState({
                        user: null,
                    })
                })
        }

        componentDidMount() {
            this.checkUserToken()
        }

        render() {
            return <AuthComponent user={this.state.user} {...this.props} />
        }
    }
}

export default WrapperUserInfo
