import React from "react"
import { faAngleRight } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import Text from "../../../components/Text"

import { useWindowSize } from "../../../utils/useWindowSize"

const TableOfContents = ({ display }) => {
    const windowSize = useWindowSize()

    const [style, setStyle] = React.useState({})
    const [h2Elements, setH2Elements] = React.useState([])

    const container = React.useRef(null)

    /** Get x and y of sidebar container */
    React.useEffect(() => {
        if (!container.current) return

        const rect = container.current.getBoundingClientRect()
        if (display === "block") {
            setStyle({
                display: "block",
            })
        } else if (display === "fixed") {
            setStyle({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                display: "fixed",
            })
        } else {
            throw new Error("No correct display value")
        }
    }, [container, windowSize, display])

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
            className={
                display === "block"
                    ? "col-span-6 p-6 mt-6 bg-pzh-cool-gray-light bg-opacity-30 block xl:hidden"
                    : "relative hidden col-span-1 mt-12 xl:block"
            }
            ref={container}
        >
            <div className="z-10" style={style}>
                <Text
                    type="span"
                    className="block font-bold"
                    color="text-pzh-blue-dark"
                >
                    Op deze pagina
                </Text>
                <nav>
                    <ul
                        className={
                            display === "block"
                                ? "grid grid-cols-2 gap-x-10 gap-y-0 mt-2"
                                : ""
                        }
                    >
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
