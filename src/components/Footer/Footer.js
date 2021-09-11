import React from "react"
import { Link } from "react-router-dom"

import Container from "./../../components/Container"
import Heading from "./../../components/Heading"
import Text from "./../../components/Text"

function Footer() {
    return (
        <>
            <Container className="py-8 bg-pzh-cool-gray-light bg-opacity-30">
                <div className="col-span-2">
                    <Heading level="3" color="text-pzh-blue">
                        Elke dag beter. Zuid-Holland.
                    </Heading>
                </div>
                <div className="col-span-2">
                    <ul className="underline text-pzh-green">
                        <li className="pb-5">
                            <a
                                href="https://www.zuid-holland.nl"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Provincie Zuid-Holland
                            </a>
                        </li>
                        <li className="pb-5">
                            <Link to="#">Cookies & Privacy</Link>
                        </li>
                        <li className="pb-5">
                            <Link to="#">Toegankelijkheidsverklaring</Link>
                        </li>
                    </ul>
                </div>
                <div className="col-span-2">
                    <Text type="body">
                        Mocht u aan- of opmerkingen hebben, dan horen wij dat
                        graag via{" "}
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
            </Container>
        </>
    )
}

export default Footer
