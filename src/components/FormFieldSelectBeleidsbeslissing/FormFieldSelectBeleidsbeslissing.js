import React from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Import Components
import LoaderSelect from './../LoaderSelect'

/**
 * Function to filter through the objectenArray.
 *
 * @function
 *
 * @param {array} objectenArray - Array containing a collection of Beleidsbeslissingen.
 * @param {string} dataObjectProperty - The name of one of the Beleidsbeslissingen.
 * @param {string} filterUUID - FilterUUID is used to filter out the item that initiates the new relation, so an object can't make a relation with itself
 */
function makeSelection(objectenArray, dataObjectProperty, filterUUID) {
    let options = []

    // FilterUUID is used to filter out the item that initiates the new relation, so an object can't make a relation with itself
    if (filterUUID) {
        objectenArray = objectenArray.filter((item) => item.UUID !== filterUUID)
    }

    objectenArray.forEach((arrayItem) => {
        options.push({
            label: arrayItem.Titel,
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

/**
 * Class that renders the FormFieldSelectBeleidsbeslissing.
 *
 * @class
 * @extends React.Component
 */
class FormFieldSelectBeleidsbeslissing extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectionArray: [],
            selected: null,
            dataLoaded: false,
        }
    }

    render() {
        return (
            <div className={`mb-6 w-full`}>
                <label
                    className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                    htmlFor={this.props.dataObjectProperty}
                >
                    {this.props.fieldLabel ? this.props.fieldLabel : null}
                </label>
                <p className="form-field-description">
                    {this.props.pValue ? this.props.pValue : null}
                </p>
                {this.state.dataLoaded ? (
                    <Select
                        id={`form-field-${this.props.titleSingular.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        value={this.state.selected}
                        name={this.props.dataObjectProperty}
                        onChange={this.props.handleChange}
                        options={this.state.selectionArray}
                        placeholder={`Selecteer...`}
                    />
                ) : (
                    <LoaderSelect />
                )}
            </div>
        )
    }

    /**
     * Function to find the selected state and to set the state.
     *
     * @Function
     *
     * @param {props} prevProps - Previous set property.
     * @param {state} prevState - Previous set state, not used in this function.
     * @param {*} snapshot - is a feature of Jest that allows you to test Javascript objects, not used in this function.
     */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.fieldValue !== prevProps.fieldValue) {
            const selected = this.state.selectionArray.find(
                (arrayItem) => arrayItem.value === this.props.fieldValue
            )
            this.setState({
                selected: selected,
                dataLoaded: true,
            })
        }
    }
    /**
     * Function to get Beleidsbeslissingen to connect with through axios to an API.
     *
     * @function
     */
    componentDidMount() {
        const ApiEndpoint = 'beleidsbeslissingen'
        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then((res) => {
                const objecten = res.data.sort((a, b) =>
                    a.Titel > b.Titel ? 1 : -1
                )

                this.setState({
                    selectionArray: makeSelection(
                        objecten,
                        this.props.dataObjectProperty,
                        this.props.filter
                    ),
                    dataLoaded: true,
                })
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }
}

export default FormFieldSelectBeleidsbeslissing
