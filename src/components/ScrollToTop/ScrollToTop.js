import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Function that can be used to change the position of the user to the top of the page.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}
