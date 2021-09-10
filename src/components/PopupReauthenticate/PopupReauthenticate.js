import React, { Component } from "react"
import LoginForm from "./../LoginForm"

// setLoginState is passed from App
/**
 * Displays a popup that the user's session is timed out and an option to log back in.
 *
 * @param {function} setLoginState - Function to edit the login state in the parent.
 */
const PopupReauthenticate = ({ setLoginState }) => {
    return (
        <React.Fragment>
            <div className="absolute top-0 left-0 z-40 w-full h-full bg-gray-900 opacity-50"></div>
            <div className="absolute top-0 left-0 z-40 flex items-center justify-center w-full h-full">
                <div className="p-5 text-gray-700 bg-white rounded">
                    <h2 className="mb-2 text-xl font-bold">Opnieuw inloggen</h2>
                    <p>
                        De sessie is verlopen. U kunt hieronder opnieuw
                        inloggen.
                    </p>
                    <LoginForm setLoginState={setLoginState} />
                </div>
            </div>
        </React.Fragment>
    )
}

PopupReauthenticate.propTypes = {}

PopupReauthenticate.defaultProps = {}

export default PopupReauthenticate
