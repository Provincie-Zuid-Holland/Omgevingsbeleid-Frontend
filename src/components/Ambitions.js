import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import AmbitionsVersion from './AmbitionsVersion';
import AmbitionsSingle from './AmbitionsSingle';
import AmbitionsList from './AmbitionsList';
import AddAmbition from './AddAmbition';

class AmbitionsOverzicht extends Component {
	render() {
		return (

			<div className="container mx-auto flex">
				<div className="p-8 w-3/4 bg-white shadow rounded inline-block flex-grow">
					<Switch>
						<Route path="/ambities/nieuwe-ambitie" component={AddAmbition} />
						<Route path="/ambities/:single/:version" component={AmbitionsVersion} />
						<Route path="/ambities/:single" component={AmbitionsSingle} />
						<Route path="/ambities" component={AmbitionsList} />
					</Switch>
				</div>
			</div>
			
		);
	}
}

export default AmbitionsOverzicht;