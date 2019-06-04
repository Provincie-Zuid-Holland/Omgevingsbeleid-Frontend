import React from 'react';

class TextArea extends React.Component {

  render() {
    
    return (
        <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={this.props.dataObjectProperty}>
                  {this.props.fieldLabel}
                </label>
                <textarea value={this.props.fieldValue} required onChange={this.props.handleChange} name={this.props.dataObjectProperty} className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" type="text" placeholder="Type hier uw text"/>
            </div>
        </div>
    )
  }

}

export default TextArea;