import React from 'react';
import { format } from 'date-fns'

class DateInput extends React.Component {

  render() {
    
    return (
      <div className="w-50 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={this.props.dataObjectProperty}>
            {this.props.fieldLabel}
          </label>
          <input 
            required 
            value={format(this.props.fieldValue, "YYYY-MM-DD")} 
            onChange={this.props.handleChange} 
            name={this.props.dataObjectProperty} 
            className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" 
            type="date"
          />
      </div>
    )
  }

}
export default DateInput;