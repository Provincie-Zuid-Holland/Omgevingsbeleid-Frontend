import decode from 'jwt-decode';
import axios from 'axios';

export default class Auth {

    // Initializing important variables
    constructor(domain) {
        this.domain = domain || 'api-acctest-ob.westeurope.cloudapp.azure.com/dev'
        this.fetch = this.fetch.bind(this)
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    // Gets the token from the API server
    login(identifier, password) {

        return this.fetch(`${this.domain}/v0.1/login`, {
            method: 'POST',
            body: JSON.stringify({
                identifier,
                password
            })
        }).then(res => {
            this.setToken(res.access_token) // Set token in local storage
            return Promise.resolve(res);
        })
    }

    // Checks if there is a saved token
    loggedIn() {
        const token = this.getToken() // Gets token from localstorage
        return !!token // If token exists
    }

    // Save token to local storage
    setToken(idToken) {
        localStorage.setItem('Token', idToken)
    }

    // Retrieve token from the local storage
    getToken() {
        return localStorage.getItem('Token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('Token');
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Token xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Token ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    // raises an error in case response status is not a success
    _checkStatus(response) {
        
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

}