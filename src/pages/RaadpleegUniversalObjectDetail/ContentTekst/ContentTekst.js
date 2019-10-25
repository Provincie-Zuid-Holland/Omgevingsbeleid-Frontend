import React, { Component } from 'react'

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

export default ContentTekst
