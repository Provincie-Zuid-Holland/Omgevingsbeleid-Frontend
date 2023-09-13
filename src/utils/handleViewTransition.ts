import { flushSync } from 'react-dom'

const handleViewTransition = (callback: () => void) => {
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            flushSync(() => {
                callback()
            })
        })
        // If view transitions aren't supported (e.g. mobile safari), we just update the state.
    } else {
        callback()
    }
}

export default handleViewTransition
