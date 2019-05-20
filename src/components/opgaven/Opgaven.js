import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import OpgavenList from './OpgavenList'
import OpgavenSingle from './OpgavenSingle'
import OpgavenVersion from './OpgavenVersion'
import OpgavenCRUD from './OpgavenCRUD'

class AmbitionsOverzicht extends Component {
	render() {
		return (

			<div>
				<Switch>
					<Route exact path="/opgaven/nieuwe-opgave" component={OpgavenCRUD} />
					<Route exact path="/opgaven/edit/:single" component={OpgavenCRUD} />
					<Route exact path="/opgaven/:single/:version" component={OpgavenVersion} />
					<Route exact path="/opgaven/:single" component={OpgavenSingle} />
					<Route exact path="/opgaven/" component={OpgavenList} />
				</Switch>
			</div>
			
		);
	}
}

export default AmbitionsOverzicht;