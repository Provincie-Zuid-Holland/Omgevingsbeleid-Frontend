import React, { Component } from 'react';

import SidebarVersion from './../SidebarVersion';
import AmbitionsVersionDetail from './AmbitionsVersionDetail';
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


class AmbitionsVersion extends Component {
  
  state = {
    res_ambitie: []
  }

  componentDidMount() {

    let ambitie_version = this.props.match.params.version;

    // Connect with API
	  instance.get(`ambities/version/${ambitie_version}`)
		.then(res => {
      const res_ambitie = res.data;
      this.setState({ res_ambitie });
      console.log(this.state);
    }).catch((error) => {
			if (error.response.status === 401) {
        localStorage.removeItem('access_token')
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
          <BackToButton url={'/ambities/' + this.props.match.params.single} terugNaar="geldende Ambitie"/>
  	      <div className="flex mt-3">
  	      	<AmbitionsVersionDetail ambitie={this.state.res_ambitie} ambitie_id={this.props.match.params.single}/>
  	      	<SidebarVersion ambitie={this.state.res_ambitie} ambitieVersies={this.state} />
  		    </div>
        </div>

		  </div>
      
    );
  }


}


export default AmbitionsVersion;