import { Heading, Text } from '@pzh-ui/components'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import usePage from '@/hooks/usePage'

import { Container } from '../Container'

function Footer() {
    const userIsInMuteerEnvironment = usePage('/muteer')

    return (
        <footer className="w-full mt-auto bg-pzh-cool-gray-light/30">
            <Container
                className={classNames({
                    'pt-8 pb-16 md:pb-12 md:py-8': !userIsInMuteerEnvironment,
                    'py-10': userIsInMuteerEnvironment,
                })}>
                <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <Heading level="3" color="text-pzh-blue">
                        Elke dag beter.{' '}
                        <span className="inline-block">Zuid-Holland.</span>
                    </Heading>
                </div>
                {!userIsInMuteerEnvironment && (
                    <div className="grid grid-cols-4 col-span-6 md:col-span-3 lg:col-span-4">
                        <div className="col-span-6 lg:col-span-2">
                            <ul className="mt-6 font-bold text-pzh-blue md:mt-0">
                                <li className="pb-3 underline hover:text-pzh-blue-dark md:pb-5">
                                    <a
                                        href="https://www.zuid-holland.nl"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Provincie Zuid-Holland
                                    </a>
                                </li>
                                <li className="pb-3 underline hover:text-pzh-blue-dark md:pb-5">
                                    <a
                                        rel="noopener noreferrer"
                                        href="https://www.zuid-holland.nl/algemeen/privacyverklaring/"
                                        target="_blank">
                                        Cookies & Privacy
                                    </a>
                                </li>
                                <li className="pb-3 underline hover:text-pzh-blue-dark md:pb-5">
                                    <Link to="/digi-toegankelijkheid">
                                        Toegankelijkheidsverklaring
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-6 lg:col-span-2">
                            <Text type="body">
                                Mocht je aan- of opmerkingen hebben, dan horen
                                wij dat graag via{' '}
                                <a
                                    href="mailto:omgevingsbeleid@pzh.nl?subject=Aan- of opmerking"
                                    className="underline cursor-pointer hover:text-pzh-blue-dark text-pzh-blue"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    omgevingsbeleid@pzh.nl
                                </a>
                            </Text>
                        </div>
                    </div>
                )}
            </Container>
        </footer>
    )
}

export default Footer
