import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { useUpdateEffect } from 'react-use'

const Axe = () => {
    const [mutationCount, setMutationCount] = useState(0) // State variable to track DOM mutations

    // Create a MutationObserver and observe the entire document for DOM mutations
    const observer = useRef(
        new MutationObserver(() => {
            setMutationCount(count => count + 1) // Increment the mutation count
        })
    )

    observer.current.observe(document, { subtree: true, childList: true })

    useUpdateEffect(() => {
        let axeRunning = false

        const runAxe = () => {
            if (!axeRunning) {
                axeRunning = true
                import('@axe-core/react').then(axe =>
                    axe.default(React, ReactDOM, 0).then(() => {
                        axeRunning = false
                    })
                )
            }
        }

        runAxe() // Run axe immediately on page load, route changes, and DOM mutations

        // Clean up the effect by disconnecting the MutationObserver
        return () => {
            axeRunning = true // Prevent future runs of axe
            observer.current.disconnect()
        }
    }, [mutationCount]) // Include mutationCount as dependencies in useUpdateEffect

    return null
}

export default Axe
