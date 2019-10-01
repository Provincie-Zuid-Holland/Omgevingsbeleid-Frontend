import React, { Component } from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'
import CreatableSelect from 'react-select/creatable'

// In CrudObject state: een comma seperated string
// In local state: een array met items

class FormFieldTags extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectionArray: JSON.parse(this.props.fieldValue) || [],
            selected: null,
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = (newValue, actionMeta) => {
        if (newValue) {
            this.setState(
                {
                    selectionArray: newValue,
                },
                () => {
                    console.log(this.state)
                }
            )
            const event = {
                target: {
                    name: 'Tags',
                    value: JSON.stringify(newValue),
                },
            }
            this.props.handleChange(event)
        }
    }

    render() {
        console.log(this.state)
        return (
            <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        hideObjectLabel={this.props.hideObjectLabel}
                        titelEnkelvoud={this.props.titelEnkelvoud}
                    />
                    <CreatableSelect
                        isMulti
                        onChange={this.handleChange}
                        value={this.state.selectionArray}
                        placeholder={'Type hier uw tag(s)'}
                        theme={theme => ({
                            ...theme,
                            borderRadius: '0.25rem',
                            colors: {
                                ...theme.colors,
                                primary: '#a0aec0',
                            },
                        })}
                        noOptionsMessage={inputValue =>
                            'Nog geen bestaande tags'
                        }
                        formatCreateLabel={inputValue =>
                            `Creëer de tag '${inputValue}'`
                        }
                    />

                    {/* <input
                        required
                        // value={this.props.fieldValue}
                        // onChange={this.props.handleChange}
                        onChange={this.handleChange}
                        value={this.state.fieldValue}
                        onKeyPress={this.handleTagsChange}
                        name={this.props.dataObjectProperty}
                        className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none hover:border-gray-500 focus:border-gray-500"
                        id="titel"
                        type="text"
                        placeholder={this.props.fieldLabel}
                    /> */}
                </div>
            </div>
        )
    }
}

export default FormFieldTags
