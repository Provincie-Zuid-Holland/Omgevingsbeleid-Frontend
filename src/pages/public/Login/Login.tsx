import { Heading, Text } from '@pzh-ui/components'
import classNames from 'clsx'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'
import LoginForm from '@/components/LoginForm'
import { strings } from '@/constants/strings'
import useBreakpoint from '@/hooks/useBreakpoint'

/**
 * Component page that imports the component LoginForm, so the user is able to login the application and reset the password when needed.
 * This component renders the title of the page (using the imported Helmet libary, to get the plain HTML tag and output the plain HTML tag), other tags with given text information and the imported LoginForm component with set information.
 */

const Login = () => {
    const { isMobile } = useBreakpoint()

    return (
        <>
            <Helmet title="Inloggen" />

            <Container
                className={classNames('overflow-hidden', {
                    'min-h-[576px]': !isMobile,
                })}>
                <div className="col-span-6 lg:col-span-3 lg:pb-12">
                    <Heading
                        level="1"
                        size="xxl"
                        className="mt-4 sm:mt-12 lg:mt-16">
                        Inloggen
                    </Heading>
                    <Text size="l" className="mb-8 mt-3">
                        Als beleidsmedewerker van provincie Zuid-Holland kun je
                        hier inloggen om te werken aan het Omgevingsbeleid.
                    </Text>
                    <LoginForm />
                </div>
                <div className="relative col-span-3 hidden lg:inline-block">
                    <div className="image-login-1 absolute left-0 top-0 h-[480px] w-[50vw] bg-cover bg-center bg-no-repeat text-white sm:inline-block" />
                </div>
            </Container>
            <div className="image-login-1 block h-64 w-full bg-pzh-blue-500 bg-cover bg-center bg-no-repeat lg:hidden" />

            <Container className="border-t border-pzh-gray-300">
                <div className="col-span-6 mt-4 py-4 lg:col-span-3 lg:mt-0 lg:py-12">
                    <Heading level="2" size="m">
                        Digitaal Omgevingsbeleid
                    </Heading>
                    <Text className="mt-3">
                        Provincie Zuid-Holland heeft haar beleid eenvoudiger,
                        transparanter en toegankelijker gemaakt. Via deze
                        website kan je al het Omgevingsbeleid van de provincie
                        Zuid-Holland inzien.
                    </Text>
                    <Link
                        className="mt-4 block text-pzh-green-500 underline hover:text-pzh-green-900"
                        to="/">
                        Ga naar de raadpleegomgeving
                    </Link>
                </div>
                <div className="col-span-6 mb-4 mt-4 py-4 lg:col-span-3 lg:mt-0 lg:py-12">
                    <Heading level="2" size="m">
                        Hulp bij het inloggen
                    </Heading>
                    <Text className="mt-3">
                        Lukt het niet om in te loggen? Neem contact op met de
                        afdeling omgevingsbeleid via{' '}
                        <a
                            href={`mailto:${strings.LBL_EMAIL}?subject=Hulp bij het inloggen`}
                            className="cursor-pointer text-pzh-green-500 underline hover:text-pzh-green-900"
                            target="_blank"
                            rel="noopener noreferrer">
                            {strings.LBL_EMAIL}
                        </a>
                    </Text>
                </div>
            </Container>
        </>
    )
}

export default Login
