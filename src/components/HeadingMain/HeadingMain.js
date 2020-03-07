import React from 'react'

// !REFACTOR! status 'Gepubliceerd' verwijderen

class HeadingMain extends React.Component {
    render() {
        return (
            <h1 className="text-xl font-bold text-gray-800">
                <span className="mr-2">{this.props.titel}</span>
                {this.props.status ? (
                    this.props.status === 'Vigerend' ||
                    this.props.status === 'Gepubliceerd' ? (
                        <div className="px-2 py-1 border inline-block text-xs text-indigo-900 rounded border-indigo-900">
                            {this.props.status}
                        </div>
                    ) : (
                        <div className="px-2 py-1 border inline-block text-xs text-yellow-600 rounded border-yellow-600">
                            {this.props.status}
                        </div>
                    )
                ) : null}
            </h1>
        )
    }
}

export default HeadingMain
