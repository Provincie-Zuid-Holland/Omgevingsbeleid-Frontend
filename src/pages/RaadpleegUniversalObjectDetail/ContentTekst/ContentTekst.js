import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ContentTekst extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                {this.props.titel ? (
                    <h2 className="text-l font-serif">{this.props.titel}</h2>
                ) : null}
                <p>{this.props.content}</p>
            </div>
        )
    }
}

ContentTekst.propTypes = {}

ContentTekst.defaultProps = {}

export default ContentTekst
