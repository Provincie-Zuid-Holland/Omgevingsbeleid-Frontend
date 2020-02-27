import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

// Import Components
import LoginForm from './../../components/LoginForm'

class Login extends Component {
    render() {
        return (
            <div className="container mx-auto mt-4 rounded flex flex-wrap">
                <Helmet>
                    <title>Omgevingsbeleid - Login</title>
                </Helmet>
                <div className="w-1/2 pr-10 pb-8 pl-0 lg:pl-10 md:pl-10 xs:pl-10">
                    <h1 className="font-serif my-4 text-gray-800 text-2xl">
                        Inloggen
                    </h1>
                    <p className="text-gray-700">
                        Als beleidsmedewerker bij de provincie Zuid-Holland, of
                        als Statenlid van de provincie Zuid-Holland kun je hier
                        inloggen om in de cloud te werken aan het
                        Omgevingsbeleid.
                    </p>

                    <LoginForm setLoginState={this.props.setLoginState} />
                </div>
                <div className="login-afbeelding fixed" />
            </div>
        )
    }
}
export default Login
