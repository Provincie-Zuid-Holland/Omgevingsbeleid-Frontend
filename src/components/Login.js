import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AmbitionsVersion from './AmbitionsVersion';
import AmbitionsSingle from './AmbitionsSingle';
import AmbitionsList from './AmbitionsList';

class Login extends Component {
	render() {
		return (

			<div class="w-full h-full flex justify-center items-center flex-wrap">
			  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			    <div class="mb-4">
			      <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
			        Gebruikersnaam
			      </label>
			      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Gebruikersnaam"/>
			    </div>
			    <div class="mb-6">
			      <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
			        Wachtwoord
			      </label>
			      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
			    </div>
			    <div class="flex items-center justify-between">
			      <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
			        Sign In
			      </button>
			    </div>
			  </form>
			</div>

			
		);
	}
}

export default Login;