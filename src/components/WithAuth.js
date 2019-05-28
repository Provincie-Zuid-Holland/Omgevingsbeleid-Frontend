import React, { Component } from 'react'


// https://hptechblogs.com/using-json-web-token-react/

export default function withAuth(AuthComponent) {

  return class AuthWrapped extends Component {
  
    constructor() {
      super();
      this.state = {
          user: null
      }
    }

    // Checks if there is a saved token
    loggedIn() {
      const token = this.getToken() // Gets token from localstorage

      if (!!token) {
        console.log("%cLogged in!", "background-color: green; color: white; padding: 2px; border-radius: 3px; font-size: 12px;")
      } else {
        console.log("%cNot Logged in!", "background-color: red; color: white; padding: 2px; border-radius: 3px; font-size: 12px;")
      }

      return !!token // If token exists
    }

    // Retrieve token from the local storage
    getToken() {
      return localStorage.getItem('access_token')
    }

  	componentWillMount() {
      if (!this.loggedIn()) {
        this.props.history.push('/login')
      }
  	}

	  render() {
      return (
        <AuthComponent history={this.props.history} />
      )
		}

  }

}