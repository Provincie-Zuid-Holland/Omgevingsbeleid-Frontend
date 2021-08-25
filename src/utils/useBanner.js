import React from "react"
import { useLocation } from "react-router-dom"

const useBanner = (graphIsOpen) => {
    const location = useLocation()
    const pathname = location.pathname

    const [locationEqualsMutateEnv, setLocationEqualsMutateEnv] =
        React.useState(false)

    React.useEffect(() => {
        const userIsInMuteer =
            pathname.includes("muteer") || pathname.includes("login")
        setLocationEqualsMutateEnv(userIsInMuteer)
    }, [pathname])

    React.useEffect(() => {
        const header = document.getElementById("navigation-main")
        const doc = document.documentElement
        const w = window

        let prevScroll = w.scrollY || doc.scrollTop
        let prevDirection = 0
        let direction = 0
        let curScroll

        const checkScroll = () => {
            /*
             ** Find the direction of scroll
             ** 0 - initial, 1 - up, 2 - down
             */

            curScroll = w.scrollY || doc.scrollTop
            if (curScroll > prevScroll) {
                //scrolled up
                direction = 2
            } else if (curScroll < prevScroll) {
                //scrolled down
                direction = 1
            }

            if (direction !== prevDirection) {
                toggleHeader(direction, curScroll)
            }

            toggleShadow(curScroll)

            prevScroll = curScroll
        }

        const toggleShadow = (currScroll) => {
            // If user is in the muteer environment we don't want to show a shadow
            if (locationEqualsMutateEnv) return

            if (currScroll > 94) {
                header.classList.add("soft-shadow-navigation")
                header.classList.remove("shadow-navigation")
            } else if (currScroll < 94) {
                if (!header.classList.contains("shadow-navigation")) {
                    header.classList.remove("soft-shadow-navigation")
                    header.classList.add("shadow-navigation")
                }
            } else if (!header.classList.contains("shadow-navigation")) {
                header.classList.remove("soft-shadow-navigation")
                header.classList.add("shadow-navigation")
            }
        }

        const toggleHeader = (direction, curScroll) => {
            if (direction === 2 && curScroll > 94) {
                header.classList.add("hide-nav")
                prevDirection = direction
            } else if (direction === 1) {
                header.classList.remove("hide-nav")
                prevDirection = direction
            }
        }

        window.addEventListener("scroll", checkScroll)

        return () => {
            window.removeEventListener("scroll", checkScroll)
        }
    }, [locationEqualsMutateEnv])

    React.useEffect(() => {
        if (graphIsOpen) {
            const header = document.getElementById("navigation-main")
            header.classList.remove("transition-all", "duration-200", "ease-in")
            header.classList.remove("hide-nav")
            window.setTimeout(
                () =>
                    header.classList.add(
                        "transition-all",
                        "duration-200",
                        "ease-in"
                    ),
                100
            )
        }
    }, [graphIsOpen])

    return { locationEqualsMutateEnv }
}

export default useBanner
