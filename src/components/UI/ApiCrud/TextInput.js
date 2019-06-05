import React from 'react';

class TextInput extends React.Component {

  render() {
    console.log(this.props.fieldValue)
    return (
        <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={this.props.dataObjectProperty}>
                    {this.props.fieldLabel}
                </label>
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

export default TextInput;