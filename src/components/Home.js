import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MainSidebar from './MainSidebar';

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
	"Ambities": {"url": "ambities", "status": "wip"},
	"BeleidsRegels": {"url": "beleidsRegel", "status": "not working"},
	"Doelen": {"url": "Doel", "status": "not working"},
	"Provinciale Belangen": {"url": "provincialeBelangen", "status": "not working"},
	"Beleids Relaties": {"url": "beleidsRelatie", "status": "not working"},
	"Maatregelen": {"url": "maatregelen", "status": "not working"},
	"Themas": {"url": "themas", "status": "not working"},
	"Opgaven": {"url": "opgaven", "status": "not working"},
	"Verordening": {"url": "verordening", "status": "not working"}
}

function APITestItem(props) {
	
  const listItems = Object.keys(APITestItemList).map((key, index) =>
    <li key={index} id="API-list" className="w-1/2 py-3">
	    <Link to={APITestItemList[key].status !== "not working" ? ("/" +APITestItemList[key].url) : ""} className={APITestItemList[key].status === "not working" ? "cursor-not-allowed" : null}>
	    	<div className="h-full px-4 py-6 shadow-md rounded overflow-hidden bg-white">
					<h5 className="text-gray-600 text-sm font-light py-1">API Test</h5>
					<h2 className="text-xl font-bold text-gray-800 mb-6">{key}</h2>
				  <LabelGenerator status={APITestItemList[key].status} />
				 </div>
			</Link>
		</li>
  );

	return(
		<ul className="flex w-full flex-wrap" id="API-list">
			{listItems}
		</ul>
	)

}

class Home extends Component {

	render() {
		return (

			<div className="container mx-auto flex px-6 pb-8">
				
				{/* Sidebar */}
				<MainSidebar />

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