import React, { Component } from 'react';

import SidebarVersion from './SidebarVersion';
import AmbitiesVersionDetail from './AmbitiesVersionDetail';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create();

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTM1MDY4MjYsIm5iZiI6MTU1MzUwNjgyNiwianRpIjoiYzFjZWJiYWUtMGJmNC00N2NkLTk4ZTAtZWJmMWE2OGYxODljIiwiZXhwIjoxNTUzNTEwNDI2LCJpZGVudGl0eSI6Ik14X0NhcCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.O6TU5ZzlcrtXee_uJwfVhwrjrtzRqBkXWkcH6skB5NY";

 
class AmbitionsVersion extends Component {
  
  state = {
    res_ambitie: []
  }

  componentDidMount() {

  	console.log("VIEWING AMBITIE MET ID: " + this.props.match.params.single)
    let ambitie_version = this.props.match.params.version;

    // Connect with API
	  instance.get(`${'https://cors-anywhere.herokuapp.com/'}http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1/ambities/version/${ambitie_version}`, { crossdomain: true, header: { 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'} })
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
    	<div>
	      <div className="container mx-auto flex">
	      	<SidebarVersion ambitie={this.state.res_ambitie} ambitieVersies={this.state} />
	      	<AmbitiesVersionDetail ambitie={this.state.res_ambitie} />
		    </div>
		  </div>
    );
  }

}

export default AmbitionsVersion;