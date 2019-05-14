import React, { Component } from 'react';

import SidebarVersion from './../SidebarVersion';
import AmbitionsVersionDetail from './AmbitionsVersionDetail';
import axios from 'axios';
import MainSidebar from './../MainSidebar';
import TerugNaarOverzicht from './../TerugNaarOverzicht'

// Set config defaults when creating the instance
const instance = axios.create();
 
class AmbitionsVersion extends Component {
  
  state = {
    res_ambitie: []
  }

  componentDidMount() {

    let ambitie_version = this.props.match.params.version;
    
    const access_token = localStorage.getItem('access_token');

    // Connect with API
	  instance.get(`${'https://cors-anywhere.herokuapp.com/'}http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1/ambities/version/${ambitie_version}`, { headers: { Authorization: `Token ${access_token}` } })
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
        <div className="w-3/4 rounded inline-block flex-grow pl-8"> 
          <TerugNaarOverzicht />
  	      <div className="container mx-auto flex">
  	      	<SidebarVersion ambitie={this.state.res_ambitie} ambitieVersies={this.state} />
  	      	<AmbitionsVersionDetail ambitie={this.state.res_ambitie} ambitie_id={this.props.match.params.single}/>
  		    </div>
        </div>
		  </div>
    );
  }

}

export default AmbitionsVersion;