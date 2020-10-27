import React from 'react'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldSelect extends React.Component {
    render() {
        return (
            <div className="w-full mb-6">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />

                <div className="relative inline-block w-full">
                    <select
                        value={
                            this.props.fieldValue === null
                                ? ''
                                : this.props.fieldValue
                        }
                        onChange={this.props.handleChange}
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        name={this.props.dataObjectProperty}
                        className="block w-full px-4 py-3 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                    >
                        <option disabled value={''}>
                            - selecteer een optie -
                        </option>
                        {this.props.selectArray.map((arrayItem, index) => {
                            return (
                                <option key={index} value={arrayItem[0]}>
                                    {arrayItem[1]}
                                </option>
                            )
                        })}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                        <svg
                            className="w-4 h-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormFieldSelect
