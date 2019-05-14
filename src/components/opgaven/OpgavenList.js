import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/'
});

function opgavenComponent(opgave) {
	return(
		<div className="mr-4 ml-4 h-full px-4 pb-4 shadow border rounded overflow-hidden bg-white">
		  <div className="py-4">
		    <div className="font-bold text-xl mb-2">{opgave.Titel}</div>
		    <p className="text-grey-darker text-base">
		      {opgave.Omschrijving.substr(0, 36) + '...'}
		    </p>
		  </div>
		  <Link className="bg-white mt-4 block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow" to={`/opgaven/${opgave.ID}`}>
		  	Naar Opgave
		  </Link>
		</div>
	)
}

class OpgavenList extends Component {
  
  state = {
    opgaven: []
  }

  componentDidMount() {

  	const access_token = localStorage.getItem('access_token');

  	console.log("mounted")
  	// Connect with API
	  instance.get('v0.1/opgaven', { headers: { Authorization: `Token ${access_token}` } })
		.then(res => {
			console.log("response:")
			console.log(res.data)
      const opgaven = res.data;
      this.setState({ opgaven });
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
      			Alle {this.state.opgaven[0] ? this.state.opgaven.length - 1 : "0"} opgaven
    			</h1>
      		<div>
      			<Link to={`/opgaven/nieuwe-opgave`} className="bg-green hover:bg-green-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline no-underline">+ Voeg Opgave Toe</Link>
      		</div>
      	</div>
	      <ul className="flex mt-8 flex-wrap">
	        { this.state.opgaven[0] ? this.state.opgaven.slice(1).map(opgave =>
	        	<li key={opgave.ID} className="mb-6 w-1/3 display-inline">
	        		{opgavenComponent(opgave)}
	        	</li>
	        	) : "Loading..."
	      	}
	      </ul>
	    </div>
    )
  }

}

export default OpgavenList;