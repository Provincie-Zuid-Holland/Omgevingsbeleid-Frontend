import React, { Component } from 'react'

class ViewFieldTags extends Component {
    render() {
        return (
            <div className="mt-8">
                <h2 className="block tracking-wide text-gray-700 text-lg font-serif mb-2">
                    Tags
                </h2>
                <div className="flex mt-3">
                    {JSON.parse(this.props.fieldValue).map(item => (
                        <div className="bg-gray-300 text-gray-700 text-sm rounded px-4 py-2 mr-4">
                            {item.value}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default ViewFieldTags
