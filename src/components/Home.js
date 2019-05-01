import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import AmbitionsVersion from './AmbitionsVersion';
import AmbitionsSingle from './AmbitionsSingle';
import AmbitionsList from './AmbitionsList';
import AddAmbition from './AddAmbition';


class Home extends Component {
	render() {
		return (

			<div className="container mx-auto flex">
				<div className="p-8 w-3/4 bg-white shadow rounded inline-block flex-grow">
					<h1 className="mb-4">Home</h1>
					<div className="flex">
						<div className="w-1/2 mr-4 ml-4 h-full px-4 py-4 shadow border rounded overflow-hidden bg-white">
							<h2>Ambities</h2>
							<Link className="bg-white mt-4 inline-block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow" to={'/ambities/'}>
						  	Naar Alle Ambities
						  </Link>
						</div>
						<div className="w-1/2 mr-4 ml-4 h-full px-4 py-4 shadow border rounded overflow-hidden bg-white">
							<h2>Opgaven</h2>
							<Link className="bg-white mt-4 inline-block text-center hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border no-underline border-grey-light rounded shadow" to={'/opgaven/'}>
						  	Naar Alle Opgaven
						  </Link>
						</div>
					</div>
				</div>
			</div>
			
		);
	}
}

export default Home;