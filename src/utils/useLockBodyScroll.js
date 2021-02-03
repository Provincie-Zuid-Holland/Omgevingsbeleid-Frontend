import React, { useLayoutEffect } from 'react'

function useLockBodyScroll({ modalOpen }) {
    useLayoutEffect(() => {
        // Get original body overflow
        const originalStyle = window.getComputedStyle(document.body).overflow

        // Prevent scrolling on mount
        if (modalOpen) {
            document.body.style.overflow = 'hidden'
        }
        // Re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = originalStyle
        }
    }, [modalOpen]) // Empty array ensures effect is only run on mount and unmount
}

export default useLockBodyScroll
