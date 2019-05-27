import React, { Component } from 'react'
import { format } from 'date-fns'

import MainSidebar from './../MainSidebar'
import BackToButton from './../UI/BackToButton'

// Import Axios instance to connect with the API
import axiosAPI from './../../axios'


// Function to see if property on object is editable
function getCRUDBoolean(dataModel, propertyName) {
	return dataModel.properties[propertyName].UI.userCRUD
}

// Function to make an array containing ONLY the fields for CRUD actions
function makeCrudProperties(responseObject, dataModel) {
	
	// Make list of property names from returned object
	const propertyNames = Object.keys(responseObject[0])

	// Check for each Property in propertyNames if property CRUD value is True and if True add to new Array
	const crudProperties = propertyNames.filter(propertyName => {
		return getCRUDBoolean(dataModel, propertyName)
	})

	// Return array with CRUD Properties
	return crudProperties

}

// Function to make an array containing the fields AND the data for CRUD actions
function makeCrudObject(array, responseObject) {
	const crudList = array.map((arrayItem, index) => {
		return {
			[arrayItem]: responseObject[arrayItem]
		}
	})
	return crudList
}


class APITestCRUD extends Component {

  constructor(props) {

		super(props)

		// CrudProperties contains the fields that are editable (Used for new)
		// CrudObject contains the fields and current value (Used for Edit)
    this.state = {
			edit: false,
			crudProperties: [],
			crudObject: []
    };

    this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		
  }

  componentDidMount() {
  	
  	// Single parameter === object-id; user is editing an existing object
  	if (this.props.match.params.single) {
  		
  		this.setState({
  			edit: true
  		})
			
			const dataModel = this.props.dataModel
			const objectID = this.props.match.params.single
			const ApiEndpoint =  this.props.dataModel.variables.Api_Endpoint
	    
	    // Connect with API
		  axiosAPI.get(`${ApiEndpoint}/${objectID}`)
			.then(res => {
				
				const res_ambitie = res.data;
				const crudProperties = makeCrudProperties(res_ambitie, dataModel)
				const crudObject = makeCrudObject(crudProperties, res_ambitie[0])

	      this.setState({
					crudObject: crudObject,
					crudProperties: crudProperties
				}, () => console.log(this.state));
				
	    }).catch((error) => {
				if (error.response !== undefined) {
					if (error.response.status === 401) {
						localStorage.removeItem('access_token')
          	this.props.history.push('/login')
		      }
		    } else {
					console.log(error);
				}
			})
	  }
  }

  handleChange(event) {
  	const name = event.target.name
  	let value
  	if (name === "Begin_Geldigheid" || name === "Eind_Geldigheid") {
  		value = new Date(event.target.value)
  	} else {
    	value = event.target.value
    }
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    
    event.preventDefault(); 

    let ambitieObject = {
  		Titel: this.state.Titel,
      Omschrijving: this.state.Omschrijving,
      Weblink: this.state.Weblink,
      Begin_Geldigheid: this.state.Begin_Geldigheid,
  		Eind_Geldigheid: this.state.Eind_Geldigheid,
  	}

    if (this.state.edit) {
    	ambitieObject.Modified_By = "bb19d0b9-e609-434b-bd2d-18f907f16640"
    	axiosAPI.patch(`ambities/${this.props.match.params.single}`, JSON.stringify(ambitieObject))
			.then(res => {
				console.log(res)
	      this.props.history.push(`/ambities/${res.data.ID}`)
	    }).catch((error) => {
				console.log(error);
			});
    } else {
    	ambitieObject.Created_By = "bb19d0b9-e609-434b-bd2d-18f907f16640"
		  axiosAPI.post('ambities', JSON.stringify(ambitieObject))
			.then(res => {
	      this.props.history.push(`/ambities/${res.data.ID}`)
	    }).catch((error) => {
				console.log(error);
			});
	  }

  }


  render() {
    return (
      <div className="container mx-auto flex px-6 pb-8">      
				
				{/* Sidebar */}
				<MainSidebar />

				{/* Ambition Container */}
				<div className="w-3/4 inline-block flex-grow pl-8">	
					<BackToButton terugNaar="ambitie" url={`/ambities/${this.props.match.params.single}`} />
					<div>
						<h1 className="font-serif text-gray-800 text-2xl">{this.state.edit ? "Wijzig een ambitie" : "Voeg een nieuwe ambitie toe"}</h1>
						<form className="sm:w-full w-2/3 mt-6" onSubmit={this.handleSubmit}>

							{/* Titel */}
						  <div className="flex flex-wrap -mx-3">
						    <div className="w-full px-3 mb-4">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
						        Titel
						      </label>
						      <input required value={this.state.Titel} onChange={this.handleChange} name="Titel" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="titel" type="text" placeholder="Ambitie Titel"/>
						    </div>
						  </div>

							{/* Omschrijving */}
						  <div className="flex flex-wrap -mx-3 mb-6">
						    <div className="w-full px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
						        Omschrijving
						      </label>
						      <textarea value={this.state.Omschrijving} required onChange={this.handleChange} name="Omschrijving" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="omschrijving" type="text" placeholder="Aiden heeft vele ambities"/>
						    </div>
						  </div>

						  {/* Weblink */}
						  <div className="flex flex-wrap -mx-3 mb-6">
						    <div className="w-full px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="weblink">
						        Weblink
						      </label>
						      <input required value={this.state.Weblink} onChange={this.handleChange} name="Weblink" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-500" id="weblink" type="text" placeholder="https://www.nu.nl"/>
						    </div>
						  </div>
		 
						  {/* Geldigheid */}
						  <div className="flex flex-wrap -mx-3 mb-6">
						    
						    {/* Begin Geldigheid */}
						    <div className="w-50 px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
						        Begin Geldigheid
						      </label>
						      <input required value={format(this.state.Begin_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Begin_Geldigheid" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="begin-geldigheid" type="date"/>
						    </div>
						  {/* Eind Geldigheid */}
						    <div className="w-50 px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
						        Eind Geldigheid
						      </label>
						      <input required value={format(this.state.Eind_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Eind_Geldigheid" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="eind-geldigheid" type="date"/>
						    </div>
						  </div>

							{/* Submit */}
						  <div className="flex flex-wrap -mx-3">
						    <div className="w-full px-3">
						      <input className="font-bold py-2 px-4 text-sm rounded bg-green-200 text-green-700 hover:bg-green-300" type="submit" value={this.state.edit ? "Wijzig Ambitie" : "Voeg Ambitie toe"}>
						      </input>
						    </div>
						  </div>
						</form>
					</div>
				</div>

			</div>
    )
  }

}

export default APITestCRUD;