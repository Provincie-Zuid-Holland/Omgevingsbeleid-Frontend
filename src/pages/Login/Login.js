import React from 'react'
import { Helmet } from 'react-helmet'

// Import Components
import LoginForm from './../../components/LoginForm'

const Login = ({ setLoginUser, setLoginState }) => {
    return (
        <div className="container flex flex-wrap mx-auto mt-4 rounded">
            <Helmet>
                <title>Omgevingsbeleid - Login</title>
            </Helmet>
            <div className="w-1/2 pb-8 pl-0 pr-10 lg:pl-10 md:pl-10 xs:pl-10">
                <h1 className="my-4 font-serif text-2xl text-gray-800">
                    Inloggen
                </h1>
                <p className="text-gray-700">
                    Als beleidsmedewerker bij de provincie Zuid-Holland, of als
                    Statenlid van de provincie Zuid-Holland kun je hier inloggen
                    om in de cloud te werken aan het Omgevingsbeleid.
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
