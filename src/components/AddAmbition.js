import React, { Component } from 'react';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/http://api-acctest-ob.westeurope.cloudapp.azure.com/dev',
  headers: {
  	'Authorization': 'Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTM1MDY4MjYsIm5iZiI6MTU1MzUwNjgyNiwianRpIjoiYzFjZWJiYWUtMGJmNC00N2NkLTk4ZTAtZWJmMWE2OGYxODljIiwiZXhwIjoxNTUzNTEwNDI2LCJpZGVudGl0eSI6Ik14X0NhcCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.O6TU5ZzlcrtXee_uJwfVhwrjrtzRqBkXWkcH6skB5NY',
  	'Content-Type': 'application/json'
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
      Created_By: 'bb19d0b9-e609-434b-bd2d-18f907f16640'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
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
    
    // Connect with API
	  instance.post('/v0.1/ambities', JSON.stringify(this.state))
		.then(res => {
      this.props.history.push(`/ambities/${res.data.ID}`)
    }).catch((error) => {
			console.log(error);
		});

  }


  render() {
    return (
      <div>
				<h1>Voeg een nieuwe ambitie toe</h1>
				
				<form className="w-full max-w-md mt-12" onSubmit={this.handleSubmit}>

					{/* Titel */}
				  <div className="flex flex-wrap -mx-3">
				    <div className="w-full px-3 mb-4">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="title">
				        Titel
				      </label>
				      <input required onChange={this.handleChange} name="Titel" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="titel" type="text" placeholder="Ambitie Titel"/>
				    </div>
				  </div>

					{/* Omschrijving */}
				  <div className="flex flex-wrap -mx-3 mb-6">
				    <div className="w-full px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="omschrijving">
				        Omschrijving
				      </label>
				      <textarea required onChange={this.handleChange} name="Omschrijving" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="omschrijving" type="text" placeholder="Aiden heeft vele ambities"/>
				    </div>
				  </div>

				  {/* Weblink */}
				  <div className="flex flex-wrap -mx-3 mb-6">
				    <div className="w-full px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="weblink">
				        Weblink
				      </label>
				      <input required onChange={this.handleChange} name="Weblink" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="weblink" type="url" placeholder="https://www.nu.nl"/>
				    </div>
				  </div>
 
				  {/* Geldigheid */}
				  <div className="flex flex-wrap -mx-3 mb-6">
				    
				    {/* Begin Geldigheid */}
				    <div className="w-50 px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="omschrijving">
				        Begin Geldigheid
				      </label>
				      <input required onChange={this.handleChange} name="Begin_Geldigheid" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="begin-geldigheid" type="date"/>
				    </div>
				  {/* Eind Geldigheid */}
				    <div className="w-50 px-3">
				      <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" htmlFor="omschrijving">
				        Eind Geldigheid
				      </label>
				      <input required onChange={this.handleChange} name="Eind_Geldigheid" className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="eind-geldigheid" type="date"/>
				    </div>
				  </div>

				{/* Submit */}
				  <div className="flex flex-wrap -mx-3">
				    <div className="w-full px-3">
				      <input className="bg-green hover:bg-green-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" value="Voeg ambitie toe">
				      </input>
				    </div>
				  </div>
				</form>

			</div>
    )
  }

}

export default AmbitionsList;