import React from 'react'

class Weblink extends React.Component {
    render() {
        return (
            <div className="block py-2 border-b no-underline">
                <h4 className="text-gray-800 font-bold text-sm">
                    {this.props.UITitle}
                </h4>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.props.UIContent}
                    className="text-gray-700 text-sm block truncate"
                >
                    {this.props.UIContent}
                </a>
            </div>
        )
    }
}

export default Weblink
