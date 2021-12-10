import React from "react"
import { Link } from "react-router-dom"
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons"
import { faAngleRight } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import axios from "./../../API/axios"

import LoaderSpinner from "./../../components/LoaderSpinner"
import Heading from "./../../components/Heading"
import Container from "./../../components/Container"
import Text from "./../../components/Text"
import Footer from "./../../components/Footer"
import LoaderCard from "./../../components/LoaderCard"

import handleError from "../../utils/handleError"

function RaadpleegUniversalObjectOverview({ dataModel }) {
    const [isLoading, setIsLoading] = React.useState(true)
    const [allObjects, setAllObjects] = React.useState([])

    React.useEffect(() => {
        setIsLoading(true)

        axios
            .get(dataModel.API_ENDPOINT_VIGEREND)
            .then((res) => {
                setAllObjects(res.data)
                setIsLoading(false)
            })
            .catch((err) => handleError(err))
    }, [dataModel])

    return (
        <div>
            <Container className="pb-16">
                <div className="col-span-6 sm:col-span-1">
                    <Link
                        to="/"
                        className="inline-block mt-4 duration-100 ease-in opacity-50 cursor-pointer focus-within:transition sm:mt-8 text-pzh-blue-dark hover:opacity-75"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        <span>Start</span>
                    </Link>
                </div>
                <div className="col-span-6 sm:col-span-4">
                    <Heading className="mt-4 sm:mt-8" level="1">
                        {dataModel.TITLE_PLURAL}
                    </Heading>
                    <Text className="mt-3 md:mt-4">
                        {dataModel.DESCRIPTION}
                        {console.log(dataModel)}
                    </Text>
                    <div className="mt-8">
                        <div className="flex flex-col justify-between sm:flex-row">
                            <Heading level="3">
                                {isLoading
                                    ? `De ${dataModel.TITLE_PLURAL.toLowerCase()} worden geladen`
                                    : `De ${allObjects.length} ${dataModel.TITLE_PLURAL}`}
                                {isLoading ? (
                                    <LoaderSpinner className="ml-2" />
                                ) : null}
                            </Heading>
                            <Link
                                className="block mt-2 mb-1 sm:mb-0 sm:mt-0"
                                to="/zoekresultaten"
                            >
                                <Text
                                    className="underline"
                                    color="text-pzh-green"
                                >
                                    uitgebreid zoeken
                                </Text>
                            </Link>
                        </div>
                        <ul className="mt-2">
                            {isLoading ? (
                                <div className="mt-6">
                                    <LoaderCard height="25" />
                                    <LoaderCard height="25" />
                                    <LoaderCard height="25" />
                                </div>
                            ) : (
                                allObjects.map((obj) => (
                                    <li className="flex items-start py-1 transition-colors duration-100 ease-in text-pzh-blue hover:text-pzh-blue-dark">
                                        <FontAwesomeIcon
                                            icon={faAngleRight}
                                            className="relative mr-2 text-lg"
                                            style={{ marginTop: "0.1rem" }}
                                        />
                                        <Link
                                            to={`/detail/${dataModel.SLUG_OVERVIEW}/${obj.UUID}`}
                                            className="underline underline-thin"
                                        >
                                            {obj.Titel}
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </Container>
            <Footer className="mt-8" />
        </div>
    )
}

export default RaadpleegUniversalObjectOverview
