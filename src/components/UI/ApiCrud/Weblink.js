import React from 'react';

class Weblink extends React.Component {

  render() {

    return (
        <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="weblink">
                    {this.props.fieldLabel}
                </label>
                <input required value={this.props.fieldValue} onChange={this.props.handleChange} name="Weblink" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-500" id="weblink" type="text" placeholder="https://www.nu.nl"/>
            </div>
        </div>
    )
  }

}

export default Weblink;