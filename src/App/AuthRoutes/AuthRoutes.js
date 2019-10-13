import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

// Import Data Model
import dataModel from './../dataModel'

// Import HTTP Client
import axios from './../../API/axios'

// Import Pages
import MuteerDashboard from './../../pages/MuteerDashboard'
import MuteerMijnBeleid from './../../pages/MuteerMijnBeleid'
import MuteerMeldingen from './../../pages/MuteerMeldingen'
import MuteerApiTest from './../../pages/MuteerApiTest'
import MuteerUniversalObjectOverzicht from './../../pages/MuteerUniversalObjectOverzicht'
import MuteerUniversalObjectDetail from './../../pages/MuteerUniversalObjectDetail'
import MuteerUniversalObjectCRUD from './../../pages/MuteerUniversalObjectCRUD'
import MuteerApiTestOverzicht from './../../pages/MuteerApiTestOverzicht'
import MuteerVerordening from './../../pages/MuteerVerordening'
// import MuteerMaatregelen from './../../pages/MuteerMaatregelen'
// import MuteerBeleidsbeslissingen from './../../pages/MuteerBeleidsbeslissingen'
// import MuteerBeleidsRegels from './../../pages/MuteerBeleidsRegels'

// Import Components
import AuthenticationWrapper from './../../components/AuthenticationWrapper'

// This component renders the appropriate view to the the object in the DataModel
// This component is rendered with the following URL /api-test/${object} in AuthRoutes
function APITestRoutes(props) {
    // The dataModel prop consists of the specified Object from the datamodel (e.g. dataModel.Ambitie)
    // Based on this we declare the variables
    const overzichtSlug = props.dataModel.variables.Overzicht_Slug
    const ApiEndpoint = props.dataModel.variables.Api_Endpoint
    const createNewSlug = props.dataModel.variables.Create_New_Slug
    const hoofdOnderdeelSlug = props.hoofdOnderdeelSlug
    const apiTest = props.apiTest

    return (
        <div>
            <Switch>
                <Route
                    exact
                    path={`/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}/${createNewSlug}`}
                    render={({ match }) => (
                        <MuteerUniversalObjectCRUD
                            dataModel={props.dataModel}
                            ApiEndpoint={ApiEndpoint}
                            overzichtSlug={overzichtSlug}
                            history={props.history}
                            match={match}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}/edit/:single`}
                    render={({ match }) => (
                        <MuteerUniversalObjectCRUD
                            dataModel={props.dataModel}
                            ApiEndpoint={ApiEndpoint}
                            overzichtSlug={overzichtSlug}
                            history={props.history}
                            match={match}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}/:single/:version`}
                    render={({ match }) => (
                        <MuteerUniversalObjectDetail
                            apiTest={apiTest}
                            dataModel={props.dataModel}
                            history={props.history}
                            match={match}
                            hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}/:single`}
                    render={({ match }) => (
                        <MuteerUniversalObjectDetail
                            apiTest={apiTest}
                            dataModel={props.dataModel}
                            history={props.history}
                            match={match}
                            hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                        />
                    )}
                />
                <Route
                    exact
                    path={`/muteer/${hoofdOnderdeelSlug}/${overzichtSlug}/`}
                    render={() => (
                        <MuteerApiTestOverzicht
                            hoofdOnderdeelSlug={props.hoofdOnderdeelSlug}
                            dataModel={props.dataModel}
                            history={props.history}
                        />
                    )}
                />
            </Switch>
        </div>
    )
}

function BeheerRoutes(props) {
    const beheerRoutesList = props.beheerRoutesList

    const BeheerRouteJSX = beheerRoutesList.map(item => {
        const slug = item.slug
        const dataModelProperty = item.dataModelProperty

        // Variables
        const overzichtSlug =
            dataModel[dataModelProperty].variables.Overzicht_Slug
        const apiEndpoint = dataModel[dataModelProperty].variables.Api_Endpoint
        console.log(apiEndpoint)
        const filteredDataModel = dataModel[dataModelProperty]
        const createNewSlug =
            dataModel[dataModelProperty].variables.Create_New_Slug

        return (
            <React.Fragment key={item.slug}>
                <Switch>
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/${createNewSlug}`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                dataModel={filteredDataModel}
                                ApiEndpoint={apiEndpoint}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single/:version`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                ApiEndpoint={apiEndpoint}
                                dataModel={filteredDataModel}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/edit/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectCRUD
                                ApiEndpoint={apiEndpoint}
                                dataModel={filteredDataModel}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/:single/:version`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                dataModel={filteredDataModel}
                                overzichtSlug={overzichtSlug}
                                history={props.history}
                                match={match}
                                hoofdOnderdeelSlug={overzichtSlug}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`/muteer/${overzichtSlug}/:single`}
                        render={({ match }) => (
                            <MuteerUniversalObjectDetail
                                dataModel={filteredDataModel}
                                history={props.history}
                                overzichtSlug={overzichtSlug}
                                match={match}
                                hoofdOnderdeelSlug={overzichtSlug}
                            />
                        )}
                    />
                    <Route
                        path={`/muteer/${overzichtSlug}`}
                        exact
                        render={() => (
                            <MuteerUniversalObjectOverzicht
                                dataModel={filteredDataModel}
                                history={props.history}
                            />
                        )}
                    />
                </Switch>
            </React.Fragment>
        )
    })

    return BeheerRouteJSX
}

class AuthRoutes extends Component {
    constructor(props) {
        super(props)
        this.redirectToLogin = this.redirectToLogin.bind(this)
    }

    redirectToLogin() {
        localStorage.removeItem('access_token')
        this.props.history.push('/login')
    }

    componentDidMount() {
        // Als de app gemount wordt, wordt de huidige token gechecked
        axios.get('/tokeninfo').catch(error => {
            // this.redirectToLogin()
        })
    }

    render() {
        const beheerRoutesList = [
            {
                slug: 'beleidsregels',
                dataModelProperty: 'BeleidsRegel',
            },
            {
                slug: 'maatregelen',
                dataModelProperty: 'Maatregelen',
            },
            {
                slug: 'opgaven',
                dataModelProperty: 'Opgave',
            },
            {
                slug: 'ambities',
                dataModelProperty: 'Ambitie',
            },
            {
                slug: 'belangen',
                dataModelProperty: 'Belang',
            },
            {
                slug: 'themas',
                dataModelProperty: 'Themas',
            },
            {
                slug: 'beleidsbeslissingen',
                dataModelProperty: 'Beleidsbeslissingen',
            },
        ]

        return (
            <React.Fragment>
                <Switch>
                    {/* Omgevingsbeleid Routes */}
                    <Route
                        exact
                        path="/muteer/dashboard"
                        render={() => (
                            <MuteerDashboard authUser={this.props.authUser} />
                        )}
                    />
                    <Route
                        exact
                        path="/muteer/mijn-beleid"
                        render={() => (
                            <MuteerMijnBeleid authUser={this.props.authUser} />
                        )}
                    />
                    <Route
                        exact
                        path="/muteer/mijn-meldingen"
                        component={MuteerMeldingen}
                    />

                    <BeheerRoutes
                        beheerRoutesList={beheerRoutesList}
                        history={this.props.history}
                    />

                    {/* Verordening Pagina Routes */}
                    <Route
                        path="/muteer/verordening"
                        exact
                        render={() => (
                            <MuteerVerordening
                                dataModel={dataModel.Verordening}
                                history={this.props.history}
                            />
                        )}
                    />
                </Switch>
            </React.Fragment>
        )
    }
}

// Export with authentication layer
export default AuthenticationWrapper(AuthRoutes)
