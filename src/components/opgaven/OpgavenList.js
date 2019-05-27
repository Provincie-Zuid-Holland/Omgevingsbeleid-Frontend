import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import MainSidebar from './../MainSidebar';
import BackToButton from './../UI/BackToButton'

import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/'
});

function VoegOpgaveToe(props) {
 	const opgaveAantal = props.opgaveAantal;
 	return(
 		<li className={(opgaveAantal % 2) !== 0 ? "mb-6 w-full display-inline" : "mb-6 w-1/2 display-inline"}>
	  	<Link className="h-full flex items-center justify-center no-underline px-4 py-4 border border-dashed rounded overflow-hidden" to={`/ambities/nieuwe-ambitie`}>
			  <span className="text-center text-gray-600 font-semibold py-2 px-4">
			  	+ Voeg Opgave Toe
			  </span>
			</Link>
		</li>
	)
}

function opgavenComponent(opgave) {
	return(
		<Link className="relative inline-block h-full w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white" to={`/opgaven/${opgave.ID}`}>
	  	<h5 className="text-gray-600 text-sm font-light py-1">Opgave</h5>
			<h2 className="text-xl font-bold text-gray-800">{opgave.Titel}</h2>
	    <p className="text-gray-700 text-base pr-4">
	      { opgave.Omschrijving.length < 100 ? opgave.Omschrijving : opgave.Omschrijving.substr(0, 100) + '...'}
	    </p>
    <span className="bottom-0 right-0 absolute font-bold w-8 h-10 text-gray-400 object-left-top">
    	<FontAwesomeIcon className="text-2xl" icon={faAngleRight} />
    </span>
		</Link>
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
      <div className="container mx-auto flex px-6 pb-8">
        {/* Sidebar */}
        <MainSidebar />

        {/* Ambition Container */}
        <div className="w-3/4 rounded inline-block flex-grow pl-8"> 
          <BackToButton terugNaar="mijn dashboard" url="/" />


	      	<div className="flex justify-between">	
	      	
	      		<h1>
	      			Alle {this.state.opgaven[0] ? this.state.opgaven.length - 1 : "0"} opgaven
	    			</h1>
	      		<div>
	      			<Link to={`/opgaven/nieuwe-opgave`} className="bg-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline no-underline">+ Voeg Opgave Toe</Link>
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
	    </div>
    )
  }

}

export default OpgavenList;