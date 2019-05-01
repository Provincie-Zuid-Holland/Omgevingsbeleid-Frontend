import React, { Component } from 'react';

import Sidebar from './../Sidebar';
import Detail from './OpgavenDetail';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create();
 
class OpgavenSingle extends Component {
  
  state = {
    res_ambitie: []
  }

  componentDidMount() {

  	let ambitie_id = this.props.match.params.single;

    const access_token = localStorage.getItem('access_token');
    // Connect with API
	  instance.get(`${'https://cors-anywhere.herokuapp.com/'}http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1/opgaven/${ambitie_id}`, { headers: { Authorization: `Token ${access_token}` } })
		.then(res => {
      const res_ambitie = res.data;
      this.setState({ res_ambitie });
      console.log(this.state);
    }).catch((error) => {
			console.log(error);
		})
	}


  render() {
    return (
      <div className="container mx-auto flex">
      	<Sidebar ambitie={this.state.res_ambitie} />
      	<Detail ambitie={this.state.res_ambitie} ambitie_id={this.props.match.params.single} />
	    </div>
    );
  }
}

export default OpgavenSingle;