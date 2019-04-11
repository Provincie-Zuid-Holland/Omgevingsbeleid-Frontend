import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create();

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTM1MDY4MjYsIm5iZiI6MTU1MzUwNjgyNiwianRpIjoiYzFjZWJiYWUtMGJmNC00N2NkLTk4ZTAtZWJmMWE2OGYxODljIiwiZXhwIjoxNTUzNTEwNDI2LCJpZGVudGl0eSI6Ik14X0NhcCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.O6TU5ZzlcrtXee_uJwfVhwrjrtzRqBkXWkcH6skB5NY";

function testComponent(ambitie) {
	return(
		<div className="mr-4 ml-4 h-full px-4 pb-4 shadow border rounded overflow-hidden bg-white">
		  <div className="py-4">
		    <div className="font-bold text-xl mb-2">{ambitie.Titel}</div>
		    <p className="text-grey-darker text-base">
		      {ambitie.Omschrijving.substr(0, 36) + '...'}
		    </p>
		  </div>
		  <Link className="bg-white mt-4 block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow" to={`/ambities/${ambitie.ID}`}>
		  	Naar Ambitie
		  </Link>
		</div>
	)
}

class AmbitionsList extends Component {
  
  state = {
    ambities: []
  }

  componentDidMount() {
	  instance.get(`${'https://cors-anywhere.herokuapp.com/'}http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1/ambities`, { crossdomain: true, header: { 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'} })
		.then(res => {
      const ambities = res.data;
      this.setState({ ambities });
    }).catch((error) => {
			console.log(error);
		})
	}

  render() {
    return (
      <div>
      	<div className="flex justify-between">	
      		<h1>
      			Alle {this.state.ambities[0] ? this.state.ambities.length - 1 : "0"} ambities
    			</h1>
      		<div>
      			<Link to={`/ambities/nieuwe-ambitie`} className="bg-green hover:bg-green-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline no-underline">+ Voeg Ambitie Toe</Link>
      		</div>
      	</div>
	      <ul className="flex list-reset mt-8 flex-wrap">
	        { this.state.ambities[0] ? this.state.ambities.slice(1).map(ambitie =>
	        	<li key={ambitie.ID} className="mb-6 w-1/3 display-inline">
	        		{testComponent(ambitie)}
	        	</li>
	        	) : "Loading..."
	      	}
	      </ul>
	    </div>
    )
  }

}

export default AmbitionsList;