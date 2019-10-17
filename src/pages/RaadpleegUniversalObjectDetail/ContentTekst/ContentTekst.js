import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ContentTekst extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="mt-4 text-gray-800">
                {this.props.titel ? (
                    <h2 className="text-l font-serif block mb-2">
                        {this.props.titel}
                    </h2>
                ) : null}
                <p>{this.props.content}</p>
            </div>
        )
    }
}

ContentTekst.propTypes = {}

ContentTekst.defaultProps = {}

export default ContentTekst
