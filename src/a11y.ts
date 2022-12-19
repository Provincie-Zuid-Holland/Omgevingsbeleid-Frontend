/* istanbul ignore file */
// If environment is not Production and not running Jest

export default function useAxe() {
    const React = require('react')
    const ReactDOM = require('react-dom')

    React.useEffect(() => {
        const axe = require('@axe-core/react')

        // Using requestAnimationFrame to ensure that
        // axe runs after the page has finished rendering
        const runAxe = () => {
            axe(React, ReactDOM)
            requestAnimationFrame(runAxe)
        }
        requestAnimationFrame(runAxe)
    })
}
