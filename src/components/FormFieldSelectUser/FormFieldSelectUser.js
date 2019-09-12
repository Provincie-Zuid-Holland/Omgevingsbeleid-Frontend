import React from 'react'
import Select from 'react-select'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Import Components
import LoaderSelect from './../LoaderSelect'

function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 1) {
        return null
    } else {
        let options = []
        objectenArray.slice(1).forEach(arrayItem => {
            options.push({
                label: arrayItem.Gebruikersnaam,
                value: arrayItem.UUID,
                target: {
                    type: 'relatie',
                    value: arrayItem.UUID,
                    name: dataObjectProperty,
                },
            })
        })
        return options
    }
}

class FormFieldSelectUser extends React.Component {
    state = {
        selectionArray: [],
        selected: {},
    }

    render() {
        return (
            <div
                className={`mb-6 ${this.props.marginRight ? 'mr-8' : null} ${
                    this.props.halfWidth ? 'w-full mr-4' : 'w-1/2'
                }`}
            >
                <p className="form-field-description">{`${this.props.pValue}`}</p>
                {this.state.selectionArray.length === 0 ? (
                    <LoaderSelect />
                ) : (
                    <Select
                        value={this.state.selected}
                        onChange={this.props.handleChange}
                        options={this.state.selectionArray}
                    />
                )}
                {/* {this.state.selectionArray.length !== 0 ? (
                    <Select
                        value={this.state.selected}
                        onChange={this.props.handleChange}
                        options={this.state.selectionArray}
                    />
                ) : (
                    <LoaderSelect />
                )} */}
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.fieldValue !== prevProps.fieldValue) {
            const selected = this.state.selectionArray.find(
                arrayItem => arrayItem.value === this.props.fieldValue
            )
            this.setState({
                selected: selected,
            })
        }
    }

    componentDidMount() {
        const ApiEndpoint = 'gebruikers'

        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then(res => {
                const objecten = res.data
                const selectionArray = makeSelection(
                    objecten,
                    this.props.dataObjectProperty
                )

                if (this.props.editStatus === true) {
                    const selected = selectionArray.find(
                        arrayItem => arrayItem.value === this.props.fieldValue
                    )
                    this.setState({
                        selectionArray,
                        selected,
                    })
                } else {
                    this.setState({ selectionArray })
                }
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
}
export default FormFieldSelectUser
