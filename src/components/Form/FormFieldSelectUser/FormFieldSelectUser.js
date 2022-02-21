import { Component } from 'react'
import Select from 'react-select'

// Import Components
import { LoaderSelect } from './../../Loader'

/**
 * Function that checks if the objectenArray contains a value by checking the length,
 * otherwise it will map through each array item and returns the set value for each variable in the options object.
 *
 * @param {array} objectenArray - Contains an array that is used to set the value for each variable of options.
 * @param {string} dataObjectProperty - Used to set the name variable of the target variable of options.
 */
function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 0) {
        return []
    } else {
        let options = []
        objectenArray.forEach(arrayItem => {
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

/**
 * Displays a dropdownfield in which the user can select a user based on the role given.
 */
class FormFieldSelectUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectionArray: [],
            selected: null,
            dataLoaded: false,
        }

        this.getSelected = this.getSelected.bind(this)
    }

    /**
     * Function to find the selected value in the selectionArray.
     *
     * @param {string | object} fieldValue - Value used to find arrayItem within selectionArray.
     * @param {array} selectionArray - Contains a list of users.
     */
    getSelected(fieldValue, selectionArray) {
        let selected = null
        if (typeof fieldValue === 'string') {
            selected = selectionArray.find(
                arrayItem => arrayItem.value === fieldValue
            )
        } else if (typeof fieldValue === 'object' && fieldValue !== null) {
            selected = selectionArray.find(
                arrayItem => arrayItem.value === fieldValue.UUID
            )
        }
        return selected
    }
    /**
     * Function to update the prevProps and set the state variables only if the current fielValue is not equal to the previous fieldValue.
     *
     * @param {props} prevProps - Parameter that is used to show the previous property value.
     */
    componentDidUpdate(prevProps) {
        const fieldValue = this.props.fieldValue

        if (fieldValue !== prevProps.fieldValue) {
            const selected = this.getSelected(
                fieldValue,
                this.state.selectionArray
            )

            this.setState({
                selected: selected,
                dataLoaded: true,
            })
        }
    }

    /**
     * Function to set the state of the props given based on the conditional operators.
     *
     */
    componentDidMount() {
        let fieldValue = this.props.fieldValue

        if (fieldValue && typeof fieldValue === 'object' && fieldValue.UUID) {
            fieldValue = fieldValue.UUID
        }

        const objecten = this.props.gebruikersLijst
            .sort((a, b) => (a.Gebruikersnaam > b.Gebruikersnaam ? 1 : -1))
            .filter(e => e.Rol === this.props.filter)

        const selectionArray = makeSelection(
            objecten,
            this.props.dataObjectProperty
        )

        if (
            this.props.editStatus === true ||
            (this.props.titleSingular === 'Beleidskeuze' &&
                this.props.dataObjectProperty === 'Eigenaar_1' &&
                selectionArray)
        ) {
            const selected = this.getSelected(fieldValue, selectionArray)

            this.setState({
                selectionArray: selectionArray,
                selected: selected,
                dataLoaded: true,
            })
        } else {
            this.setState({ selectionArray: selectionArray, dataLoaded: true })
        }
    }

    /**
     * Function that returns filtered select options, based on the filterOtherProperty prop
     * This makes sure a user can't select a previously selected user (e.g. eigenaar_1 and eigenaar_2 can't be the same user)
     */
    getOptions() {
        const filterOtherProperty = this.props.filterOtherProperty

        if (filterOtherProperty) {
            return this.state.selectionArray.filter(e => {
                const filterTypeIsString =
                    typeof filterOtherProperty === 'string'
                const filterTypeIsObject =
                    typeof filterOtherProperty === 'object' &&
                    filterOtherProperty !== null

                /**
                 * If the filterType is a string containing the UUID, we return it
                 * If it is an object, we get the UUID string and return that
                 */
                const filterOtherPropertyUUID = filterTypeIsString
                    ? filterOtherProperty
                    : filterTypeIsObject
                    ? filterOtherProperty.UUID
                    : filterOtherProperty

                /**
                 * Filter out select options with a value that is the same as the 'filterOtherPropertyUUID'
                 */
                return e.value !== filterOtherPropertyUUID
            })
        } else {
            return this.state.selectionArray
        }
    }

    render() {
        const customStyles = {
            control: base => ({
                ...base,
                borderColor: 'none',
                borderWidth: '0px',
                '&:hover': {
                    borderColor: 'none',
                    borderWidth: '0px',
                    boxShadow: 'none',
                },
                '&.is-focused': {
                    borderColor: 'none',
                    borderWidth: '0px',
                    boxShadow: 'none',
                },
            }),
        }

        return (
            <div
                className={`mb-6 ${this.props.marginRight ? 'mr-8' : null} ${
                    this.props.halfWidth ? 'w-full mr-4' : 'w-1/2'
                }`}>
                <p className="form-field-description">{`${this.props.pValue}`}</p>
                {this.state.dataLoaded ? (
                    <Select
                        isDisabled={this.props.disabled}
                        id={`form-field-${this.props.titleSingular.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        className="border border-gray-400 rounded hover:border-gray-500 focus:border-gray-500"
                        name={this.props.dataObjectProperty}
                        value={this.state.selected}
                        onChange={(e, metaInfo) => {
                            this.props.handleChange(
                                e,
                                metaInfo,
                                this.props.dataObjectProperty
                            )
                        }}
                        styles={customStyles}
                        isClearable={true}
                        options={this.getOptions()}
                        placeholder={`Selecteer...`}></Select>
                ) : (
                    <LoaderSelect />
                )}
            </div>
        )
    }
}
export default FormFieldSelectUser
