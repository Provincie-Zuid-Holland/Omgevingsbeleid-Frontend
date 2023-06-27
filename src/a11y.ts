/* istanbul ignore file */
// If environment is not Production and not running Jest

export default function useAxe() {
    const React = require('react')
    const ReactDOM = require('react-dom')

    React.useEffect(() => {
        const axe = require('@axe-core/react')
        let axeRunning = false

        // Using requestAnimationFrame to ensure that
        // axe runs after the page has finished rendering
        const runAxe = () => {
            if (!axeRunning) {
                axeRunning = true
                axe(React, ReactDOM).then(() => {
                    axeRunning = false
                })
            }
            requestAnimationFrame(runAxe)
        }
        requestAnimationFrame(runAxe)
    })
}
