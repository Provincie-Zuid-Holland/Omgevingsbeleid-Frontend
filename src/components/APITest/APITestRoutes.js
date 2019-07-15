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
        const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint
        const createNewSlug = this.props.dataModel.variables.Create_New_Slug
        const hoofdOnderdeelSlug = this.props.hoofdOnderdeelSlug
        const apiTest = this.props.apiTest

        return (
            <div>
                <Switch>
                    <Route
                        exact
                        path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/${createNewSlug}`}
                        render={({ match }) => (
                            <APITestCRUD
                                dataModel={this.props.dataModel}
                                ApiEndpoint={ApiEndpoint}
                                overzichtSlug={overzichtSlug}
                                history={this.props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/edit/:single`}
                        render={({ match }) => (
                            <APITestCRUD
                                dataModel={this.props.dataModel}
                                ApiEndpoint={ApiEndpoint}
                                overzichtSlug={overzichtSlug}
                                history={this.props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/:single/:version`}
                        render={({ match }) => (
                            <APITestDetail
                                apiTest={apiTest}
                                dataModel={this.props.dataModel}
                                history={this.props.history}
                                match={match}
                                hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/:single`}
                        render={({ match }) => (
                            <APITestDetail
                                apiTest={apiTest}
                                dataModel={this.props.dataModel}
                                history={this.props.history}
                                match={match}
                                hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/${hoofdOnderdeelSlug}/${overzichtSlug}/`}
                        render={() => (
                            <APITestOverzicht
                                hoofdOnderdeelSlug={
                                    this.props.hoofdOnderdeelSlug
                                }
                                dataModel={this.props.dataModel}
                                history={this.props.history}
                            />
                        )}
                    />
                </Switch>
            </div>
        )
    }
}

export default APITestRoutes
