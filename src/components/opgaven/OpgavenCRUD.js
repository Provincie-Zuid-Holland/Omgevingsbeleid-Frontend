import React, { Component } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

import MainSidebar from './../MainSidebar'
import TerugNaarOverzicht from './../TerugNaarOverzicht'

// Set config defaults when creating the instance
const access_token = localStorage.getItem('access_token');
const instance = axios.create({
  baseURL: 'http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1',
  headers: {
  	'Content-Type': 'application/json',
  	'Authorization': `Token ${access_token}`
  }
});

class AmbitionsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Titel: '',
      Omschrijving: '',
      Weblink: '',
      Begin_Geldigheid: '',
      Eind_Geldigheid: '',
      Created_By: 'bb19d0b9-e609-434b-bd2d-18f907f16640',
      edit: false
    };

    console.log(this.props.match.params.single)

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
  }

  componentDidMount() {

  	// Single parameter === ambition id, so user is viewing an ambition
  	if (this.props.match.params.single) {
  		
  		this.setState({
  			edit: true
  		});

  		console.log("Mounted.")
	  	let ambitie_id = this.props.match.params.single;

	    const access_token = localStorage.getItem('access_token');
	    
	    // Connect with API
		  instance.get(`opgaven/${ambitie_id}`)
			.then(res => {
	      const res_ambitie = res.data;
	      this.setState({
		      Titel: res_ambitie[0].Titel,
		      Omschrijving: res_ambitie[0].Omschrijving,
		      Weblink: res_ambitie[0].Weblink,
		      Begin_Geldigheid: res_ambitie[0].Begin_Geldigheid,
      		Eind_Geldigheid: res_ambitie[0].Eind_Geldigheid
		    });
	      console.log(format(this.state.Begin_Geldigheid, "YYYY-MM-DD"))
	    }).catch((error) => {
				if (error.response.status === 401) {
					localStorage.removeItem('access_token')
				}
			})
	  }
  }

  handleChange(event) {
  	const name = event.target.name;
  	let value;
  	if (name === "Begin_Geldigheid" || name === "Eind_Geldigheid") {
  		value = new Date(event.target.value);	
  	} else {
    	value = event.target.value;
    }
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    
    event.preventDefault();
    
    let opgavenObject = {
  		Titel: this.state.Titel,
      Omschrijving: this.state.Omschrijving,
      Weblink: this.state.Weblink,
      Begin_Geldigheid: this.state.Begin_Geldigheid,
  		Eind_Geldigheid: this.state.Eind_Geldigheid,
  	}

    if (this.state.edit) {
    	opgavenObject.Modified_By = "bb19d0b9-e609-434b-bd2d-18f907f16640"
    	instance.patch(`opgaven/${this.props.match.params.single}`, JSON.stringify(opgavenObject))
			.then(res => {
				console.log(res)
	      this.props.history.push(`/opgaven/${res.data.ID}`)
	    }).catch((error) => {
				console.log(error);
			});
    } else {
    	opgavenObject.Created_By = "bb19d0b9-e609-434b-bd2d-18f907f16640"
		  instance.post('opgaven', JSON.stringify(opgavenObject))
			.then(res => {
	      this.props.history.push(`/opgaven/${res.data.ID}`)
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
					<TerugNaarOverzicht terugNaar="ambitie" url={`/ambities/${this.props.match.params.single}`} />
					<div>
						<h1>{this.state.edit ? "Wijzig een opgave" : "Voeg een nieuwe opgave toe"}</h1>
						<form className="w-full max-w-md mt-12" onSubmit={this.handleSubmit}>

							{/* Titel */}
						  <div className="flex flex-wrap -mx-3">
						    <div className="w-full px-3 mb-4">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
						        Titel
						      </label>
						      <input required value={this.state.Titel} onChange={this.handleChange} name="Titel" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="titel" type="text" placeholder="Opgave Titel"/>
						    </div>
						  </div>

							{/* Omschrijving */}
						  <div className="flex flex-wrap -mx-3 mb-6">
						    <div className="w-full px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
						        Omschrijving
						      </label>
						      <textarea value={this.state.Omschrijving} required onChange={this.handleChange} name="Omschrijving" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="omschrijving" type="text" placeholder="Schrijf hier je gave opgave"/>
						    </div>
						  </div>

						  {/* Weblink */}
						  <div className="flex flex-wrap -mx-3 mb-6">
						    <div className="w-full px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="weblink">
						        Weblink
						      </label>
						      <input required value={this.state.Weblink} onChange={this.handleChange} name="Weblink" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="weblink" type="text" placeholder="https://www.nu.nl"/>
						    </div>
						  </div>
		 
						  {/* Geldigheid */}
						  <div className="flex flex-wrap -mx-3 mb-6">
						    
						    {/* Begin Geldigheid */}
						    <div className="w-50 px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
						        Begin Geldigheid
						      </label>
						      <input required value={format(this.state.Begin_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Begin_Geldigheid" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="begin-geldigheid" type="date"/>
						    </div>
						  	{/* Eind Geldigheid */}
						    <div className="w-50 px-3">
						      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
						        Eind Geldigheid
						      </label>
						      <input required value={format(this.state.Eind_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Eind_Geldigheid" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="eind-geldigheid" type="date"/>
						    </div>
						  </div>

							{/* Submit */}
						  <div className="flex flex-wrap -mx-3">
						    <div className="w-full px-3">
						      <input className="bg-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" value={this.state.edit ? "Wijzig opgave" : "Voeg opgave toe"}>
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

export default AmbitionsList;