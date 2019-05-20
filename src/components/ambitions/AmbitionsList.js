import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import MainSidebar from './../MainSidebar';
import TerugNaarOverzicht from './../TerugNaarOverzicht'

import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Set config defaults when creating the instance
const access_token = localStorage.getItem('access_token');
const instance = axios.create({
  baseURL: 'http://api-acctest-ob.westeurope.cloudapp.azure.com/dev',
  headers: {
  	'Content-Type': 'application/json',
  	'Authorization': `Token ${access_token}`
  }
});

function VoegAmbitieToe(props) {
 	const ambitieAantal = props.ambitieAantal;
 	return(
 		<li className={(ambitieAantal % 2) !== 0 ? "mb-6 w-full display-inline" : "mb-6 w-1/2 display-inline"}>
	  	<Link className="h-full flex items-center justify-center no-underline px-4 py-4 border border-dashed rounded overflow-hidden" to={`/ambities/nieuwe-ambitie`}>
			  <span className="text-center text-gray-600 font-semibold py-2 px-4">
			  	+ Voeg Ambitie Toe
			  </span>
			</Link>
		</li>
	)
}

function ambitieComponent(ambitie) {
	return(
		<Link className="relative inline-block h-full w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white" to={`/ambities/${ambitie.ID}`}>
	  	<h5 className="text-gray-600 text-sm font-light py-1">Ambitie</h5>
			<h2 className="text-xl font-bold text-gray-800">{ambitie.Titel}</h2>
	    <p className="text-gray-700 text-base pr-4">
	      { ambitie.Omschrijving.length < 100 ? ambitie.Omschrijving : ambitie.Omschrijving.substr(0, 100) + '...'}
	    </p>
    <span className="bottom-0 right-0 absolute font-bold w-8 h-10 text-gray-400 object-left-top">
    	<FontAwesomeIcon className="text-2xl" icon={faAngleRight} />
    </span>
		</Link>
	)
}

class AmbitionsList extends Component {
  
  state = {
    ambities: []
  }

  componentDidMount() {

  	// Connect with API
	  instance.get('v0.1/ambities')
		.then(res => {
      const ambities = res.data;
      this.setState({ ambities });
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
        <div className="w-3/4 rounded inline-block flex-grow pl-8"> 
          <TerugNaarOverzicht terugNaar="mijn dashboard" url="/" />


	      	<div className="flex justify-between">	
	      		<h1 className="font-serif text-gray-800 text-2xl">
	      			Alle {this.state.ambities[0] ? this.state.ambities.length - 1 : "0"} ambities
	    			</h1>
	      		<div>
	      			<Link to={`/ambities/nieuwe-ambitie`} className="font-bold py-2 px-4 text-sm rounded bg-green-200 text-green-700">+ Voeg Ambitie Toe</Link>
	      		</div>
	      	</div>
		      <ul className="flex mt-8 flex-wrap" id="API-list">
		        { this.state.ambities[0] ? this.state.ambities.slice(1).map(ambitie =>
		        	<li key={ambitie.ID} className="mb-6 w-1/2 display-inline">
		        		{ambitieComponent(ambitie)}
		        	</li>
		        	) : "Loading..."
		      	}
		      	{ this.state.ambities[0] ? <VoegAmbitieToe ambitieAantal={this.state.ambities.length} /> : "" }
		      </ul>
		    </div>
	    </div>
    )
  }

}

export default AmbitionsList;