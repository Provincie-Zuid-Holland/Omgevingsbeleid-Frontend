import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AmbitionsDetail extends Component {

  render() {

    return (
      
      <div className="pb-8 px-8 relative w-full">
        <h1>{this.props.ambitie[0] ? this.props.ambitie[0].Titel : "Loading..." }</h1>
        <p className="pt-6">{this.props.ambitie[0] ? this.props.ambitie[0].Omschrijving : "Loading..." }</p>
        <Link to={'/ambities/edit/' + this.props.ambitie_id } className="bg-white mt-4 block text-center hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border no-underline border-gray-400 rounded shadow absolute top-0 right-0">
      		Edit
      	</Link>
      </div>

    );
    
  }
}

export default AmbitionsDetail;