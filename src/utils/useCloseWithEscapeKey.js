import React, { useEffect } from 'react'

function useCloseWithEscapeKey(ref, callback) {
    useEffect(() => {
        const handleKeyEvent = (e) => {
            if (ref.current && e.code === 'Escape') {
                callback()
            }
        }

        // Bind the event listener
        document.addEventListener('keydown', handleKeyEvent)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('keydown', handleKeyEvent)
        }
    }, [ref])
}

export default useCloseWithEscapeKey
