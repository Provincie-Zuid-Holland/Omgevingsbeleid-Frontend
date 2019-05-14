import React, { Component } from 'react';
import { Link } from 'react-router-dom';


const menuItems = [
	[ "Dashboard", 'link' ],
	[ "Verordening", 'link' ],
	[ "Beleidsbeslissingen", 'link' ],
	[ "Beleidsregels", 'link' ],
	[ "Maatregelen", 'link' ],
	[ "Onderdelen indienen", 'link' ],
	[ "Overzicht wijzigingen", 'link' ],
	[ "Mijn instellingen", 'link' ]
]

function MenuList(props) {
	const menuItems = props.menuItems;
  const listItems = menuItems.map((value, index) =>
    <li className="text-gray-600 text-sm font-light leading-loose border-t border-gray-200 py-1" key={index}>{value[0]}</li>
  );
  return (
    <ul className="border-b border-gray-200">{listItems}</ul>
  );
}


function LabelGenerator(props) {
	let statusCSS = "";
	let statusName = "";
	if (props.status === "not working") {
		statusCSS = "bg-red-200 text-red-700";
		statusName = "API Not Working";
	} else if (props.status === "wip") {
		statusCSS = "bg-orange-200 text-yellow-700";
		statusName = "API Work in Progress";
	} else if (props.status === "finished") {
		statusCSS = "bg-green-200 text-green-700";
		statusName = "API Fully Functional";
	}
	return(
		<span className={`${statusCSS} font-bold py-2 px-4 text-sm rounded-full`}>
			{statusName}
		</span>
	)
}


const APITestItemList = {
	"Ambities": {"url": "/ambities", "status": "finished"},
	"BeleidsRegels": {"url": "/beleidsRegel", "status": "not working"},
	"Doelen": {"url": "/Doel", "status": "not working"},
	"Provinciale Belangen": {"url": "/provincialeBelangen", "status": "not working"},
	"Beleids Relaties": {"url": "/beleidsRelatie", "status": "not working"},
	"Maatregelen": {"url": "/maatregelen", "status": "not working"},
	"Themas": {"url": "/themas", "status": "not working"},
	"Opgaven": {"url": "/opgaven", "status": "finished"},
	"Verordening": {"url": "/verordening", "status": "not working"}
}

function APITestItem(props) {
	
  const listItems = Object.keys(APITestItemList).map((key, index) =>
    <li key={index} className="w-1/2 py-3">
	    <Link to={APITestItemList[key].status !== "not working" ? APITestItemList[key].url : ""} className={APITestItemList[key].status === "not working" ? "cursor-not-allowed" : null}>
	    	<div className="h-full px-4 py-6 shadow-md rounded overflow-hidden bg-white">
					<h5 className="text-gray-600 text-sm font-light py-1">API Test</h5>
					<h2 className="text-xl font-bold text-gray-800 mb-6">{key}</h2>
				  <LabelGenerator status={APITestItemList[key].status} />
				 </div>
			</Link>
		</li>
  );

	return(
		<ul className="flex w-full flex-wrap" id="APIList">
			{listItems}
		</ul>
	)
}

class Home extends Component {

	render() {
		return (

			<div className="container mx-auto flex px-6 pb-8">
				
				{/* Sidebar */}
				<div className="w-1/4 rounded inline-block">	
					<div className="welcome-message">
						<span className="font-serif text-gray-800 text-l mb-2 inline-block">Omgevingsbeleid</span>
						<h1 className="font-serif text-gray-800 text-2xl">Welkom Aiden,</h1>
						<p className="text-gray-700">In deze omgeving heb je de mogelijkheid om te werken aan Omgevingsbeleid.</p>
					</div>
					<nav className="mt-8">
						<h2 className="text-l font-serif text-gray-800 mb-2">Menu</h2>
					  <MenuList menuItems={menuItems} />
					</nav>
				</div>

				{/* Dashboard */}
				<div className="w-3/4 rounded inline-block flex-grow pl-8">	
					
					<h2 className="mb-4 text-l font-serif text-gray-800">API Test Overzicht</h2>
					<APITestItem />

				</div>
			</div>
			
		);
	}
}

export default Home;