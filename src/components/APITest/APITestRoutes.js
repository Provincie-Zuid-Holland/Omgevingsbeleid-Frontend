import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import APITestOverzicht from './APITestOverzicht'
import APITestDetail from './APITestDetail'

class APITestRoutes extends Component {
	render() {

		const OverzichtSlug = this.props.dataModel.variables.Overzicht_Slug

		return (

			<div>
				<Switch>
          
          <Route exact path={`/${OverzichtSlug}/:single/:version`} 
          	render={({match}) => <APITestDetail dataModel={this.props.dataModel} match={match}/>} 
          />
          <Route exact path={`/${OverzichtSlug}/:single`} 
          	render={({match}) => <APITestDetail dataModel={this.props.dataModel} match={match}/>} 
          />
					<Route exact path={`/${OverzichtSlug}/`} 
						render={() => <APITestOverzicht dataModel={this.props.dataModel} />}
					/>
					
				</Switch>
			</div>
			
		);
	}
}

export default APITestRoutes;