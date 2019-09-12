import React from 'react'

class TextInput extends React.Component {
    render() {
        return (
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                    <label
                        className="form-field-label"
                        htmlFor={this.props.dataObjectProperty}
                    >
                        {this.props.fieldLabel}
                    </label>
                    <p className="form-field-description">
                        {`${
                            this.props.pValue
                        } ${this.props.titelEnkelvoud.toLowerCase()}`}
                    </p>
                    <input
                        required
                        value={this.props.fieldValue}
                        onChange={this.props.handleChange}
                        name={this.props.dataObjectProperty}
                        className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500"
                        id="titel"
                        type="text"
                        placeholder={this.props.fieldLabel}
                    />
                </div>
            </div>
        )
    }
}

export default TextInput
