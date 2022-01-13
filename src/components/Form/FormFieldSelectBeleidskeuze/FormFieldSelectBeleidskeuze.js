import { Component } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'

import axios from '../../../api/axios'
import * as BELEIDSKEUZES from './../../../constants/beleidskeuzes'
import { LoaderSelect } from './../../Loader'

/**
 * Displays a box in which a user can make a selection.
 *
 * @param {array} objectenArray - Contains a collection of Beleidsbeslissingen.
 * @param {string} dataObjectProperty - Contains the property on the CrudObject we want to set the value to
 * @param {undefined|string} filterUUID - Optional to filter out objects based on a UUID value
 * @returns {array} Contains a list of options for the Select form field
 */
function makeSelection(objectenArray, dataObjectProperty, filterUUID) {
    let options = []

    // FilterUUID is used to filter out the item that initiates the new relation, so an object can't make a relation with itself
    if (filterUUID) {
        objectenArray = objectenArray.filter(item => item.UUID !== filterUUID)
    }

    objectenArray.forEach(arrayItem => {
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
 * @returns A select field to select a beleidskeuze
 */
class FormFieldSelectBeleidskeuze extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectionArray: [],
            selected: null,
            dataLoaded: false,
        }
    }

    /**
     * Update local state based if the fieldValue is a newly selected value
     * @param {props} prevProps - Previous Props
     */
    componentDidUpdate(prevProps) {
        if (this.props.fieldValue !== prevProps.fieldValue) {
            const selected = this.state.selectionArray.find(
                arrayItem => arrayItem.value === this.props.fieldValue
            )

            this.setState({
                selected: selected,
                dataLoaded: true,
            })
        }
    }
    /**
     * Get the beleidskeuzes, create selection and set in State
     */
    componentDidMount() {
        axios
            .get(BELEIDSKEUZES.API_ENDPOINT)
            .then(res => {
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
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    render() {
        return (
            <div className={`mb-6 w-full`}>
                <label
                    className="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                    htmlFor={this.props.dataObjectProperty}>
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
}

export default FormFieldSelectBeleidskeuze
