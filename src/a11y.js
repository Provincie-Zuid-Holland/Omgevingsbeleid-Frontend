/* istanbul ignore file */
// If environment is not Production and not running Jest
if (
    process.env.NODE_ENV !== 'production' &&
    process.env.JEST_WORKER_ID === undefined
) {
    const React = require('react')
    const ReactDOM = require('react-dom')
    const axe = require('@axe-core/react')

    axe(React, ReactDOM, 1000)
}
