import React from 'react';

class SelectInput extends React.Component {

  render() {

    return (
        <div className="flex pb-8 mb-8 border-b-2 border-gray-300">
            <div className="w-1/3 pr-20">
                <h4 className="m-color font-bold mb-2 text-lg">
                    {/* Algemene informatie */}
                    {this.props.titel}
                </h4>
                <p className="text-gray-800">
                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  */}
                    {this.props.beschrijving}
                </p>
            </div>
            <div className="w-2/3">
                {this.props.children}
            </div>
        </div>
    )
  }

}

export default SelectInput;