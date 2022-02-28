export default function useAxe() {
    const React = require('react')
    const ReactDOM = require('react-dom')

    React.useEffect(() => {
        const axe = require('@axe-core/react')
        // axe(React, ReactDOM, 1000) // FIXME https://github.com/dequelabs/react-axe/issues/183
        const timer = setInterval(() => {
            axe(React, ReactDOM)
        }, 1500)

        // clearing interval
        return () => clearInterval(timer)
    })
}
