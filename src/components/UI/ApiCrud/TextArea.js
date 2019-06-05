import React from 'react';

class TextArea extends React.Component {

  render() {
    
    return (
        <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={this.props.dataObjectProperty}>
                  {this.props.fieldLabel}
                </label>
                <textarea 
                  value={this.props.fieldValue} 
                  required 
                  onChange={this.props.handleChange} 
                  name={this.props.dataObjectProperty} 
                  className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500" 
                  type="text" 
                  placeholder={`Type hier uw ${this.props.fieldLabel.toLowerCase()}`}/>
            </div>
        </div>
    )
  }

}

export default TextArea;