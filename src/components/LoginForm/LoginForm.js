import React from "react"
import { useHistory } from "react-router-dom"

import { faTimes } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Import API
import axios from "./../../API/axios"

// Import Components
import LoaderSpinner from "./../LoaderSpinner"
import PopUpAnimatedContainer from "./../PopUpAnimatedContainer"

/**
 * Function that renders the PopupWachtwoordVergeten component, which displays a popup in which the user can reset their password.
 *
 * @param {boolean} show - Parameter that is used to display the popup component.
 * @param {function} togglePopup - Parameter that is used to (hide/show) the popup component.
 */
function PopupWachtwoordVergeten({ show, togglePopup }) {
    // Set focus to the cancel button for AY11
    React.useEffect(() => {
        if (show) document.getElementById("close-password-forget-popup").focus()
    }, [show])

    if (!show) return null

    return (
        <PopUpAnimatedContainer small={true}>
            <button
                onClick={togglePopup}
                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer hover:text-gray-800 pzh-transition-colors"
                id={`wachtwoord-reset-sluit-popup`}
                data-testid={`wachtwoord-reset-sluit-popup`}
                tabIndex="0"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3 className="mb-4 text-xl font-bold text-gray-800">
                Wachtwoord vergeten
            </h3>

            <div className="relative p-4 mb-4 border-l-4 bg-pzh-blue-super-light border-pzh-blue">
                <p className="mt-1 text-sm text-gray-700">
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
                    className="text-sm text-gray-700 underline cursor-pointer hover:text-gray-900 pzh-transition-colors"
                    onClick={togglePopup}
                    id="close-password-forget-popup"
                    data-testid="close-password-forget-popup"
                >
                    Annuleren
                </button>
                <button
                    href="mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten"
                    className="inline-block px-8 py-2 text-white rounded pzh-transition-colors bg-pzh-green hover:bg-pzh-green-dark focus:outline-none focus:shadow-outline"
                    id="wachtwoord-reset-button-mailto"
                    data-testid="wachtwoord-reset-button-mailto"
                    onClick={togglePopup}
                >
                    Mail versturen
                </button>
            </div>
        </PopUpAnimatedContainer>
    )
}

/**
 * Component that renders a login form in which the user can log into the application.
 *
 * @param {function} setLoginState - Function to edit parent state.
 * @param {function} setLoginUser - Function to edit parent state.
 */
const LoginForm = ({ setLoginState, setLoginUser }) => {
    const history = useHistory()

    const [identifier, setIdentifier] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [wachtwoordResetPopup, setWachtwoordResetPopup] =
        React.useState(false)

    const displayErrorMsg = (err) => {
        let errorEl = document.getElementById("error-message")
        errorEl.classList.innerHTML = err
        errorEl.classList.remove("hidden")
        errorEl.classList.add("flex")
        errorEl.classList.add("shake")
        setTimeout(function () {
            errorEl.classList.remove("shake")
        }, 820)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()

        setLoading(true)

        axios
            .post(
                "login",
                JSON.stringify({
                    identifier: identifier,
                    password: password,
                })
            )
            .then((response) => {
                console.log(`Environment - ${response.data["deployment type"]}`)
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
                    setLoading(false)
                    setLoginState(true)
                    setLoginUser(identifier)
                    history.push("/muteer/dashboard")
                }
            })
            .catch((err) => {
                displayErrorMsg(err)
                setLoading(false)
            })
    }

    const handleErrorMessage = (e) => {
        let errorEl = document.getElementById("error-message")
        errorEl.classList.add("hidden")
        errorEl.classList.remove("flex")
    }

    return (
        <React.Fragment>
            <PopupWachtwoordVergeten
                show={wachtwoordResetPopup}
                togglePopup={() =>
                    setWachtwoordResetPopup(!wachtwoordResetPopup)
                }
            />
            <form className="my-8" onSubmit={handleFormSubmit}>
                <div>
                    <label
                        className="block mb-2 text-sm font-bold text-pzh-blue"
                        htmlFor="form-field-login-email"
                    >
                        E-mailadres
                    </label>
                    <input
                        required
                        className="w-full px-3 py-2 leading-loose bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        name="email"
                        id="form-field-login-email"
                        data-testid="form-field-login-email"
                        type="text"
                        placeholder="bijv. j.doe@pzh.nl"
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                </div>
                <div className="my-6">
                    <label
                        className="block mb-2 text-sm font-bold text-pzh-blue"
                        htmlFor="form-field-login-password"
                    >
                        Wachtwoord
                    </label>
                    <input
                        required
                        className="w-full px-3 py-2 leading-loose bg-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                        name="password"
                        id="form-field-login-password"
                        data-testid="form-field-login-password"
                        type="password"
                        placeholder="******************"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center">
                    <button
                        className="inline-block px-8 pt-2 pb-2 text-white transition-colors duration-200 ease-in rounded bg-pzh-blue hover:bg-pzh-blue-dark focus:outline-none focus:shadow-outline"
                        type="submit"
                        id="form-field-login-submit"
                        data-testid="form-field-login-submit"
                    >
                        {loading ? (
                            <span alt="laden..." className="mr-2">
                                <LoaderSpinner />
                            </span>
                        ) : null}
                        Inloggen
                        {loading ? "..." : ""}
                    </button>
                    <button
                        className="ml-4 text-sm underline cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault()
                            setWachtwoordResetPopup(!wachtwoordResetPopup)
                        }}
                        tabIndex="0"
                    >
                        Ik ben mijn wachtwoord vergeten
                    </button>
                </div>
            </form>
            <div
                id="error-message"
                data-testid="error-message"
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
                        onClick={handleErrorMessage}
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

export default LoginForm
