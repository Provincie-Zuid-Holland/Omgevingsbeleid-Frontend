import React from "react"
import FormFieldTitelEnBeschrijving from "../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving"

/**
 * Class that renders the FormFieldWeblink component, that accepts the link input of the user and uses the imported FormFieldTitelEnBeschrijving component to display the title and description of the FormFieldWeblink component.
 *
 * @class
 * @extends React.Component
 */
class FormFieldWeblink extends React.Component {
    render() {
        return (
            <div className="flex flex-wrap mb-6 -mx-3">
                <div className="w-full px-3">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={this.props.dataObjectProperty}
                        fieldLabel={this.props.fieldLabel}
                        pValue={this.props.pValue}
                        titleSingular={this.props.titleSingular}
                        disabled={this.props.disabled}
                    />
                    <input
                        type="text"
                        value={this.props.fieldValue || ""}
                        onChange={this.props.handleChange}
                        name="Weblink"
                        className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                        placeholder={this.props.fieldLabel}
                        id={`form-field-${this.props.titleSingular.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        disabled={this.props.disabled}
                    />
                </div>
            </div>
        )
    }
}

export default FormFieldWeblink
