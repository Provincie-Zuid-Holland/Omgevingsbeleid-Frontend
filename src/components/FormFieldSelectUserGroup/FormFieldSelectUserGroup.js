import React, { Component } from 'react'
import FormFieldSelectUser from './../FormFieldSelectUser'
import axios from './../../API/axios'
import LoaderSelect from './../LoaderSelect'

class FormFieldSelectUserGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gebruikersLijst: [],
        }
    }

    componentDidMount() {
        const ApiEndpoint = 'gebruikers'

        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then(res => {
                const objecten = res.data
                this.setState({
                    gebruikersLijst: objecten,
                })
            })
            .catch(error => {
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
                <span className="form-field-label">Personen</span>
                <div className="w-1/2 flex">
                    {crudObject['Opdrachtgever'] !== undefined &&
                    this.state.gebruikersLijst.length > 0 ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            halfWidth={true}
                            handleChange={this.props.handleChange}
                            fieldValue={crudObject['Opdrachtgever']}
                            dataObjectProperty="Opdrachtgever"
                            gebruikersLijst={this.state.gebruikersLijst}
                            // fieldLabel="Titel"
                            pValue="Opdrachtgever"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}
                </div>

                <div className="flex">
                    {crudObject['Eigenaar_1'] !== undefined &&
                    this.state.gebruikersLijst.length > 0 ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            handleChange={this.props.handleChange}
                            gebruikersLijst={this.state.gebruikersLijst}
                            fieldValue={crudObject['Eigenaar_1']}
                            dataObjectProperty="Eigenaar_1"
                            marginRight={true}
                            pValue="Eerste eigenaar"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}

                    {crudObject['Eigenaar_2'] !== undefined &&
                    this.state.gebruikersLijst.length > 0 ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            handleChange={this.props.handleChange}
                            gebruikersLijst={this.state.gebruikersLijst}
                            fieldValue={crudObject['Eigenaar_2']}
                            dataObjectProperty="Eigenaar_2"
                            pValue="Tweede eigenaar"
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                    ) : (
                        <LoaderSelect />
                    )}
                </div>

                <div className="flex">
                    {crudObject['Portefeuillehouder_1'] !== undefined &&
                    this.state.gebruikersLijst.length > 0 ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            handleChange={this.props.handleChange}
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

                    {crudObject['Portefeuillehouder_2'] !== undefined &&
                    this.state.gebruikersLijst.length > 0 ? (
                        <FormFieldSelectUser
                            editStatus={this.props.editStatus}
                            gebruikersLijst={this.state.gebruikersLijst}
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
