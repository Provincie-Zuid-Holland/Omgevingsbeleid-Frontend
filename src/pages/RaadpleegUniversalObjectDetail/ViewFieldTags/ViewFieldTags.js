import React, { Component } from 'react'

class ViewFieldTags extends Component {
    render() {
        return (
            <div className="mt-8">
                <h2 className="block mb-2 text-lg tracking-wide text-gray-700">
                    Tags
                </h2>
                <div className="flex mt-3">
                    {JSON.parse(this.props.fieldValue).map((item) => (
                        <div className="px-4 py-2 mr-4 text-sm text-gray-700 bg-gray-300 rounded">
                            {item.value}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default ViewFieldTags
