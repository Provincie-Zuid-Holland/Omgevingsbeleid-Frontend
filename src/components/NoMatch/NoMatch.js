import React, { Component } from 'react'
import PropTypes from 'prop-types'

class NoMatch extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        console.log('testpagina')
        return (
            <div className="w-full h-full flex justify-center items-center text-xl font-bold">
                De pagina kon niet gevonden worden.
            </div>
        )
    }
}

NoMatch.propTypes = {}

NoMatch.defaultProps = {}

export default NoMatch
