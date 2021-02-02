import React, { Component } from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'
import CreatableSelect from 'react-select/creatable'

// In CrudObject state: een comma seperated string
// In local state: een array met items

/**
 * Class that renders the FormFieldTags.
 *
 * @class
 * @extends Component
 */
class FormFieldTags extends Component {
    constructor(props) {
        super(props)
        let selectionArray = ''
        if (this.props.fieldValue) {
            selectionArray = this.props.fieldValue.split(',')
            selectionArray = selectionArray.map((e) => {
                return {
                    value: e,
                    label: e,
                }
            })
        }
        this.state = {
            selectionArray: selectionArray,
            selected: null,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    /**
     * Function to change the name and value variables.
     *
     * @function
     *
     * @param {array} newValue - New array that will be set as a new value.
     * @param {object} actionMeta - 001
     */
    handleChange = (newValue, actionMeta) => {
        if (newValue) {
            this.setState({
                selectionArray: newValue,
            })
            const tags = newValue.map((i) => i.label).join(', ')
            const event = {
                target: {
                    name: 'Tags',
                    value: tags,
                },
            }
            this.props.handleChange(event, actionMeta)
        }
    }

    render() {
        return (
            <div className="w-full">
                <div className="w-full px-3 mb-6">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        titleSingular={this.props.titleSingular}
                    />
                    <CreatableSelect
                        id={`form-field-${this.props.titleSingular.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        isMulti
                        onChange={this.handleChange}
                        value={this.state.selectionArray}
                        placeholder={'Type hier uw tag(s)'}
                        className="py-2"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: '0.25rem',
                            colors: {
                                ...theme.colors,
                                primary: '#a0aec0',
                            },
                        })}
                        noOptionsMessage={(inputValue) =>
                            'Nog geen bestaande tags'
                        }
                        formatCreateLabel={(inputValue) =>
                            `Creëer de tag '${inputValue}'`
                        }
                    />
                </div>
            </div>
        )
    }
}

export default FormFieldTags
