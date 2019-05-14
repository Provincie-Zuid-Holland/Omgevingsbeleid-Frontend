import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import AmbitionsVersion from './AmbitionsVersion';
import AmbitionsSingle from './AmbitionsSingle';
import AmbitionsList from './AmbitionsList';
import AmbitionsCRUD from './AmbitionsCRUD';
import TerugNaarOverzicht from './../TerugNaarOverzicht'

class AmbitionsOverzicht extends Component {
	render() {
		return (

			<div>
				<TerugNaarOverzicht />
				<div className="container mx-auto m-4 flex shadow-md rounded">
					<Switch>
						<Route exact path="/ambities/nieuwe-ambitie" component={AmbitionsCRUD} />
						<Route exact path="/ambities/edit/:single" component={AmbitionsCRUD} />
						<Route exact path="/ambities/:single/:version" component={AmbitionsVersion} />
						<Route exact path="/ambities/:single" component={AmbitionsSingle} />
						<Route exact path="/ambities" component={AmbitionsList} />
					</Switch>
				</div>
			</div>
			
		);
	}
}


export default AmbitionsOverzicht;