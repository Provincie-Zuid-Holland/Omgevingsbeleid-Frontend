import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MainSidebar from './../MainSidebar';
import TerugNaarOverzicht from './../TerugNaarOverzicht'

class AmbitionsDetail extends Component {
  render() {
    return (

      <div className="w-3/4 inline-block pr-8">
        <div className="relative inline-block w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white">
          <h1 className="text-xl font-bold text-gray-800">
            {this.props.ambitie[0] ? this.props.ambitie[0].Titel : "Loading..." }
          </h1>
          <p className="pt-2">
            {this.props.ambitie[0] ? this.props.ambitie[0].Omschrijving : "Loading..." }
            </p>
          <Link to={'/ambities/edit/' + this.props.ambitie_id } className="mt-4 mr-4 font-bold py-2 px-4 text-sm rounded bg-blue-200 text-blue-700 absolute top-0 right-0">
        		Edit
        	</Link>
        </div>
      </div>

    );
  }
}

export default AmbitionsDetail;