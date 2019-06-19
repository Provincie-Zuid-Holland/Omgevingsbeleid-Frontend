import React from 'react';

class SelectInput extends React.Component {

  render() {

    return (
        <div className="w-full mb-6">

            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={this.props.dataObjectProperty}>
                {this.props.fieldLabel}
            </label>

            <div className="inline-block relative w-64">
                <select 
                    required
                    value={this.props.fieldValue}
                    onChange={this.props.handleChange} 
                    name={this.props.dataObjectProperty } 
                    className="block appearance-none w-full bg-white text-gray-700 border border-gray-400 hover:border-gray-500 py-3 px-4 leading-tight rounded leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option selected> - selecteer een optie - </option>
                {
                    this.props.selectArray.map((arrayItem, index) => {
                        return (
                            <option key={index} value={arrayItem[0]}>{arrayItem[1]}</option>
                        )
                    })
                }    
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>

        </div>
    )
  }

}

export default SelectInput;