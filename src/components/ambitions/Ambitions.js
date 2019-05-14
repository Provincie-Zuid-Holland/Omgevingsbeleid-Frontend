import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import AmbitionsVersion from './AmbitionsVersion';
import AmbitionsSingle from './AmbitionsSingle';
import AmbitionsList from './AmbitionsList';
import AmbitionsCRUD from './AmbitionsCRUD';

class AmbitionsOverzicht extends Component {
	render() {
		return (

			<div>
				<Switch>
					<Route exact path="/ambities/nieuwe-ambitie" component={AmbitionsCRUD} />
					<Route exact path="/ambities/edit/:single" component={AmbitionsCRUD} />
					<Route exact path="/ambities/:single/:version" component={AmbitionsVersion} />
					<Route exact path="/ambities/:single" component={AmbitionsSingle} />
					<Route exact path="/ambities" component={AmbitionsList} />
				</Switch>

			</div>
			
		);
	}
}


export default AmbitionsOverzicht;