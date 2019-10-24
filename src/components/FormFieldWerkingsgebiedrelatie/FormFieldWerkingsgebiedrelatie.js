import React from 'react'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

import Select from 'react-select'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 1) {
        return null
    } else {
        let options = []
        objectenArray.slice(1).forEach(arrayItem => {
            options.push({
                label: arrayItem.Werkingsgebied,
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

class FormFieldWerkingsgebiedrelatie extends React.Component {
    state = {
        selectionArray: [],
        selected: {},
    }

    render() {
        return (
            <div className="w-50 mb-6">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    hideObjectLabel={this.props.hideObjectLabel}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />
                {this.state.selectionArray.length !== 0 ? (
                    <Select
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        value={this.state.selected}
                        onChange={this.props.handleChange}
                        options={this.state.selectionArray}
                    />
                ) : (
                    'Loading...'
                )}
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
        const ApiEndpoint = 'werkingsgebieden'

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

export default FormFieldWerkingsgebiedrelatie
