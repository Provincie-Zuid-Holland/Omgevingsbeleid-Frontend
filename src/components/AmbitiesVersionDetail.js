import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AmbitiesVersionDetail extends Component {
  render() {
    return (
      
      <div className="pb-8 px-8">
        <h1>{this.props.ambitie ? this.props.ambitie.Titel : "Loading..." }</h1>
        <p className="pt-6">{this.props.ambitie ? this.props.ambitie.Omschrijving : "Loading..." }</p>
      </div>

    );
  }
}

export default AmbitiesVersionDetail;