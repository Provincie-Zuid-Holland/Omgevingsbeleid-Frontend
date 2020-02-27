import React, { Component } from 'react'
import FormFieldSelectUser from './../FormFieldSelectUser'
import axios from './../../API/axios'
import LoaderSelect from './../LoaderSelect'

class FormFieldSelectUserGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gebruikersLijst: [],
            dataLoaded: false,
            error: false,
        }
    }

    componentDidMount() {
        const ApiEndpoint = 'gebruikers'

        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then(res => {
                const objecten = res.data
                this.setState(
                    {
                        gebruikersLijst: objecten,
                        dataLoaded: true,
                    },
                    () => console.log(this.state)
                )
            })
            .catch(error => {
                this.setState({
                    dataLoaded: true,
                    error: true,
                })
                // !REFACTOR! Add toast notification al er iets mis gaat
                if (error.response !== undefined) {
                    if (error.response.status === 401) {
                        localStorage.removeItem('access_token')
                        this.props.history.push('/login')
                    }
                } else {
                    console.log(error)
                }
            })
    }

    render() {
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
                <span className="block tracking-wide text-gray-700 text-sm font-bold mb-2">
                    Personen
                </span>
                <div className="w-1/2 flex">
                    {this.state.dataLoaded && !this.state.error ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            halfWidth={true}
                            handleChange={this.props.handleChange}
                            fieldValue={crudObject['Opdrachtgever']}
                            dataObjectProperty="Opdrachtgever"
                            gebruikersLijst={this.state.gebruikersLijst}
                            filter={'Opdrachtgever'}
                            // fieldLabel="Titel"
                            pValue="Ambtelijk opdrachtgever"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}
                </div>

                <div className="flex">
                    {this.state.dataLoaded && !this.state.error ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            handleChange={this.props.handleChange}
                            gebruikersLijst={this.state.gebruikersLijst}
                            fieldValue={crudObject['Eigenaar_1']}
                            dataObjectProperty="Eigenaar_1"
                            marginRight={true}
                            filter={'Behandelend Ambtenaar'}
                            pValue="Eerste eigenaar"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}

                    {this.state.dataLoaded && !this.state.error ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            handleChange={this.props.handleChange}
                            gebruikersLijst={this.state.gebruikersLijst}
                            fieldValue={crudObject['Eigenaar_2']}
                            dataObjectProperty="Eigenaar_2"
                            filter={'Behandelend Ambtenaar'}
                            pValue="Tweede eigenaar"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}
                </div>

                <div className="flex">
                    {this.state.dataLoaded && !this.state.error ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            handleChange={this.props.handleChange}
                            filter={'Portefeuillehouder'}
                            gebruikersLijst={this.state.gebruikersLijst}
                            fieldValue={crudObject['Portefeuillehouder_1']}
                            dataObjectProperty="Portefeuillehouder_1"
                            marginRight={true}
                            pValue="Eerste portefeuillehouder"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}

                    {this.state.dataLoaded && !this.state.error ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            gebruikersLijst={this.state.gebruikersLijst}
                            filter={'Portefeuillehouder'}
                            handleChange={this.props.handleChange}
                            fieldValue={crudObject['Portefeuillehouder_2']}
                            dataObjectProperty="Portefeuillehouder_2"
                            pValue="Tweede portefeuillehouder"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}
                </div>
            </React.Fragment>
        )
    }
}

export default FormFieldSelectUserGroup
