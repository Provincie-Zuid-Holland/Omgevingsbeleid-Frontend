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
                        <div className="inline-block px-2 py-1 text-xs text-indigo-900 border border-indigo-900 rounded">
                            {this.props.status}
                        </div>
                    ) : (
                        <div className="inline-block px-2 py-1 text-xs border rounded text-secondary border-secondary">
                            {this.props.status}
                        </div>
                    )
                ) : null}
            </h1>
        )
    }
}

export default HeadingMain
