import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Function that can be called to bring the user's screen to the top of the page.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'instant',
        })
    }, [pathname])

    return null
}
