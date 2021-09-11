import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"

// Import Components
import LoginForm from "./../../components/LoginForm"
import Heading from "./../../components/Heading"
import Text from "./../../components/Text"
import Container from "./../../components/Container"
import Footer from "./../../components/Footer"

/**
 * Component page that imports the component LoginForm, so the user is able to login the application and reset the password when needed.
 * This component renders the title of the page (using the imported Helmet libary, to get the plain HTML tag and output the plain HTML tag), other tags with given text information and the imported LoginForm component with set information.
 *
 * @param {function} setLoginUser Callback to set user state in App component state
 * @param {function} setLoginState Callback to set login state in App component state
 */
const Login = ({ setLoginUser, setLoginState }) => {
    return (
        <>
            <Container
                style={{
                    minHeight: "576px",
                }}
                className="overflow-hidden"
            >
                <div className="col-span-3 mb-8">
                    <Heading level="1" className="mt-16">
                        Inloggen
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3">
                        Als beleidsmedewerker van provincie Zuid-Holland kunt u
                        hier inloggen om te werken aan het Omgevingsbeleid.
                    </Text>
                    <LoginForm
                        setLoginUser={setLoginUser}
                        setLoginState={setLoginState}
                    />
                </div>
                <div className="relative col-span-3">
                    <div
                        className={`absolute bg-cover bg-no-repeat bg-center left-0 top-0 h-full image-login-1 text-white sm:inline-block`}
                        style={{
                            height: "480px",
                            width: "calc(50vw - 1rem)",
                        }}
                    />
                </div>
            </Container>

            <Container className="border-t border-gray-300">
                <div className="col-span-3 py-12">
                    <Heading level="2" className="">
                        Digitaal Omgevingsbeleid
                    </Heading>
                    <Text type="body" className="mt-3">
                        Provincie Zuid-Holland heeft haar beleid eenvoudiger,
                        transparanter en toegankelijker gemaakt. Via deze
                        website kunt u al het Omgevingsbeleid van de provincie
                        Zuid-Holland inzien.
                    </Text>
                    <Link className="underline text-pzh-green">
                        Ga naar de raadpleegomgeving
                    </Link>
                </div>
                <div className="relative col-span-3 py-12">
                    <Heading level="2">Hulp bij het inloggen</Heading>
                    <Text type="body" className="mt-3">
                        Lukt het niet om in te loggen? Neem contact op met de
                        afdeling omgevingsbeleid via{" "}
                        <a
                            href="mailto:omgevingsbeleid@pzh.nl?subject=Hulp bij het inloggen"
                            className="underline cursor-pointer text-pzh-green"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            omgevingsbeleid@pzh.nl
                        </a>
                    </Text>
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default Login
