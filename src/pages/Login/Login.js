import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// Import API
import axios from './../../API/axios'

// Import Components
import LoaderSpinner from './../../components/LoaderSpinner'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            identifier: '',
            password: '',
            loading: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleErrorMessage = this.handleErrorMessage.bind(this)
        this.resetLoadingState = this.resetLoadingState.bind(this)
    }

    resetLoadingState() {
        this.setState({
            loading: false,
        })
    }

    handleFormSubmit(e) {
        e.preventDefault()

        this.setState({
            loading: true,
        })

        let history = this.props.history

        axios
            .post('login', JSON.stringify(this.state))
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    const identifier = response.data.identifier
                    const tokenTime = new Date()
                    localStorage.setItem(
                        'identifier',
                        JSON.stringify(identifier)
                    )
                    localStorage.setItem(
                        'access_token',
                        response.data.access_token
                    )
                    localStorage.setItem('token_date', tokenTime)
                    this.resetLoadingState()
                    this.props.setLoginState(true)
                    this.props.history.push('/muteer/dashboard')
                } else if (response.status === 401) {
                    this.resetLoadingState()
                    throw Error('Wrong username or password')
                } else {
                    this.resetLoadingState()
                    throw Error('Something went wrong, please try again later')
                }
            })
            .catch(err => {
                console.log('err:')
                console.log(err)
                let errorEl = document.getElementById('error-message')
                errorEl.classList.innerHTML = err
                errorEl.classList.remove('hidden')
                errorEl.classList.add('flex')
                errorEl.classList.add('shake')
                setTimeout(function() {
                    errorEl.classList.remove('shake')
                }, 820)
                this.resetLoadingState()
            })
    }

    handleErrorMessage(e) {
        let errorEl = document.getElementById('error-message')
        errorEl.classList.add('hidden')
        errorEl.classList.remove('flex')
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    render() {
        return (
            <div className="container mx-auto mt-4 px-6 rounded flex flex-wrap">
                <Helmet>
                    <title>Omgevingsbeleid - Login</title>
                </Helmet>
                <div className="w-1/2 pr-20 pb-8">
                    <h1 className="font-serif my-4 font-thin text-gray-800 text-2xl">
                        Inloggen
                    </h1>
                    <p className="text-gray-700">
                        Als beleidsmedewerker bij de provincie Zuid-Holland, of
                        als Statenlid van de provincie Zuid-Holland kun je hier
                        inloggen om in de cloud te werken aan het
                        Omgevingsbeleid.
                    </p>
                    <form className="my-8" onSubmit={this.handleFormSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="identifier"
                            >
                                E-mailadres
                            </label>
                            <input
                                required
                                className="bg-white shadow appearance-none border rounded w-full py-3 leading-loose px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="identifier"
                                id="form-field-login-email"
                                type="text"
                                placeholder="bijv. j.doe@pzh.nl"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="mb-4 mt-6">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="password"
                            >
                                Wachtwoord
                            </label>
                            <input
                                required
                                className="bg-white shadow appearance-none border rounded w-full py-4 pb-3 leading-loose px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                name="password"
                                id="form-field-login-password"
                                type="password"
                                placeholder="******************"
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="">
                            <button
                                className="mbg-color hover:bg-blue-600 text-white inline-block py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                id="form-field-login-submit"
                            >
                                {this.state.loading ? <LoaderSpinner /> : null}
                                Inloggen
                            </button>
                        </div>
                    </form>
                    <div
                        id="error-message"
                        className="container items-center justify-center hidden"
                    >
                        <div
                            className="bg-red-lightest w-full border border-red-light pr-10 text-red-600 px-4 py-3 rounded relative inline-block"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                Verkeerde e-mailadres of wachtwoord
                            </span>
                            <span
                                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                onClick={this.handleErrorMessage}
                            >
                                <svg
                                    className="fill-current h-6 w-6 text-red"
                                    role="button"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <title>Sluiten</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    {/* <div className="mt-20 bottom-0">
                        <span className="font-bold block">
                            Veelgestelde vragen
                        </span>
                        <span className="underline">
                            Iets met wachtwoord vergeten / Uitleg over inloggen
                        </span>
                    </div> */}
                </div>
                <div className="login-afbeelding fixed" />
            </div>
        )
    }
}
export default Login
