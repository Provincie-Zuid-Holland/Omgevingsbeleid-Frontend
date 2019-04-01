import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AmbitiesDetail extends Component {
  render() {
    return (
      
      <div className="pb-8 px-8">
        <h1>{this.props.ambitie[0] ? this.props.ambitie[0].Titel : "Loading..." }</h1>
        <p className="pt-6">{this.props.ambitie[0] ? this.props.ambitie[0].Omschrijving : "Loading..." }</p>
      </div>

    );
  }
}

export default AmbitiesDetail;