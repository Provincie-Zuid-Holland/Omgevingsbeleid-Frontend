import React from 'react'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

function BeginGeldigheid({
    dataObjectProperty,
    fieldLabel,
    pValue,
    titelEnkelvoud,
    fieldValue,
    handleChange,
}) {
    return (
        <div className="px-3 mb-6">
            <FormFieldTitelEnBeschrijving
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titelEnkelvoud={titelEnkelvoud}
            />
            <input
                placeholder="dd-mm-jjjj"
                value={fieldValue ? fieldValue : ''}
                onChange={handleChange}
                name={dataObjectProperty}
                className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                type="date"
                id={`form-field-${titelEnkelvoud.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            />
        </div>
    )
}

function EindGeldigheid({
    hideToggleUitwerkingstrede,
    toggleUitwerkingTreding,
    toonUitwerkingTreding,
    dataObjectProperty,
    fieldLabel,
    pValue,
    titelEnkelvoud,
    fieldValue,
    handleChange,
}) {
    return (
        <div className="px-3 mb-6">
            {hideToggleUitwerkingstrede ? null : (
                <span
                    className="text-sm text-gray-700 underline mb-6 w-full block select-none cursor-pointer"
                    id="toggle-uitwerkingtreding"
                    onClick={toggleUitwerkingTreding}
                >
                    {toonUitwerkingTreding ? 'Verberg' : 'Toon'} veld voor
                    uitwerkingtreding
                </span>
            )}

            {toonUitwerkingTreding ? (
                <div className="mb-6">
                    <FormFieldTitelEnBeschrijving
                        dataObjectProperty={dataObjectProperty}
                        fieldLabel={fieldLabel}
                        pValue={pValue}
                        titelEnkelvoud={titelEnkelvoud}
                    />
                    <input
                        value={fieldValue ? fieldValue : ''}
                        onChange={handleChange}
                        name={dataObjectProperty}
                        placeholder="dd-mm-jjjj"
                        className="appearance-none block w-full text-gray-700 border border-gray-400 focus:border-gray-500 hover:border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                        type="date"
                        id={`form-field-${titelEnkelvoud.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                    />
                </div>
            ) : null}
        </div>
    )
}

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
            <EindGeldigheid
                hideToggleUitwerkingstrede={
                    this.props.hideToggleUitwerkingstrede
                }
                toggleUitwerkingTreding={this.toggleUitwerkingTreding}
                toonUitwerkingTreding={this.state.toonUitwerkingTreding}
                dataObjectProperty={this.props.dataObjectProperty}
                fieldLabel={this.props.fieldLabel}
                pValue={this.props.pValue}
                titelEnkelvoud={this.props.titelEnkelvoud}
                fieldValue={this.props.fieldValue}
                handleChange={this.props.handleChange}
            />
        ) : (
            <BeginGeldigheid
                dataObjectProperty={this.props.dataObjectProperty}
                fieldLabel={this.props.fieldLabel}
                pValue={this.props.pValue}
                titelEnkelvoud={this.props.titelEnkelvoud}
                fieldValue={this.props.fieldValue}
                handleChange={this.props.handleChange}
            />
        )
    }
}
export default FormFieldDate
