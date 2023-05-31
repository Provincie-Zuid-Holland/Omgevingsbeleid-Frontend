import { Heading, Text } from '@pzh-ui/components'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import LoginForm from '@/components/LoginForm'
import useBreakpoint from '@/hooks/useBreakpoint'

/**
 * Component page that imports the component LoginForm, so the user is able to login the application and reset the password when needed.
 * This component renders the title of the page (using the imported Helmet libary, to get the plain HTML tag and output the plain HTML tag), other tags with given text information and the imported LoginForm component with set information.
 */

const Login = () => {
    const { isMobile } = useBreakpoint()

    return (
        <>
            <Container
                className={classNames('overflow-hidden', {
                    'min-h-[576px]': !isMobile,
                })}>
                <div className="col-span-6 lg:pb-12 lg:col-span-3">
                    <Heading level="1" className="mt-4 sm:mt-12 lg:mt-16">
                        Inloggen
                    </Heading>
                    <Text type="introduction-paragraph" className="mt-3 mb-8">
                        Als beleidsmedewerker van provincie Zuid-Holland kun je
                        hier inloggen om te werken aan het Omgevingsbeleid.
                    </Text>
                    <LoginForm />
                </div>
                <div className="relative hidden col-span-3 lg:inline-block">
                    <div
                        className={`absolute bg-cover bg-no-repeat bg-center left-0 top-0 h-full image-login-1 text-white sm:inline-block`}
                        style={{
                            height: '480px',
                            width: 'calc(50vw)',
                        }}
                    />
                </div>
            </Container>
            <div className="block w-full h-64 bg-center bg-no-repeat bg-cover bg-pzh-blue lg:hidden image-login-1"></div>

            <Container className="border-t border-gray-300">
                <div className="col-span-6 py-4 mt-4 lg:mt-0 lg:py-12 lg:col-span-3">
                    <Heading as="2" level="3">
                        Digitaal Omgevingsbeleid
                    </Heading>
                    <Text type="body" className="mt-3">
                        Provincie Zuid-Holland heeft haar beleid eenvoudiger,
                        transparanter en toegankelijker gemaakt. Via deze
                        website kan je al het Omgevingsbeleid van de provincie
                        Zuid-Holland inzien.
                    </Text>
                    <Link
                        className="block mt-4 underline hover:text-pzh-green-dark text-pzh-green"
                        to="/">
                        Ga naar de raadpleegomgeving
                    </Link>
                </div>
                <div className="col-span-6 py-4 mt-4 mb-4 lg:mt-0 lg:py-12 lg:col-span-3">
                    <Heading as="2" level="3">
                        Hulp bij het inloggen
                    </Heading>
                    <Text type="body" className="mt-3">
                        Lukt het niet om in te loggen? Neem contact op met de
                        afdeling omgevingsbeleid via{' '}
                        <a
                            href="mailto:omgevingsbeleid@pzh.nl?subject=Hulp bij het inloggen"
                            className="underline cursor-pointer hover:text-pzh-green-dark text-pzh-green"
                            target="_blank"
                            rel="noopener noreferrer">
                            omgevingsbeleid@pzh.nl
                        </a>
                    </Text>
                </div>
            </Container>
        </>
    )
}

export default Login
