import React, { Component } from 'react'
import Auth from './Auth'

class Login extends Component {

	constructor(){

		super()

		this.state = {
      identifier: '',
      password: ''
    };

		this.handleChange = this.handleChange.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)

	}

	

	handleFormSubmit(e){
   	
   	e.preventDefault();

   	const identifier = this.state.identifier;
   	const password = this.state.password;

   	console.log(JSON.stringify({
      identifier,
      password
    }));

   	console.log("1");

   	fetch(`https://cors-anywhere.herokuapp.com/http://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          identifier,
          password
      })
    }).then(response => {

    	if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
        return response.json()
      } else {
        var error = new Error(response.status)
        error.response = response
        throw error
      }

	  }).then(function(data) {

	    console.log(data);

	    // Save token to local storage
	    const access_token = data.access_token;
      localStorage.setItem('access_token', access_token)
      console.log(localStorage);

	  });

  }


	render() {
		return (

			<div className="w-full h-full flex justify-center items-center flex-wrap">
				<form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={this.handleFormSubmit}>
					<div className="mb-4">
						<label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="identifier">
							Gebruikersnaam
						</label>
						<input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" name="identifier" id="identifier" type="text" placeholder="Gebruikersnaam" onChange={this.handleChange}/>
					</div>
					<div className="mb-6">
						<label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
							Wachtwoord
						</label>
						<input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="******************" onChange={this.handleChange}/>
					</div>
					<div className="flex items-center justify-between">
						<button className="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button" type="submit">
							Sign In
						</button>
					</div>
				</form>
			</div>
			
		);
	}

	handleChange(e){

		this.setState(
			{
				[e.target.name]: e.target.value
			}
		)
	}

}

export default Login;