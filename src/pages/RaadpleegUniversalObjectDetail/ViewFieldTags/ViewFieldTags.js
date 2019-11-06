import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ViewFieldTags extends Component {
    constructor(props) {
        super(props)
    }
    null
    render() {
        return (
            <div className="mt-8">
                <h2 className="block tracking-wide text-gray-700 text-lg font-serif mb-2">
                    {this.props.fieldValue}
                </h2>
                <div className="flex mt-3">
                    {console.log(this.props.fieldValue)}
                    <div className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-4">
                        Grondwater
                    </div>
                    <div className="bg-gray-300 text-gray-700 rounded px-4 py-2 mr-4">
                        Grondwaterheffing
                    </div>
                </div>
            </div>
        )
    }
}

ViewFieldTags.propTypes = {}

ViewFieldTags.defaultProps = {}

export default ViewFieldTags
