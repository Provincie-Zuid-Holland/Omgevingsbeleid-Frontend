import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/'
});

function VoegAmbitieToe() {
 	return(
 		<li className="mb-6 w-1/3 display-inline">
	  	<Link className="mr-4 ml-4 h-full flex items-center justify-center no-underline px-4 pb-4 border border-dashed rounded overflow-hidden" to={`/ambities/nieuwe-ambitie`}>
			  <span className="text-center text-grey-dark font-semibold py-2 px-4">
			  	+ Voeg Ambitie Toe
			  </span>
			</Link>
		</li>
	)
}

function ambitieComponent(ambitie) {
	return(
		<div className="mr-4 ml-4 h-full px-4 pb-4 shadow border rounded overflow-hidden bg-white">
		  <div className="py-4">
		    <div className="font-bold text-xl mb-2">{ambitie.Titel}</div>
		    <p className="text-grey-darker text-base">
		      {ambitie.Omschrijving.substr(0, 100) + '...'}
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

  	const access_token = localStorage.getItem('access_token');

  	console.log("mounted")
  	// Connect with API
	  instance.get('v0.1/ambities', { headers: { Authorization: `Token ${access_token}` } })
		.then(res => {
			console.log("response")
      const ambities = res.data;
      this.setState({ ambities });
    }).catch((error) => {
			if (error.response.status === 401) {
				localStorage.removeItem('access_token')
			}
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
	      <ul className="flex mt-8 flex-wrap">
	        { this.state.ambities[0] ? this.state.ambities.slice(1).map(ambitie =>
	        	<li key={ambitie.ID} className="mb-6 w-1/3 display-inline">
	        		{ambitieComponent(ambitie)}
	        	</li>
	        	) : "Loading..."
	      	}
	      	{ this.state.ambities[0] ? <VoegAmbitieToe /> : "" }
	      </ul>
	    </div>
    )
  }

}

export default AmbitionsList;