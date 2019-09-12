import React from 'react'

class HeadingMain extends React.Component {
    render() {
        return (
            <h1 className="text-xl font-bold text-gray-800 inline-block">
                {this.props.titel}
            </h1>
        )
    }
}

export default HeadingMain
