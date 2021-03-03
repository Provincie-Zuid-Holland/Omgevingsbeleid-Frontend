import React from 'react'
import { Helmet } from 'react-helmet'

// Import Components
import LoginForm from './../../components/LoginForm'

/**
 * Component page that imports the component LoginForm, so the user is able to login the application and reset the password when needed.
 * This component renders the title of the page (using the imported Helmet libary, to get the plain HTML tag and output the plain HTML tag), other tags with given text information and the imported LoginForm component with set information.
 *
 * @param {function} setLoginUser Callback to set user state in App component state
 * @param {function} setLoginState Callback to set login state in App component state
 */
const Login = ({ setLoginUser, setLoginState }) => {
    return (
        <div className="container flex flex-wrap mx-auto mt-4 rounded">
            <Helmet>
                <title>Login - Omgevingsbeleid - Provincie Zuid-Holland</title>
            </Helmet>
            <div className="w-1/2 pb-8 pl-0 pr-10 lg:pl-10 md:pl-10 xs:pl-10">
                <h1 className="my-4 font-serif text-2xl text-gray-800">
                    Inloggen
                </h1>
                <p className="text-gray-700">
                    Als beleidsmedewerker van provincie Zuid-Holland kun je hier
                    inloggen om te werken aan het Omgevingsbeleid.
                </p>

                <LoginForm
                    setLoginUser={setLoginUser}
                    setLoginState={setLoginState}
                />
            </div>
            <div className="fixed login-afbeelding" />
        </div>
    )
}

export default Login
