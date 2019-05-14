import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AmbitionsVersionDetail extends Component {
  
  render() {
    
    return (

      <div className="pb-8 px-8">
        {console.log(this.props.ambitie)}
        <h1>{this.props.ambitie.length !== 0 ? this.props.ambitie.Titel : "Loading..." }</h1>
        <p className="pt-6">{this.props.ambitie.length !== 0 ? this.props.ambitie.Omschrijving : "Loading..." }</p>
        <Link to={'/ambities/'} className="bg-white mt-4 block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow absolute top-0 right-0">
      		Edit
      	</Link>
      </div>

    );
  }
}

export default AmbitionsVersionDetail;