import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Import Components
import MainSidebar from './../MainSidebar';
import BackToButton from './../BackToButton'

// Import Icons
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Import Axios instance to connect with the API
import axiosAPI from './../../axios'


function VoegObjectToe(props) {

	const overzichtSlug = props.overzichtSlug
	const createNewSlug = props.createNewSlug
	const objectAantal = props.objectAantal

 	return(
 		<li className={(props.objectAantal % 2) !== 0 ? "mb-6 w-full display-inline" : "mb-6 w-1/2 display-inline"}>
	  	<Link className="h-full flex items-center justify-center no-underline px-4 py-4 border border-dashed rounded overflow-hidden" to={`/${overzichtSlug}/${createNewSlug}`}>
			  <span className="text-center text-gray-600 font-semibold py-2 px-4">
			  	+ Voeg {props.titelEnkelvoud} Toe
			  </span>
			</Link>
		</li>
	)
}


function ObjectComponent(props) {
	
	const object = props.object
	const overzichtSlug = props.overzichtSlug
	const titelEnkelvoud = props.titelEnkelvoud

	return(
		<Link className="relative inline-block h-full w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white" to={`/${overzichtSlug}/${object.ID}`}>
	  	<h5 className="text-gray-600 text-sm font-light py-1">{titelEnkelvoud}</h5>
			<h2 className="text-xl font-bold text-gray-800">{object.Titel}</h2>
	    <p className="text-gray-700 text-base pr-4">
	      { object.Omschrijving.length < 100 ? object.Omschrijving : object.Omschrijving.substr(0, 100) + '...'}
	    </p>
    <span className="bottom-0 right-0 absolute font-bold w-8 h-10 text-gray-400 object-left-top">
    	<FontAwesomeIcon className="text-2xl" icon={faAngleRight} />
    </span>
		</Link>
	)

}


class APITestOverzicht extends Component {
  
  state = {
    objecten: []
  }

  render() {

  	// Variables
  	const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud;
  	const titelMeervoud = this.props.dataModel.variables.Titel_Meervoud;
  	const createNewSlug = this.props.dataModel.variables.Create_New_Slug;
  	const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug;

  	// False if data is loading, true if there is a response
  	let dataReceived = this.state.objecten[0];

    return (
      <div className="container mx-auto flex px-6 pb-8">
        
        {/* Sidebar */}
        <MainSidebar />

        {/* Ambition Container */}
        <div className="w-3/4 rounded inline-block flex-grow pl-8"> 

          <BackToButton terugNaar="mijn dashboard" url="/" />

	      	<div className="flex justify-between">	
	      		<h1 className="font-serif text-gray-800 text-2xl">
	      			Alle {dataReceived ? this.state.objecten.length - 1 : "0"} {titelMeervoud}
	    			</h1>
	      		<div>
	      			<Link to={`/${overzichtSlug}/${createNewSlug}`} className="font-bold py-2 px-4 text-sm rounded bg-green-200 text-green-700">+ Voeg {titelEnkelvoud} Toe</Link>
	      		</div>
	      	</div>
	      	
		      <ul className="flex mt-8 flex-wrap" id="API-list">
		        
		        { dataReceived ? this.state.objecten.slice(1).map(object =>
		        	<li key={object.ID} className="mb-6 w-1/2 display-inline">
		        		{<ObjectComponent 
		        			object={object} 
		        			overzichtSlug={overzichtSlug} 
		        			titelEnkelvoud={titelEnkelvoud} 
		        		/>}
		        	</li>
		        	) : "Loading..."
		      	}
		      	
		      	{ dataReceived ? 
		      		<VoegObjectToe 
		      		objectAantal={this.state.objecten.length} 
		      		titelEnkelvoud={titelEnkelvoud} 
		      		overzichtSlug={overzichtSlug} 
		      		createNewSlug={createNewSlug} 
		      	/> : null }

		      </ul>

		    </div>
	    </div>
    )
  }

  componentDidMount() {

  	const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint;

  	// Connect With the API
	  axiosAPI.get(ApiEndpoint)
		.then(res => {
      const objecten = res.data;
      this.setState({ objecten });
    }).catch((error) => {
			if (error.response !== undefined) {
				if (error.response.status === 401) {
					console.log("Sessie verlopen")
	        localStorage.removeItem('access_token')
	      }
	    } else {
				console.log(error);
			}
		})

	}

}

export default APITestOverzicht;