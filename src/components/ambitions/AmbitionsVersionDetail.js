import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AmbitionsVersionDetail extends Component {
  
  render() {
    
    return (

      <div className="w-3/4 inline-block pr-8">
        <div className="relative inline-block w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white">

          <h1 className="text-xl font-bold text-gray-800">{this.props.ambitie.length !== 0 ? this.props.ambitie.Titel : "Loading..." }</h1>
          <p className="pt-2">{this.props.ambitie.length !== 0 ? this.props.ambitie.Omschrijving : "Loading..." }</p>

        </div>
      </div>

    );
  }
}

export default AmbitionsVersionDetail;