import React from "react"
import { Link } from "react-router-dom"

import Container from "./../../components/Container"
import Heading from "./../../components/Heading"
import Text from "./../../components/Text"

function Footer({ className = "" }) {
    /**
     * We want the footer to always be at the bottom of the page,
     * even if there is not enough content. To realise this we position
     * the Footer absolute at the bottom, and give the body a padding-bottom of the current Footer height.
     */
    const footerRef = React.useRef(null)

    React.useEffect(() => {
        const mainContainerEl = document.getElementById("main-container")

        const handleWindowResize = () => {
            if (!footerRef.current || !mainContainerEl) return
            const footerHeight = footerRef.current.offsetHeight
            mainContainerEl.style.paddingBottom = `${footerHeight}px`
        }

        /** Initial call */
        handleWindowResize()
        window.addEventListener("resize", handleWindowResize)

        return () => {
            if (mainContainerEl) {
                mainContainerEl.style.paddingBottom = `0px` // Reset padding bottom
            }
            window.removeEventListener("resize", handleWindowResize)
        }
    }, [])

    return (
        <div
            className={`w-full bg-pzh-cool-gray-light bg-opacity-30 absolute bottom-0`}
            ref={footerRef}
        >
            <Container
                className={`pt-8 pb-16 md:pb-12 md:py-8 ${className}`}
                widthFull={true}
            >
                <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <Heading level="3" color="text-pzh-blue">
                        Elke dag beter.{" "}
                        <span className="inline-block">Zuid-Holland.</span>
                    </Heading>
                </div>
                <div className="grid grid-cols-4 col-span-6 md:col-span-3 lg:col-span-4">
                    <div className="col-span-6 lg:col-span-2">
                        <ul className="mt-6 underline text-pzh-green md:mt-0">
                            <li className="pb-3 md:pb-5">
                                <a
                                    href="https://www.zuid-holland.nl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Provincie Zuid-Holland
                                </a>
                            </li>
                            <li className="pb-3 md:pb-5">
                                <Link to="#">Cookies & Privacy</Link>
                            </li>
                            <li className="pb-3 md:pb-5">
                                <Link to="#">Toegankelijkheidsverklaring</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-6 lg:col-span-2">
                        <Text type="body">
                            Mocht u aan- of opmerkingen hebben, dan horen wij
                            dat graag via{" "}
                            <a
                                href="mailto:omgevingsbeleid@pzh.nl?subject=Aan- of opmerking"
                                className="underline cursor-pointer text-pzh-green"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                omgevingsbeleid@pzh.nl
                            </a>
                        </Text>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Footer
