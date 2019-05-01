import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import OpgavenList from './OpgavenList';
import OpgavenSingle from './OpgavenSingle';
import OpgavenVersion from './OpgavenVersion';



class AmbitionsOverzicht extends Component {
	render() {
		return (

			<div className="container mx-auto flex">
				<div className="p-8 w-3/4 bg-white shadow rounded inline-block flex-grow">
					<Switch>
						<Route exact path="/opgaven/:single/:version" component={OpgavenVersion} />
						<Route exact path="/opgaven/:single" component={OpgavenSingle} />
						<Route exact path="/opgaven/" component={OpgavenList} />
					</Switch>
				</div>
			</div>
			
		);
	}
}

export default AmbitionsOverzicht;