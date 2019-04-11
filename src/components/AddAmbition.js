import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create();

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NTM1MDY4MjYsIm5iZiI6MTU1MzUwNjgyNiwianRpIjoiYzFjZWJiYWUtMGJmNC00N2NkLTk4ZTAtZWJmMWE2OGYxODljIiwiZXhwIjoxNTUzNTEwNDI2LCJpZGVudGl0eSI6Ik14X0NhcCIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.O6TU5ZzlcrtXee_uJwfVhwrjrtzRqBkXWkcH6skB5NY";


class AmbitionsList extends Component {

  render() {
    return (
      <div>
				<h1>Voeg een nieuwe ambitie toe</h1>
				<form class="w-full max-w-md mt-12">
				  
				  <div class="flex flex-wrap -mx-3">
				    <div class="w-full px-3 mb-4">
				      <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-first-name">
				        Titel
				      </label>
				      <input class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="grid-first-name" type="text" placeholder="Ambitie Titel"/>
				    </div>
				  </div>
				  <div class="flex flex-wrap -mx-3 mb-6">
				    <div class="w-full px-3">
				      <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">
				        Omschrijving
				      </label>
				      <textarea class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="grid-last-name" type="text" placeholder="Aiden heeft vele ambities"/>
				    </div>
				  </div>
				  <div class="flex flex-wrap -mx-3 mb-6">
				    <div class="w-full px-3">
				      <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-password">
				        Weblink
				      </label>
				      <input class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="grid-password" type="text" placeholder="https://www.nu.nl"/>
				    </div>
				  </div>
				  <div class="flex flex-wrap -mx-3">
				    <div class="w-full px-3">
				      <button class="bg-green hover:bg-green-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
				        Voeg ambitie toe
				      </button>
				    </div>
				  </div>
				</form>

			</div>
    )
  }

}

export default AmbitionsList;