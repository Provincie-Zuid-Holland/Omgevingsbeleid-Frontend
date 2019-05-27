import React, { Component } from 'react';

import Sidebar from './../Sidebar';
import Detail from './AmbitionsDetail';
import axios from 'axios';
import MainSidebar from './../MainSidebar';
import BackToButton from './../UI/BackToButton'


// Set config defaults when creating the instance
const access_token = localStorage.getItem('access_token');
const api_version = 'v0.1';
const instance = axios.create({
  baseURL: `http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/${api_version}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${access_token}`
  }
});

 
class AmbitionsSingle extends Component {
  
  state = {
    res_ambitie: []
  }

  componentDidMount() {

  	let ambitie_id = this.props.match.params.single;

    // Connect with API
	  instance.get(`ambities/${ambitie_id}`)
		.then(res => {
      const res_ambitie = res.data;
      this.setState({ res_ambitie });
      console.log(this.state);
    }).catch((error) => {
      if (error.response !== undefined) {
        if (error.response.status === 401) {
          localStorage.removeItem('access_token')
        }
      } else {
        console.log(error);
      }
		})
	}


  render() {
    return (
      <div className="container mx-auto flex px-6 pb-8">      
        {/* Sidebar */}
        <MainSidebar />

        {/* Ambition Container */}
        <div className="w-3/4 rounded inline-block pl-8">
          <BackToButton terugNaar="ambitie overzicht" url="/ambities" />
        	<div className="flex mt-3">
            <Detail ambitie={this.state.res_ambitie} ambitie_id={this.props.match.params.single} />
          	<Sidebar content={this.state.res_ambitie} contentType={"ambities"} />
          </div>
        </div>
	    </div>
    );
  }
}

export default AmbitionsSingle;