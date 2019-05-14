import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class Home extends Component {
	render() {
		return (

			<div className="container mx-auto flex">
				{/* Sidebar */}
				<div className="w-1/4 rounded inline-block">	
					<div className="welcome-message">
						<span className="font-serif text-gray-600">Omgevingsbeleid</span>
						<h1 className="font-serif text-gray-600">Welkom Aiden,</h1>
						<p className="text-gray-600">In deze omgeving heb je de mogelijkheid om te werken aan Omgevingsbeleid.</p>
					</div>
					<nav>
						<span>Menu</span>
						<ul>
							<li></li>
						</ul>
					</nav>
				</div>
				<div className="w-3/4 rounded inline-block flex-grow">	
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