import { Component } from 'react'

class ContentTekst extends Component {
    render() {
        return (
            <div className="mt-6 text-gray-800">
                {this.props.titel ? (
                    <h2 className="block mb-3 text-lg">{this.props.titel}</h2>
                ) : null}
                <p>{this.props.content}</p>
            </div>
        )
    }
}

export default ContentTekst
