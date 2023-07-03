import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

const Axe = () => {
    useEffect(() => {
        let axeRunning = false

        // Using requestAnimationFrame to ensure that
        // axe runs after the page has finished rendering
        const runAxe = () => {
            if (!axeRunning) {
                axeRunning = true
                import('@axe-core/react').then(axe =>
                    axe.default(React, ReactDOM, 0).then(() => {
                        axeRunning = false
                    })
                )
            }
            requestAnimationFrame(runAxe)
        }
        requestAnimationFrame(runAxe)
    })

    return null
}

export default Axe
