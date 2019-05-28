import React from 'react';

class TextInput extends React.Component {

  render() {
    return (
        <div className="flex flex-wrap -mx-3">
            <div className="w-full px-3 mb-4">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
                    {this.props.fieldLabel}
                </label>
                <input required value={this.props.fieldValue} onChange={this.props.handleChange} name="Titel" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="titel" type="text" placeholder="Ambitie Titel"/>
            </div>
        </div>
    )
  }

}

export default TextInput;