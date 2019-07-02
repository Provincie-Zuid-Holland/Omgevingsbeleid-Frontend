import React from 'react';
import { NavLink } from 'react-router-dom';

import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const menuItemsOmgevingsbeleid = {
	"Dashboard": {"url":"/", "finished": true},
	"Verordening": {"url":"", "finished": false},
	"Beleidsbeslissingen": {"url":"", "finished": false},
	"Beleidsregels": {"url":"", "finished": false},
	"Maatregelen": {"url":"/maatregelen", "finished": true},
	"API Test Omgeving": {"url":"/api-test", "finished": true},
}

const menuItemsActies = {
	"Onderdelen indienen": {"url":"", "finished": false},
	"Wijzigingen": {"url":"", "finished": false}
}

const menuItemsInstellingen = {
	"Mijn account": {"url":"", "finished": false}
}

function ReturnNavLink(props) {

	// If Dashboard exact, else not
	if (props.value === 'Dashboard') {
		return (
			<NavLink
			exact
			activeClassName="mt-1 relative text-sm block leading-loose py-1 px-2 font-bold rounded bg-gray-300 text-gray-800"
			className="mt-1 relative text-sm block leading-loose py-1 px-2 text-gray-600 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-900" 
			key={props.index}
			to={props.url}>
				{props.value}
				<FontAwesomeIcon 
					className="absolute text-xl right-0 h-8 mr-3 main-sidebar-arrow" 
					icon={faAngleRight}
				/>
			</NavLink>
		)
	} else {
		return (
			<NavLink
			activeClassName="mt-1 relative text-sm block leading-loose py-1 px-2 font-bold rounded bg-gray-300 text-gray-800"
			className="mt-1 relative text-sm block leading-loose py-1 px-2 text-gray-600 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-900" 
			key={props.index}
			to={props.url}>
				{props.value}
				<FontAwesomeIcon 
					className="absolute text-xl right-0 h-8 mr-3 main-sidebar-arrow" 
					icon={faAngleRight}
				/>
			</NavLink>
		)
	}

}


function returnMenuItems(menuItems) {

	const listItems = Object.keys(menuItems).map((value, index) =>
		menuItems[value].finished ? 
			<ReturnNavLink
				key={index}
				index={index}
				url={menuItems[value].url}
				value={value}
			/>
			: 
			<li 
				className="text-gray-600 mt-1 relative text-sm block leading-loose py-1 px-2  rounded cursor-not-allowed hover:bg-gray-300 hover:text-blue-900" 
				key={index}>
				{value}
				<FontAwesomeIcon 
					className="absolute text-xl text-grey-300 right-0 h-8 mr-3 main-sidebar-arrow" 
					icon={faAngleRight}
				/>
			</li>
	)
  return listItems

}

function MainSidebar(props) {

  let identifier = localStorage.getItem('identifier')
  let gebruikersNaam = ""
  if (identifier !== null) {
	gebruikersNaam = JSON.parse(identifier).Gebruikersnaam.split(' ')[0]
  } else {
	gebruikersNaam = null
  }

	//   const gebruikersNaam = JSON.parse(localStorage.getItem('identifier')).Gebruikersnaam.split(' ')[0]

  return (
    <div className="w-1/4 rounded inline-block">	
			<div className="welcome-message">
				<span className="font-serif text-gray-800 text-l mb-2 inline-block">Omgevingsbeleid</span>
				<h2 className="font-serif text-gray-800 text-2xl">
					{ gebruikersNaam !== null ? `Welkom ${gebruikersNaam},` : "Welkom," }
				</h2>
				<p className="text-gray-700">In deze omgeving heb je de mogelijkheid om te werken aan Omgevingsbeleid.</p>
			</div>
			<nav className="pt-2">
				<h2 className="mt-8 mb-2 text-xl px-2 font-serif text-gray-800">Omgevingsbeleid</h2>
				<ul>
					{returnMenuItems(menuItemsOmgevingsbeleid)}
				</ul>
				<h2 className="mt-8 mb-2 text-xl px-2 font-serif text-gray-800">Acties</h2>
				<ul>
					{returnMenuItems(menuItemsActies)}
				</ul>
				<h2 className="mt-8 mb-2 text-xl px-2 font-serif text-gray-800">Instellingen</h2>
				<ul>
					{returnMenuItems(menuItemsInstellingen)}
				</ul>
			</nav>
		</div>
  );
}

export default MainSidebar;