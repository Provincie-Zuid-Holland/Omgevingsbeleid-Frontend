import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Function that can be called to bring the user's screen to the top of the page.
 *
 * @function
 */
export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
