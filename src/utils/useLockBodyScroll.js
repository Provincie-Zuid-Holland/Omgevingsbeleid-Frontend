import { useLayoutEffect } from "react"

function useLockBodyScroll({ modalOpen }) {
    useLayoutEffect(() => {
        // Get original html overflow
        const originalStyle = window.getComputedStyle(
            document.getElementsByTagName("html")[0]
        ).overflow

        // Prevent scrolling on mount
        if (modalOpen) {
            document.getElementsByTagName("html")[0].style.overflow = "hidden"
        }

        // Re-enable scrolling when component unmounts
        return () => {
            document.getElementsByTagName("html")[0].style.overflow =
                originalStyle
        }
    }, [modalOpen]) // Empty array ensures effect is only run on mount and unmount
}

export default useLockBodyScroll
