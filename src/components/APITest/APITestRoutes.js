import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

// Import Page Components
import APITestOverzicht from './APITestOverzicht'
import APITestDetail from './APITestDetail'
import APITestCRUD from './APITestCRUD'

// Set API Test Routes
class APITestRoutes extends Component {
	
	render() {

		const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug
		const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud.toLowerCase()
		const createNewSlug = this.props.dataModel.variables.Create_New_Slug;

		return (

			<div>
				<Switch>
					<Route exact path={`/${overzichtSlug}/${createNewSlug}`} 
						render={ ({match}) => <APITestCRUD dataModel={this.props.dataModel} overzichtSlug={overzichtSlug} history={this.props.history} match={match}/> } 
					/>
					<Route exact path={`/${overzichtSlug}/edit/:single`} 
						render={ ({match}) => <APITestCRUD dataModel={this.props.dataModel} overzichtSlug={overzichtSlug} history={this.props.history} match={match}/> } 
					/>
					<Route exact path={`/${overzichtSlug}/:single/:version`} 
						render={ ({match}) => <APITestDetail dataModel={this.props.dataModel} history={this.props.history} match={match}/> } 
					/>
					<Route exact path={`/${overzichtSlug}/:single`} 
						render={ ({match}) => <APITestDetail dataModel={this.props.dataModel} history={this.props.history} match={match}/> } 
					/>
					<Route exact path={`/${overzichtSlug}/`} 
						render={ () => <APITestOverzicht dataModel={this.props.dataModel} history={this.props.history} /> }
					/>
					
				</Switch>
			</div>
			
		);
	}
}

export default APITestRoutes;