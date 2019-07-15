import React from 'react'

class DateInput extends React.Component {
    render() {
        return (
            <div className="w-50 px-3 mb-6">
                <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor={this.props.dataObjectProperty}
                >
                    {this.props.fieldLabel}
                </label>
                <input
                    required
                    value={this.props.fieldValue}
                    onChange={this.props.handleChange}
                    name={this.props.dataObjectProperty}
                    className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                    type="date"
                />
            </div>
        )
    }
}
export default DateInput
