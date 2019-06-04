import React, { Component } from 'react'
import { format } from 'date-fns'


import CrudContainer from './../Containers/CrudContainer'

// Import Axios instance to connect with the API
import axiosAPI from './../../axios'


// Function to see if property on object is editable
function getCRUDBoolean(dataModel, propertyName) {
    return dataModel.properties[propertyName].UI.userCRUD
}

// Function to make an array containing ONLY the fields for CRUD actions
function makeCrudProperties(responseObject, dataModel) {

    // Make list of property names from returned object
    const propertyNames = Object.keys(responseObject[0])

    // Check for each Property in propertyNames if property CRUD value is True and if True add to new Array
    const crudProperties = propertyNames.filter(propertyName => {
        return getCRUDBoolean(dataModel, propertyName)
    })

    // Return array with CRUD Properties
    return crudProperties

}


// Function to make an array containing the fields AND the data for CRUD actions
function makeCrudObject(array, responseObject) {

    const crudList = array.map((arrayItem, index) => {
        return {
            name: [arrayItem][0],
            value: responseObject[arrayItem]
        }
    })
    return crudList

}


class APITestForm extends Component {

    constructor(props) {

        super(props)

        // CrudProperties contains the fields that are editable (Used for new)
        // CrudObject contains the fields and current value (Used for Edit)
        this.state = {
            edit: false,
            crudProperties: [],
            crudObject: []
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {

        // Single parameter === object-id; user is editing an existing object
        if (this.props.match.params.single) {

            this.setState({
                edit: true
            })

            const dataModel = this.props.dataModel
            const objectID = this.props.match.params.single
            const ApiEndpoint = this.props.dataModel.variables.Api_Endpoint

            // Connect with API
            axiosAPI.get(`${ApiEndpoint}/${objectID}`)
                .then(res => {

                    const res_ambitie = res.data;
                    const crudProperties = makeCrudProperties(res_ambitie, dataModel)
                    const crudObject = makeCrudObject(crudProperties, res_ambitie[0])

                    this.setState({
                        crudObject: crudObject,
                        crudProperties: crudProperties
                    });

                }).catch((error) => {
                    if (error.response !== undefined) {
                        if (error.response.status === 401) {
                            localStorage.removeItem('access_token')
                            this.props.history.push('/login')
                        }
                    } else {
                        console.log(error);
                    }
                })
        }
    }

    handleChange(event) {
        const name = event.target.name

        let value
        if (name === "Begin_Geldigheid" || name === "Eind_Geldigheid") {
            value = new Date(event.target.value)
        } else {
            value = event.target.value
        }
        this.setState({
            [name]: value
        }, () => console.log(this.state));
    }

    handleSubmit(event) {

        event.preventDefault();

        let ambitieObject = {
            Titel: this.state.Titel,
            Omschrijving: this.state.Omschrijving,
            Weblink: this.state.Weblink,
            Begin_Geldigheid: this.state.Begin_Geldigheid,
            Eind_Geldigheid: this.state.Eind_Geldigheid,
        }

        if (this.state.edit) {
            ambitieObject.Modified_By = "57bc2554-daec-478d-8e0c-b6c193532689"
            axiosAPI.patch(`ambities/${this.props.match.params.single}`, JSON.stringify(ambitieObject))
                .then(res => {
                    console.log(res)
                    this.props.history.push(`/ambities/${res.data.ID}`)
                }).catch((error) => {
                    console.log(error);
                });
        } else {
            ambitieObject.Created_By = "57bc2554-daec-478d-8e0c-b6c193532689"
            axiosAPI.post('ambities', JSON.stringify(ambitieObject))
                .then(res => {
                    this.props.history.push(`/ambities/${res.data.ID}`)
                }).catch((error) => {
                    console.log(error);
                });
        }

    }

    render() {

        // False if data is loading, true if there is a response
        let dataReceived = (this.state.crudProperties.length !== 0);
        console.log(this.state)

        return ( 
            <div> { dataReceived ? 
                <CrudContainer
                objectID = {
                    this.props.match.params.single
                }
                editStatus = {
                    this.state.editStatus
                }
                handleSubmit = {
                    this.handleSubmit
                }
                handleChange = {
                    this.handleChange
                }
                crudObject = {
                    this.state.crudObject
                }
                /> : null
            } </div>

        )
    }

}

export default APITestForm;