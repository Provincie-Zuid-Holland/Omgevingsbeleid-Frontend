import React, {	Component } from 'react'
import { Prompt } from 'react-router'
import { format } from 'date-fns'
import { APIcontext } from './../Context/APIcontext'

import CrudContainer from './../Containers/CrudContainer'

// Import Axios instance to connect with the API
import axiosAPI from './../../API/axios'


// Function to see if property on object is editable
function getCRUDBoolean(dataModel, propertyName) {
	return dataModel.properties[propertyName].UI.userCRUD
}

// Function to see if an object is empty
function isEmpty(obj) {
	
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false
	}
	return true

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
		array.forEach((arrayItem, index) => {
			if (
				arrayItem === "Verplicht_Programma" ||
				arrayItem === "Specifiek_Of_Generiek"
			) {
				crudObject[[arrayItem][0]] = " - selecteer een optie - "
			} else {
				crudObject[[arrayItem][0]] = ""
			}
		})
	} else {
		array.forEach((arrayItem, index) => {
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
			crudObject: {},
			formDataChanged: false
		};

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.setEditorState = this.setEditorState.bind(this)

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

					if (crudObject.Begin_Geldigheid !== undefined) {
						crudObject.Begin_Geldigheid = format(crudObject.Begin_Geldigheid, "YYYY-MM-DD")
					}
					if (crudObject.Eind_Geldigheid !== undefined) {
						crudObject.Eind_Geldigheid = format(crudObject.Begin_Geldigheid, "YYYY-MM-DD")
					}

					this.setState({
						crudObject: crudObject
					}, () => console.log(this.state));

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
			})
		}
		
	}

	handleChange(event) {

		if (this.state.formDataChanged === false) {
			this.setState({
				formDataChanged: true
			})
		}

		const name = event.target.name
		const type = event.target.type 

		let value = event.target.value
		if (type === "date") {
			console.log("Value:")
			console.log(event.target.value)
			value = event.target.value
		}

		this.setState(prevState => ({
			crudObject: {    
				...prevState.crudObject,
				[name]: value
			}
		}))

	}

	// Algemene State Handler voor de Editor
	setEditorState(stateValue, fieldName) {

		this.setState(prevState => ({
			crudObject: {    
				...prevState.crudObject,
				[fieldName]: stateValue
			}
		}))

	}

	handleSubmit(event) {

		event.preventDefault();

		const objectID = this.props.match.params.single
		const overzichtSlug = this.props.overzichtSlug
		const ApiEndpoint = this.props.ApiEndpoint
		const loggedInUserUUID = JSON.parse(localStorage.getItem('identifier')).UUID

		let crudObject = this.state.crudObject

		if (crudObject.Begin_Geldigheid !== undefined) {
			crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
		}
		if (crudObject.Eind_Geldigheid !== undefined) {
			crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
		}

		if (this.state.edit) {
			// Modified By Placeholder
			// crudObject.Modified_By = loggedInUserUUID
			axiosAPI.patch(`${ApiEndpoint}/${objectID}`, JSON.stringify(crudObject))
				.then(res => {
					if (this.props.match.path.includes("api-test")) {
						this.props.history.push(`/api-test/${overzichtSlug}/${res.data.ID}`)
					} else {
						this.props.history.push(`/${overzichtSlug}/${res.data.ID}`)
					}
				}).catch((error) => {
					console.log(error);
				});
		} else {
			// Created By Placeholder
			// crudObject.Created_By = loggedInUserUUID
			axiosAPI.post(`${ApiEndpoint}`, JSON.stringify(crudObject))
				.then(res => {
					if (this.props.match.path.includes("api-test")) {
						this.props.history.push(`/api-test/${overzichtSlug}/${res.data.ID}`)
					} else {
						this.props.history.push(`/${overzichtSlug}/${res.data.ID}`)
					}
				}).catch((error) => {
					console.log(error);
				});
		}

	}

	render() {

		const contextObject = {
			titelEnkelvoud: 	this.props.dataModel.variables.Titel_Enkelvoud,
			titelMeervoud: 		this.props.dataModel.variables.Titel_Meervoud,
			overzichtSlug: 		this.props.overzichtSlug,
			objectID: 			this.props.match.params.single,
			editStatus: 		this.state.edit,
			handleSubmit: 		this.handleSubmit,
			handleChange: 		this.handleChange,
			crudObject: 		this.state.crudObject,
			setEditorState: 	this.setEditorState,
		}

		// False if data is loading, true if there is a response
		let dataPending = isEmpty(this.state.crudObject)

		return ( 
			<div> 
				{ dataPending ? null :
				<APIcontext.Provider value={contextObject}>
					<CrudContainer/>
					<Prompt
						message="Er zijn niet opgeslagen wijzigingen. Weet u zeker dat u de pagina wil verlaten?"
						when={this.state.formDataChanged}
					/>

				</APIcontext.Provider>
				} 
			</div>

		)
	}

}

export default APITestCRUD;