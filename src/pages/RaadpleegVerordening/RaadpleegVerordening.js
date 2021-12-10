import React from "react"

import Heading from "./../../components/Heading"
import Text from "./../../components/Text"
import Container from "./../../components/Container"
import Footer from "./../../components/Footer"

import axios from "./../../API/axios"

import VERORDENING from "./../../constants/verordeningen"

import handleError from "../../utils/handleError"

import LoaderCard from "../../components/LoaderCard"
import RaadpleegVerordeningSidebar from "./RaadpleegVerordeningSidebar"
import useQuery from "../../utils/useQuery"
import { useWindowSize } from "../../utils/useWindowSize"

function RaadpleegVerordening({}) {
    const [verordening, setVerordening] = React.useState(null)
    const query = useQuery()
    const windowSize = useWindowSize()

    const activeUUID = query.get("active")

    const scrollIntoView = (activeUUID) => {
        const element = document.getElementById(activeUUID)
        if (!element) return

        const offset = windowSize.width < 1028 ? 60 : 15
        window.scrollTo({
            left: 0,
            top: element.offsetTop - offset,
            behavior: "smooth",
        })
    }

    React.useEffect(() => {
        scrollIntoView(activeUUID)
    }, [activeUUID])

    React.useEffect(() => {
        const initializeState = () => {
            axios
                .get("/verordeningstructuur")
                .then((res) => {
                    const validVerordening = res.data.find(
                        (verordening) => verordening.Status === "Vigerend"
                    )
                    setVerordening(validVerordening)
                })
                .catch((err) => {
                    handleError(err)
                })
        }

        initializeState()
    }, [])

    return (
        <>
            <Container className="pt-16 lg:pt-8">
                <RaadpleegVerordeningSidebar verordening={verordening} />
                <div className="col-span-6 lg:col-span-4">
                    <Heading
                        level="3"
                        className="font-bold"
                        color="text-pzh-blue-dark"
                    >
                        {VERORDENING.TITLE_SINGULAR}
                    </Heading>
                    {verordening ? (
                        <Heading
                            level="1"
                            color="text-pzh-blue"
                            className="mt-4"
                        >
                            {verordening.Titel}
                        </Heading>
                    ) : (
                        <LoaderCard className="mt-6" />
                    )}
                    {verordening?.Structuur?.Children.map((chapter) => (
                        <VerordeningsSection
                            key={chapter.UUID}
                            section={chapter}
                        />
                    ))}
                </div>
            </Container>
            <Footer />
        </>
    )
}

const VerordeningsSection = ({ section }) => {
    if (section.Type === "Hoofdstuk") {
        return (
            <div className="mt-6 mb-2">
                <div
                    className="relative px-2 pt-2 pb-1 bg-pzh-green-light bg-opacity-10"
                    style={{ width: "calc(100% + 1rem", left: "-0.5rem" }}
                    id={section.UUID}
                >
                    <Heading
                        customStyles={{
                            fontSize: "1rem",
                            lineHeight: "1.5rem",
                        }}
                        level="2"
                        color="text-pzh-green"
                        className="font-bold"
                    >
                        {`${section.Type} ${section.Volgnummer}. ${section.Titel}`}
                    </Heading>
                </div>
                {section?.Children.length > 0
                    ? section.Children.map((child) => (
                          <VerordeningsSection
                              key={child.UUID}
                              section={child}
                          />
                      ))
                    : null}
            </div>
        )
    } else if (section.Type === "Paragraaf" || section.Type === "Afdeling") {
        return (
            <div className="mt-4 mb-2">
                <div
                    className="relative px-2 pt-2 pb-1 bg-pzh-cool-gray bg-opacity-10"
                    style={{ width: "calc(100% + 1rem", left: "-0.5rem" }}
                    id={section.UUID}
                >
                    <Heading
                        customStyles={{
                            fontSize: "1rem",
                            lineHeight: "1.5rem",
                        }}
                        level="2"
                        color="text-pzh-blue-dark"
                        className="font-bold"
                    >
                        {section.Type === "Paragraaf"
                            ? `§${section.Volgnummer} ${section.Titel}`
                            : `Afdeling ${section.Volgnummer} ${section.Titel}`}
                    </Heading>
                </div>
                {section?.Children.length > 0
                    ? section.Children.map((child) => (
                          <VerordeningsSection
                              key={child.UUID}
                              section={child}
                          />
                      ))
                    : null}
            </div>
        )
    } else if (section.Type === "Artikel") {
        return (
            <div className="mt-6" id={section.UUID}>
                <Heading
                    customStyles={{
                        fontSize: "1rem",
                        lineHeight: "1.5rem",
                    }}
                    level="2"
                    color="text-pzh-blue-dark"
                    className="font-bold"
                >
                    {`Artikel ${section.Volgnummer} ${section.Titel}`}
                </Heading>
                <div className="mt-2">
                    {section?.Children.length > 0 ? (
                        section.Children.map((child) => (
                            <VerordeningsSection
                                key={child.UUID}
                                section={child}
                            />
                        ))
                    ) : (
                        <Text type="body">{section.Inhoud}</Text>
                    )}
                </div>
            </div>
        )
    } else if (section.Type === "Lid") {
        return (
            <div id={section.UUID}>
                <Text className="mt-1" type="body">
                    {section.Inhoud}
                </Text>
            </div>
        )
    } else {
        return null
    }
}

export default RaadpleegVerordening
