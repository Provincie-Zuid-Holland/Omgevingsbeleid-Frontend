import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Notificatie extends Component {
    constructor(props) {
        super(props)
    }
    null
    render() {
        return (
            <div className="w-full border border-red-500 bg-red-100 text-red-500 px-4 py-2 rounded mt-4 text-sm">
                {this.props.children}
            </div>
        )
    }
}

Notificatie.propTypes = {}

Notificatie.defaultProps = {}

export default Notificatie
