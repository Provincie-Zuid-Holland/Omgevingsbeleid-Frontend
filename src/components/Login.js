import React, { Component } from 'react'
import Auth from './Auth'
import { withRouter } from 'react-router-dom'

import withAuth from './WithAuth'

class Login extends Component {

	constructor(props){

		super(props)

		this.state = {
      identifier: '',
      password: ''
    };

		this.handleChange = this.handleChange.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleErrorMessage = this.handleErrorMessage.bind(this)

	}

	handleFormSubmit(e){
   	
   	e.preventDefault();  

   	let history = this.props.history;

   	const identifier = this.state.identifier;
   	const password = this.state.password;

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
      } else if (response.status === 401) {
        throw Error("Wrong username or password")
      } else {
      	throw Error("Something went wrong, please try again later")
      }

	  }).then(function(data) {

	    // Save token to local storage
	    const access_token = data.access_token;
      localStorage.setItem('access_token', access_token)
      history.push('/ambities')
 

	  }).catch((err) => {
			
			let errorEl = document.getElementById('error-message');
			errorEl.classList.innerHTML = err;
			errorEl.classList.remove('hidden');
			errorEl.classList.add('flex');

		});

  }

  handleErrorMessage(e){
  	let errorEl = document.getElementById('error-message');
		errorEl.classList.add('hidden');
		errorEl.classList.remove('flex');
		console.log("TRIGGERED!")
  }


	render() {
		return (

			<div className="w-full h-full flex flew justify-center items-center flex-wrap">
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
				<div id="error-message" className="container items-center justify-center hidden">
					<div className="bg-red-lightest border border-red-light pr-10 text-red-dark px-4 py-3 rounded relative inline-block" role="alert">
					  <span className="block sm:inline">Wrong username or password.</span>
					  <span className="absolute pin-t pin-b pin-r px-4 py-3" onClick={this.handleErrorMessage}>
					    <svg className="fill-current h-6 w-6 text-red" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
					  </span>
					</div>
				</div>

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

export default withRouter(Login);