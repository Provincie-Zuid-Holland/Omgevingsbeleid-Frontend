import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const menuItems = {
	"Dashboard": {"url":"/", "finished": true},
	"Verordening": {"url":"", "finished": false},
	"Beleidsbeslissingen": {"url":"", "finished": false},
	"Beleidsregels": {"url":"", "finished": false},
	"Maatregelen": {"url":"", "finished": false},
	"Onderdelen indienen": {"url":"", "finished": false},
	"Overzicht wijzigingen": {"url":"", "finished": false},
	"Mijn instellingen": {"url":"", "finished": false},
}

function MainSidebar(props) {

  const listItems = Object.keys(menuItems).map((value, index) =>
    menuItems[value].finished ? 
    	<Link
    		className="text-gray-600 relative text-sm font-light leading-loose border-t block border-gray-200 py-1" 
    		key={index}
    		to={menuItems[value].url}>
	    	{value}
	    	<FontAwesomeIcon className="absolute right-0 h-8" icon={faAngleRight} />
	    </Link>
    	: 
    	<li 
    		className="text-gray-600 text-sm font-light relative leading-loose border-t border-gray-200 py-1 cursor-not-allowed" 
    		key={index}>
	    	{value}
	    	<FontAwesomeIcon className="absolute right-0 h-8" icon={faAngleRight} />
	    </li>
  );

  const gebruikersNaam = JSON.parse(localStorage.getItem('identifier')).Gebruikersnaam.split(' ')[0]

  return (
    <div className="w-1/4 rounded inline-block">	
			<div className="welcome-message">
				<span className="font-serif text-gray-800 text-l mb-2 inline-block">Omgevingsbeleid</span>
				<h2 className="font-serif text-gray-800 text-2xl">
					{ gebruikersNaam.length !== 0 ? `Welkom ${gebruikersNaam},` : "Welkom," }
				</h2>
				<p className="text-gray-700">In deze omgeving heb je de mogelijkheid om te werken aan Omgevingsbeleid.</p>
			</div>
			<h2 className="mt-8 text-l font-serif text-gray-800">Menu</h2>
			<nav className="pt-2">
				<ul className="border-b border-gray-200">{listItems}</ul>
			</nav>
		</div>
  );
}

export default MainSidebar;