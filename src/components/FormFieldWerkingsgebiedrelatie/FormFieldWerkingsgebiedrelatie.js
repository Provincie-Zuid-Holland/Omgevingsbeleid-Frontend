import React from 'react'
import { toast } from 'react-toastify'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

import Select from 'react-select'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

/**
 * Function that returns null or options value based on the objectenArray.length. If the objectenArray.length is equal to 1, the function will return null
 * otherwise the objectenArray will return a new array list named options and skipping the first array value.
 *
 * @function
 *
 * @param {array} objectenArray - Parameter that is used in a conditional operator to check if the array length is longer then 1.
 * @param {string} dataObjectProperty - Parameter that is used to set the target name value of the new options array list.
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
 * Class that renders the FormFieldWerkingsgebiedrelatie component that displays a title and description using the imported component FormFieldTitelEnBeschrijving
 * and displays the imported Select component if the selectionArray.length state exceeds 0 and in which the user can select a werkingsgebiedrelatie(s) by using the component.
 *
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
     * Function that checks in a conditional operator if the props.fieldValue is not equal to the prevProps.fieldValue,
     * if so the selected variable will be updated with the search results of selectionArray.find otherwise the selected state will be set to the variable selected.
     *
     * @function
     *
     * @param {props} prevProps - Parameter used to check fieldValue with previous props.
     */
    componentDidUpdate(prevProps) {
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
     * Function to get werkingsgebieden through the axios API endpoint and to set the data to the objecten variable with the results and set the value to the selectionArray through the makeSelection function.
     *
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
