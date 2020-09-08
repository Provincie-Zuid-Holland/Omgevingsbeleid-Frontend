import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import API
import axios from './../../API/axios'

// Import Components
import LoaderSpinner from './../LoaderSpinner'
import PopUpAnimatedContainer from './../PopUpAnimatedContainer'

function PopupWachtwoordVergeten({ togglePopup }) {
    // Set focus to the cancel button for AY11
    React.useEffect(() => {
        document.getElementById('close-password-forget-popup').focus()
    }, [])

    return (
        <PopUpAnimatedContainer small={true}>
            <button
                onClick={togglePopup}
                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                id={`wachtwoord-reset-sluit-popup`}
                tabIndex="0"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Wachtwoord vergeten
            </h3>

            <div className="relative p-4 mb-4 border-l-4 purple-light-bg-color purple-border-color">
                <p className="mt-2 text-sm text-gray-700">
                    Binnenkort willen wij het mogelijk maken dat medewerkers van
                    provincie Zuid-Holland automatisch kunnen inloggen. Tot die
                    tijd moet het nog met een e-mailadres en een wachtwoord.
                </p>
            </div>

            <p className="py-1 text-gray-700">
                Wachtwoord vergeten? Stuur dan een e-mail naar het team
                Omgevingsbeleid door op de link te klikken. Je ontvangt dan
                binnen één werkdag een nieuw wachtwoord.
            </p>
            <div className="flex items-center justify-between mt-5">
                <button
                    className="text-sm text-gray-700 underline cursor-pointer"
                    onClick={togglePopup}
                    id="close-password-forget-popup"
                >
                    Annuleren
                </button>
                <button
                    href="mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten"
                    className="inline-block px-8 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
                    id="wachtwoord-reset-button-mailto"
                    onClick={togglePopup}
                >
                    Mail versturen
                </button>
            </div>
        </PopUpAnimatedContainer>
    )
}

class LoginForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            identifier: '',
            password: '',
            loading: false,
            wachtwoordResetPopup: false,
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleErrorMessage = this.handleErrorMessage.bind(this)
        this.resetLoadingState = this.resetLoadingState.bind(this)
        this.togglePopup = this.togglePopup.bind(this)
    }

    togglePopup() {
        this.setState({
            wachtwoordResetPopup: !this.state.wachtwoordResetPopup,
        })
    }

    resetLoadingState() {
        this.setState({
            loading: false,
        })
    }

    logDeployementType(type) {
        console.log(`Environment - ${type}`)
    }

    handleFormSubmit(e) {
        e.preventDefault()

        this.setState({
            loading: true,
        })

        axios
            .post('login', JSON.stringify(this.state))
            .then((response) => {
                this.logDeployementType(response.data['deployment type'])

                if (response.status >= 200 && response.status < 300) {
                    let identifier = response.data.identifier

                    localStorage.setItem(
                        process.env.REACT_APP_KEY_IDENTIFIER,
                        JSON.stringify(identifier)
                    )
                    localStorage.setItem(
                        process.env.REACT_APP_KEY_API_ACCESS_TOKEN,
                        response.data.access_token
                    )
                    const tokenTime = new Date()
                    localStorage.setItem('__OB_token_date__', tokenTime)
                    this.resetLoadingState()
                    this.props.setLoginState(true)
                    this.props.setLoginUser(identifier)
                    this.props.history.push('/muteer/dashboard')
                }
            })
            .catch((err) => {
                const displayErrorMsg = () => {
                    let errorEl = document.getElementById('error-message')
                    errorEl.classList.innerHTML = err
                    errorEl.classList.remove('hidden')
                    errorEl.classList.add('flex')
                    errorEl.classList.add('shake')
                    setTimeout(function () {
                        errorEl.classList.remove('shake')
                    }, 820)
                }

                displayErrorMsg()
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
            <React.Fragment>
                {this.state.wachtwoordResetPopup ? (
                    <PopupWachtwoordVergeten togglePopup={this.togglePopup} />
                ) : null}
                <form className="my-8" onSubmit={this.handleFormSubmit}>
                    <div className="mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="identifier"
                        >
                            E-mailadres
                        </label>
                        <input
                            required
                            className="w-full px-3 py-3 leading-tight leading-loose text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            name="identifier"
                            id="form-field-login-email"
                            type="text"
                            placeholder="bijv. j.doe@pzh.nl"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="mt-6 mb-4">
                        <label
                            className="block mb-2 text-sm font-bold text-gray-700"
                            htmlFor="password"
                        >
                            Wachtwoord
                        </label>
                        <input
                            required
                            className="w-full px-3 py-4 pb-3 mb-3 leading-tight leading-loose text-gray-700 bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            name="password"
                            id="form-field-login-password"
                            type="password"
                            placeholder="******************"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="flex items-center">
                        <button
                            className="inline-block px-8 py-2 text-white rounded mbg-color mbg-color-darker-hover focus:outline-none focus:shadow-outline"
                            type="submit"
                            id="form-field-login-submit"
                        >
                            {this.state.loading ? (
                                <span className="mr-2">
                                    <LoaderSpinner />
                                </span>
                            ) : null}
                            Inloggen
                        </button>
                        <button
                            className="ml-4 text-sm text-gray-700 underline cursor-pointer hover:text-gray-800"
                            onClick={(e) => {
                                e.preventDefault()
                                this.togglePopup()
                            }}
                            tabIndex="0"
                        >
                            Ik ben mijn wachtwoord vergeten
                        </button>
                    </div>
                </form>
                <div
                    id="error-message"
                    className="container items-center justify-center hidden"
                >
                    <div
                        className="relative inline-block w-full px-4 py-3 pr-10 text-red-600 border rounded bg-red-lightest border-red-light"
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
                                className="w-6 h-6 fill-current text-red"
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
            </React.Fragment>
        )
    }
}

export default withRouter(LoginForm)
