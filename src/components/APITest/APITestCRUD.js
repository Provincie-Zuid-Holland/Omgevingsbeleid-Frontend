import React, {
	Component
} from 'react'
import {
	format
} from 'date-fns'

import CrudContainer from './../Containers/CrudContainer'

// Import Axios instance to connect with the API
import axiosAPI from './../../axios'


// Function to see if property on object is editable
function getCRUDBoolean(dataModel, propertyName) {
	return dataModel.properties[propertyName].UI.userCRUD
}

// Function to see if an object is empty
function isEmpty(obj) {
	
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
	}
	return true;

}

// Function to make a list to see which properties on the object are editable by the user - EDIT OBJECT
function makeCrudPropertiesArray(dataModel) {


	// Make list of property names from object
	const propertyNames = Object.keys(dataModel.properties)

	// Check for each Property in propertyNames if property CRUD value is True and if True add to new Array
	const crudProperties = propertyNames.filter(propertyName => {
		return getCRUDBoolean(dataModel, propertyName)
	})

	return crudProperties

}


// Function to make an object containing the fields AND the data for CRUD actions
function makeCrudObject(array, responseObject) {

	let crudObject = {}
	if (isEmpty(responseObject)) {
		array.map((arrayItem, index) => {
			crudObject[[arrayItem][0]] = ""
		})
	} else {
		array.map((arrayItem, index) => {
			crudObject[[arrayItem][0]] = responseObject[arrayItem]
		})
	}
	
	return crudObject

}


class APITestCRUD extends Component {

	constructor(props) {

		super(props)

		// CrudObject contains the editable fields
		this.state = {
			edit: false,
			crudObject: {}
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

					const responseObject = res.data;
					const crudProperties = makeCrudPropertiesArray(dataModel)
					const crudObject = makeCrudObject(crudProperties, responseObject[0])

					this.setState({
						crudObject: crudObject
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
		} else {
			// Make CRUD Object with empty strings (!)
			const dataModel = this.props.dataModel
			const crudProperties = makeCrudPropertiesArray(dataModel)
			const crudObject = makeCrudObject(crudProperties)
			this.setState({
				crudObject: crudObject
			}, () => console.log(this.state));
		}
		
	}

	handleChange(event) {
		const name = event.target.name
		const type = event.target.type

		let value
		if (type === "date") {
			value = new Date(event.target.value)
		} else {
			value = event.target.value
		}
		this.setState(prevState => ({
			crudObject: {    
				...prevState.crudObject,
				[name]: value
			}
		}), () => console.log(this.state))

	}

	handleSubmit(event) {

		event.preventDefault();

		const objectID = this.props.match.params.single
		const overzichtSlug = this.props.overzichtSlug
		let crudObject = this.state.crudObject

		if (this.state.edit) {
			// Modified By Placeholder
			crudObject.Modified_By = "57bc2554-daec-478d-8e0c-b6c193532689"
			axiosAPI.patch(`${overzichtSlug}/${objectID}`, JSON.stringify(crudObject))
				.then(res => {
					console.log(res)
					this.props.history.push(`/${overzichtSlug}/${res.data.ID}`)
				}).catch((error) => {
					console.log(error);
				});
		} else {
			// Created By Placeholder
			crudObject.Created_By = "57bc2554-daec-478d-8e0c-b6c193532689"
			axiosAPI.post(`${overzichtSlug}`, JSON.stringify(crudObject))
				.then(res => {
					this.props.history.push(`/${overzichtSlug}/${res.data.ID}`)
				}).catch((error) => {
					console.log(error);
				});
		}

	}

	render() {

		// False if data is loading, true if there is a response
		let dataPending = isEmpty(this.state.crudObject)

		return ( <div> { dataPending ? null :
				<CrudContainer
					titelEnkelvoud = {
						this.props.dataModel.variables.Titel_Enkelvoud
					}
					overzichtSlug = {
						this.props.overzichtSlug
					}
					objectID = {
						this.props.match.params.single
					}
					editStatus = {
						this.state.edit
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
				/>
			} </div>

		)
	}

}

export default APITestCRUD;