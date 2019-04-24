import React, { Component } from 'react'
import Auth from './Auth'
import { withRouter } from 'react-router';


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
      return !!token // If token exists
    }

    // Retrieve token from the local storage
    getToken() {
      console.log(localStorage.getItem('access_token'))
      return localStorage.getItem('access_token')
    }

  	componentWillMount() {
      if (!this.loggedIn()) {
        this.props.history.push('/login')
        console.log("Er is geen Access Token gevonden in de local storage! :-(")
      } else {
        console.log("Er is een Access Token gevonden in de local storage! :-)")
      }
  	}

	  render() {
      return (
        <AuthComponent history={this.props.history} />
      )
		}

  }

}