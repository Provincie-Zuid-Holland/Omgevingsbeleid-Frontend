import React from 'react'

function useEventListener(target, type, listener, ...options) {
    React.useEffect(() => {
        const targetIsRef = target.hasOwnProperty('current')
        const currentTarget = targetIsRef ? target.current : target
        if (currentTarget)
            currentTarget.addEventListener(type, listener, ...options)
        return () => {
            if (currentTarget)
                currentTarget.removeEventListener(type, listener, ...options)
        }
    }, [target, type, listener, options])
}

export default useEventListener
