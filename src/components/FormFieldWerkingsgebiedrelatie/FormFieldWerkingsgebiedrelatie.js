import React from 'react'
import { toast } from 'react-toastify'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

import Select from 'react-select'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

/**
 * Function to push values to dataObjectProperty if objectenArray.length not equal to 1.
 *
 * @function
 *
 * @param {array} objectenArray - Parameter used in an if else statement.
 * @param {string} dataObjectProperty - Parameter that is used to set the option of objectenArray.
 */
function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 1) {
        return null
    } else {
        let options = []
        objectenArray.slice(1).forEach((arrayItem) => {
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

/**
 * Class that renders the FormFieldWerkingsgebiedrelatie.
 *
 * @class
 * @extends React.Component
 */
class FormFieldWerkingsgebiedrelatie extends React.Component {
    state = {
        selectionArray: [],
        selected: {},
    }

    render() {
        return (
            <div className="mb-6">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    titleSingular={this.props.titleSingular}
                />
                {this.state.selectionArray.length !== 0 ? (
                    <Select
                        id={`form-field-${this.props.titleSingular.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
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

    /**
     * Function to find arrayItem within selectionArray.
     *
     * @function
     *
     * @param {props} prevProps - Parameter used to check fieldValue with previous props.
     * @param {string} prevState - Parameter not used in this function.
     * @param {*} snapshot - Parameter that is not used in this function.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.fieldValue !== prevProps.fieldValue) {
            const selected = this.state.selectionArray.find(
                (arrayItem) => arrayItem.value === this.props.fieldValue
            )
            this.setState({
                selected: selected,
            })
        }
    }

    /**
     * Function to get werkingsgebieden through the axios API.
     *
     * @function
     */
    componentDidMount() {
        const ApiEndpoint = 'werkingsgebieden'

        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then((res) => {
                const objecten = res.data
                const selectionArray = makeSelection(
                    objecten,
                    this.props.dataObjectProperty
                )

                if (this.props.editStatus === true) {
                    const selected = selectionArray.find(
                        (arrayItem) => arrayItem.value === this.props.fieldValue
                    )
                    this.setState({
                        selectionArray,
                        selected,
                    })
                } else {
                    this.setState({ selectionArray })
                }
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }
}

export default FormFieldWerkingsgebiedrelatie
