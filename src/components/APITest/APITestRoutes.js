import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import APITestOverzicht from './APITestOverzicht'

class APITestRoutes extends Component {
	render() {

		const OverzichtSlug = this.props.dataModel.variables.Overzicht_Slug

		return (

			<div>
				<Switch>
					<Route exact path={`/${OverzichtSlug}/`} render={() => <APITestOverzicht 
            dataModel={this.props.dataModel}
          />} />
				</Switch>
			</div>
			
		);
	}
}

export default APITestRoutes;