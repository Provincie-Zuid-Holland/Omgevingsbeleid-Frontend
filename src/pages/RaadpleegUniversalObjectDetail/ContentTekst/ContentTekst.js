import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ContentTekst extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="mt-6 text-gray-800">
                {this.props.titel ? (
                    <h2 className="text-lg font-serif block mb-3">
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
