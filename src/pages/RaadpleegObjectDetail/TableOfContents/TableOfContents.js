import React from "react"
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Text from "../../../components/Text"

import { useWindowSize } from "../../../utils/useWindowSize"

const TableOfContents = () => {
    const windowSize = useWindowSize()

    const [style, setStyle] = React.useState({})
    const [h2Elements, setH2Elements] = React.useState([])

    const container = React.useRef(null)

    /** Get x and y of sidebar container */
    React.useEffect(() => {
        if (!container.current) return
        const rect = container.current.getBoundingClientRect()
        setStyle({
            x: rect.x,
            y: rect.y,
            width: rect.width,
        })
    }, [container, windowSize])

    /** Get all H2 elements on the page and set in state */
    React.useEffect(() => {
        const navHeight =
            document.getElementById("navigation-main")?.offsetHeight

        if (!navHeight) return

        setH2Elements(
            Array.from(document.querySelectorAll("h2")).map((el) => ({
                title: el.textContent,
                id: el.id,
                y: el.getBoundingClientRect().y - navHeight - 20, // 20 Pixels extra offset
            }))
        )
    }, [])

    return (
        <div
            className="relative hidden col-span-1 mt-12 lg:block"
            ref={container}
        >
            <div
                className="fixed z-10"
                style={{
                    top: style.y,
                    left: style.x,
                    width: style.width,
                }}
            >
                <Text
                    type="span"
                    className="block font-bold"
                    color="text-pzh-blue-dark"
                >
                    Op deze pagina
                </Text>
                <nav>
                    <ul>
                        {h2Elements.map((el) => (
                            <li
                                key={el.id}
                                onClick={() => {
                                    window.scrollTo({
                                        left: 0,
                                        top: el.y,
                                        behavior: "smooth",
                                    })
                                }}
                                className="pt-1 cursor-pointer text-pzh-blue hover:text-pzh-blue-dark"
                            >
                                <FontAwesomeIcon
                                    icon={faAngleRight}
                                    className="absolute text-lg"
                                    style={{ marginTop: "0.1rem" }}
                                />
                                <span className="block pl-4 underline underline-thin">
                                    {el.title}
                                </span>
                            </li>
                        ))}
                        <li className="flex items-start py-1 transition-colors duration-100 ease-in text-pzh-blue hover:text-pzh-blue-dark"></li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default TableOfContents