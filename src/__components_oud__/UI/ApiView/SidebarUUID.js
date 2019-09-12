import React from 'react'

class SidebarString extends React.Component {
    render() {
        return (
            <div className="block pb-2 border-b no-underline">
                <h4 className="text-gray-800 font-bold text-sm">
                    {this.props.UITitle}
                </h4>
                <p className="text-gray-700 text-sm">{this.props.UIContent}</p>
            </div>
        )
    }
}

export default SidebarString
