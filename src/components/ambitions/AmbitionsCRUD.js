import React, { Component } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

// Set config defaults when creating the instance
const access_token = localStorage.getItem('access_token');
const instance = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://api-acctest-ob.westeurope.cloudapp.azure.com/dev',
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

	    // const access_token = localStorage.getItem('access_token');
	    
	    // Connect with API
		  instance.get(`${'https://cors-anywhere.herokuapp.com/'}http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1/ambities/${ambitie_id}`)
			.then(res => {
	      const res_ambitie = res.data;
	      console.log(res_ambitie[0])
	      console.log(res_ambitie[0].Eind_Geldigheid)
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

    let ambitieObject = {
  		Titel: this.state.Titel,
      Omschrijving: this.state.Omschrijving,
      Weblink: this.state.Weblink,
      Begin_Geldigheid: this.state.Begin_Geldigheid,
  		Eind_Geldigheid: this.state.Eind_Geldigheid,
  	}

    if (this.state.edit) {
    	ambitieObject.Modified_By = "bb19d0b9-e609-434b-bd2d-18f907f16640"
    	instance.patch(`/v0.1/ambities/${this.props.match.params.single}`, JSON.stringify(ambitieObject))
			.then(res => {
				console.log(res)
	      this.props.history.push(`/ambities/${res.data.ID}`)
	    }).catch((error) => {
				console.log(error);
			});
    } else {
    	ambitieObject.Created_By = "bb19d0b9-e609-434b-bd2d-18f907f16640"
		  instance.post('/v0.1/ambities', JSON.stringify(ambitieObject))
			.then(res => {
	      this.props.history.push(`/ambities/${res.data.ID}`)
	    }).catch((error) => {
				console.log(error);
			});
	  }

  }


  render() {
    return (
      <div>
				<h1>{this.state.edit ? "Wijzig een ambitie" : "Voeg een nieuwe ambitie toe"}</h1>
				<form className="w-full max-w-md mt-12" onSubmit={this.handleSubmit}>

					{/* Titel */}
				  <div className="flex flex-wrap -mx-3">
				    <div className="w-full px-3 mb-4">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="title">
				        Titel
				      </label>
				      <input required value={this.state.Titel} onChange={this.handleChange} name="Titel" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="titel" type="text" placeholder="Ambitie Titel"/>
				    </div>
				  </div>

					{/* Omschrijving */}
				  <div className="flex flex-wrap -mx-3 mb-6">
				    <div className="w-full px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="omschrijving">
				        Omschrijving
				      </label>
				      <textarea value={this.state.Omschrijving} required onChange={this.handleChange} name="Omschrijving" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="omschrijving" type="text" placeholder="Aiden heeft vele ambities"/>
				    </div>
				  </div>

				  {/* Weblink */}
				  <div className="flex flex-wrap -mx-3 mb-6">
				    <div className="w-full px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="weblink">
				        Weblink
				      </label>
				      <input required value={this.state.Weblink} onChange={this.handleChange} name="Weblink" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="weblink" type="text" placeholder="https://www.nu.nl"/>
				    </div>
				  </div>
 
				  {/* Geldigheid */}
				  <div className="flex flex-wrap -mx-3 mb-6">
				    
				    {/* Begin Geldigheid */}
				    <div className="w-50 px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="omschrijving">
				        Begin Geldigheid
				      </label>
				      <input required value={format(this.state.Begin_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Begin_Geldigheid" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="begin-geldigheid" type="date"/>
				    </div>
				  {/* Eind Geldigheid */}
				    <div className="w-50 px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="omschrijving">
				        Eind Geldigheid
				      </label>
				      <input required value={format(this.state.Eind_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Eind_Geldigheid" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="eind-geldigheid" type="date"/>
				    </div>
				  </div>

				{/* Submit */}
				  <div className="flex flex-wrap -mx-3">
				    <div className="w-full px-3">
				      <input className="bg-green hover:bg-green-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" value={this.state.edit ? "Wijzig Ambitie" : "Voeg Ambitie toe"}>
				      </input>
				    </div>
				  </div>
				</form>

			</div>
    )
  }

}

export default AmbitionsList;