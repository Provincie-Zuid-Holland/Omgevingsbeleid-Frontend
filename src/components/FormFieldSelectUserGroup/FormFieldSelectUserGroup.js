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
        axios
            .get('gebruikers')
            .then((res) => {
                const objecten = res.data
                this.setState({
                    gebruikersLijst: objecten,
                    dataLoaded: true,
                })
            })
            .catch((error) => {
                this.setState({
                    dataLoaded: true,
                    error: true,
                })
                console.log(error)
            })
    }

    render() {
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
                <span className="block mb-2 text-sm font-bold tracking-wide text-gray-700">
                    Personen
                </span>
                <div className="flex w-1/2">
                    {this.state.dataLoaded && !this.state.error ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            halfWidth={true}
                            handleChange={this.props.handleChange}
                            fieldValue={crudObject['Opdrachtgever']}
                            dataObjectProperty="Opdrachtgever"
                            gebruikersLijst={this.state.gebruikersLijst}
                            filter={'Ambtelijk opdrachtgever'}
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
                            filterOtherProperty={crudObject['Eigenaar_2']}
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
                            filterOtherProperty={crudObject['Eigenaar_1']}
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
                            filterOtherProperty={
                                crudObject['Portefeuillehouder_2']
                            }
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
                            filterOtherProperty={
                                crudObject['Portefeuillehouder_1']
                            }
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
