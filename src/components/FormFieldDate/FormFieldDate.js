import React from 'react'
import { format } from 'date-fns'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

class FormFieldDate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            toonUitwerkingTreding:
                this.props.fieldValue !== '' || this.props.openUitwerkingstrede,
        }
        this.toggleUitwerkingTreding = this.toggleUitwerkingTreding.bind(this)
    }

    toggleUitwerkingTreding() {
        this.setState({
            toonUitwerkingTreding: !this.state.toonUitwerkingTreding,
        })
    }

    render() {
        return this.props.dataObjectProperty === 'Eind_Geldigheid' ? (
            <div className="w-full px-3">
                {this.props.hideToggleUitwerkingstrede ? null : (
                    <span
                        className="text-sm text-gray-700 underline mb-6 w-full block select-none cursor-pointer"
                        id="toggle-uitwerkingtreding"
                        onClick={this.toggleUitwerkingTreding}
                    >
                        {this.state.toonUitwerkingTreding ? 'Verberg' : 'Toon'}{' '}
                        veld voor uitwerkingtreding
                    </span>
                )}
                {this.state.toonUitwerkingTreding ? (
                    <div className="w-50 mb-6">
                        <FormFieldTitelEnBeschrijving
                            dataObjectProperty={this.props.dataObjectProperty}
                            fieldLabel={this.props.fieldLabel}
                            pValue={this.props.pValue}
                            addObjectLabel={this.props.addObjectLabel}
                            titelEnkelvoud={this.props.titelEnkelvoud}
                        />
                        {this.props.Begin_Geldigheid !== '' &&
                        this.props.Begin_Geldigheid !== undefined &&
                        this.props.Begin_Geldigheid !== null ? (
                            <input
                                value={
                                    this.props.fieldValue
                                        ? this.props.fieldValue
                                        : ''
                                }
                                onChange={this.props.handleChange}
                                name={this.props.dataObjectProperty}
                                className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                type="date"
                                required={!this.props.notRequired}
                                id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                                // min={this.props.Begin_Geldigheid}
                            />
                        ) : (
                            <input
                                value={
                                    this.props.fieldValue
                                        ? this.props.fieldValue
                                        : ''
                                }
                                onChange={this.props.handleChange}
                                name={this.props.dataObjectProperty}
                                required={!this.props.notRequired}
                                className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                type="date"
                                id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                            />
                        )}
                    </div>
                ) : null}
            </div>
        ) : (
            <div className="w-50 px-3 mb-6">
                <FormFieldTitelEnBeschrijving
                    dataObjectProperty={this.props.dataObjectProperty}
                    fieldLabel={this.props.fieldLabel}
                    pValue={this.props.pValue}
                    addObjectLabel={this.props.addObjectLabel}
                    titelEnkelvoud={this.props.titelEnkelvoud}
                />
                {this.props.notRequired ? (
                    <input
                        value={
                            this.props.fieldValue ? this.props.fieldValue : ''
                        }
                        onChange={this.props.handleChange}
                        name={this.props.dataObjectProperty}
                        className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        type="date"
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                    />
                ) : (
                    <input
                        value={
                            this.props.fieldValue ? this.props.fieldValue : ''
                        }
                        required
                        onChange={this.props.handleChange}
                        name={this.props.dataObjectProperty}
                        className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        type="date"
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                    />
                )}
            </div>
        )
    }
}
export default FormFieldDate
