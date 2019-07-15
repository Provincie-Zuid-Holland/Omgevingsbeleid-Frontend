import React from 'react'

class MainTitel extends React.Component {
    render() {
        return (
            <h1 className="text-xl font-bold text-gray-800">
                {this.props.titel}
            </h1>
        )
    }
}

export default MainTitel
