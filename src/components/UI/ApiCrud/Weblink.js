import React from 'react'

class Weblink extends React.Component {
    render() {
        return (
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="weblink"
                    >
                        {this.props.fieldLabel}
                    </label>
                    <input
                        required
                        value={this.props.fieldValue}
                        onChange={this.props.handleChange}
                        name="Weblink"
                        className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500"
                        type="text"
                        placeholder="https://www.google.nl"
                    />
                </div>
            </div>
        )
    }
}

export default Weblink
