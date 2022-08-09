import { Heading, Text } from '@pzh-ui/components'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { Container } from '../Container'

interface FooterProps {
    className?: string
}

function Footer({ className = '' }: FooterProps) {
    /**
     * We want the footer to always be at the bottom of the page,
     * even if there is not enough content. To realise this we position
     * the Footer absolute at the bottom, and give the body a padding-bottom of the current Footer height.
     */
    const footerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mainContainerEl = document.getElementById('main-container')

        const handleWindowResize = () => {
            if (!footerRef.current || !mainContainerEl) return
            const footerHeight = footerRef.current.offsetHeight
            mainContainerEl.style.paddingBottom = `${footerHeight}px`
        }

        /** Initial call */
        handleWindowResize()
        window.addEventListener('resize', handleWindowResize)

        return () => {
            if (mainContainerEl) {
                mainContainerEl.style.paddingBottom = `0px` // Reset padding bottom
            }
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [])

    return (
        <footer
            className={`w-full bg-pzh-cool-gray-light bg-opacity-30 absolute bottom-0`}
            ref={footerRef}>
            <Container className={`pt-8 pb-16 md:pb-12 md:py-8 ${className}`}>
                <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <Heading level="3" color="text-pzh-blue">
                        Elke dag beter.{' '}
                        <span className="inline-block">Zuid-Holland.</span>
                    </Heading>
                </div>
                <div className="grid grid-cols-4 col-span-6 md:col-span-3 lg:col-span-4">
                    <div className="col-span-6 lg:col-span-2">
                        <ul className="mt-6 text-pzh-blue md:mt-0 font-bold">
                            <li className="pb-3 hover:text-pzh-blue-dark md:pb-5">
                                <a
                                    href="https://www.zuid-holland.nl"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Provincie Zuid-Holland
                                </a>
                            </li>
                            <li className="pb-3 hover:text-pzh-blue-dark md:pb-5">
                                <a
                                    rel="noopener noreferrer"
                                    href="https://www.zuid-holland.nl/algemeen/privacyverklaring/"
                                    target="_blank">
                                    Cookies & Privacy
                                </a>
                            </li>
                            <li className="pb-3 hover:text-pzh-blue-dark md:pb-5">
                                <Link to="/digi-toegankelijkheid">
                                    Toegankelijkheidsverklaring
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-6 lg:col-span-2">
                        <Text type="body">
                            Mocht je aan- of opmerkingen hebben, dan horen wij
                            dat graag via{' '}
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
            </Container>
        </footer>
    )
}

export default Footer
