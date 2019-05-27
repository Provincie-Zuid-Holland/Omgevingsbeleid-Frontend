import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

// Import Page Components
import APITestOverzicht from './APITestOverzicht'
import APITestDetail from './APITestDetail'
import APITestCRUD from './APITestCRUD'

// Set API Test Routes
class APITestRoutes extends Component {
	
	render() {

		const OverzichtSlug = this.props.dataModel.variables.Overzicht_Slug
		return (

			<div>
				<Switch>
					
					<Route exact path={`/${OverzichtSlug}/edit/:single`} 
						render={ ({match}) => <APITestCRUD dataModel={this.props.dataModel} history={this.props.history} match={match}/> } 
					/>
					<Route exact path={`/${OverzichtSlug}/:single/:version`} 
						render={ ({match}) => <APITestDetail dataModel={this.props.dataModel} history={this.props.history} match={match}/> } 
					/>
					<Route exact path={`/${OverzichtSlug}/:single`} 
						render={ ({match}) => <APITestDetail dataModel={this.props.dataModel} history={this.props.history} match={match}/> } 
					/>
					<Route exact path={`/${OverzichtSlug}/`} 
						render={ () => <APITestOverzicht dataModel={this.props.dataModel} history={this.props.history} /> }
					/>
					
				</Switch>
			</div>
			
		);
	}
}

export default APITestRoutes;