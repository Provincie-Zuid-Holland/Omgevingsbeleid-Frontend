import { Feedback, Heading, Text } from '@pzh-ui/components'
import classNames from 'clsx'
import { Link } from 'react-router-dom'

import usePage from '@/hooks/usePage'

import { Container } from '../Container'

function Footer() {
    const userIsInMuteerEnvironment = usePage('/muteer')
    const isAdvancedSearchPage = usePage('/zoeken-op-kaart')

    return (
        <footer
            className={classNames('z-1 mt-auto w-full bg-pzh-gray-200', {
                'has-feedback':
                    !userIsInMuteerEnvironment && !isAdvancedSearchPage,
            })}>
            <Container
                className={classNames({
                    'pb-16 pt-8 md:py-8 md:pb-12': !userIsInMuteerEnvironment,
                    'py-10': userIsInMuteerEnvironment,
                })}>
                <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <Heading level="3" size="m" color="text-pzh-blue-500">
                        Krachtig Zuid-Holland
                    </Heading>
                </div>
                {!userIsInMuteerEnvironment && (
                    <div className="col-span-6 grid grid-cols-4 md:col-span-3 lg:col-span-4">
                        <div className="col-span-6 lg:col-span-2">
                            <ul className="mt-6 grid gap-3 font-bold text-pzh-blue-500 md:mt-0 md:gap-5">
                                <li className="underline hover:text-pzh-blue-900">
                                    <a
                                        href="https://www.zuid-holland.nl"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        Provincie Zuid-Holland
                                    </a>
                                </li>
                                <li className="underline hover:text-pzh-blue-900">
                                    <a
                                        rel="noopener noreferrer"
                                        href="https://www.zuid-holland.nl/algemeen/privacyverklaring/"
                                        target="_blank">
                                        Cookies & Privacy
                                    </a>
                                </li>
                                <li className="underline hover:text-pzh-blue-900">
                                    <Link to="/digi-toegankelijkheid">
                                        Toegankelijkheidsverklaring
                                    </Link>
                                </li>
                                <li className="underline hover:text-pzh-blue-900">
                                    <Link to="/planning-en-releases">
                                        Releases en planning
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-6 mt-4 lg:col-span-2 lg:mt-0">
                            <Text>
                                Mocht je aan- of opmerkingen hebben, dan horen
                                wij dat graag via{' '}
                                <a
                                    href="mailto:omgevingsbeleid@pzh.nl?subject=Aan- of opmerking"
                                    className="cursor-pointer text-pzh-blue-500 underline hover:text-pzh-blue-900"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    omgevingsbeleid@pzh.nl
                                </a>
                            </Text>
                        </div>
                    </div>
                )}
            </Container>

            {!userIsInMuteerEnvironment && !isAdvancedSearchPage && (
                <div role="region">
                    <Feedback
                        email="omgevingsbeleid@pzh.nl"
                        website="obzh.nl"
                    />
                </div>
            )}
        </footer>
    )
}

export default Footer
