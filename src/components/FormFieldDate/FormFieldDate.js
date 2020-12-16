import React from 'react'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

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
                titleSingular={this.props.titleSingular}
                fieldValue={this.props.fieldValue}
                handleChange={this.props.handleChange}
                disabled={this.props.disabled}
            />
        ) : (
            <BeginGeldigheid
                dataObjectProperty={this.props.dataObjectProperty}
                fieldLabel={this.props.fieldLabel}
                pValue={this.props.pValue}
                titleSingular={this.props.titleSingular}
                fieldValue={this.props.fieldValue}
                handleChange={this.props.handleChange}
                disabled={this.props.disabled}
            />
        )
    }
}

function BeginGeldigheid({
    dataObjectProperty,
    fieldLabel,
    pValue,
    titleSingular,
    fieldValue,
    handleChange,
    disabled,
}) {
    return (
        <div className="w-full px-3 mb-6">
            <FormFieldTitelEnBeschrijving
                dataObjectProperty={dataObjectProperty}
                fieldLabel={fieldLabel}
                pValue={pValue}
                titleSingular={titleSingular}
            />
            <input
                disabled={disabled}
                placeholder={isSafari ? 'jjjj-mm-dd' : 'dd-mm-jjjj'}
                value={fieldValue ? fieldValue : ''}
                onChange={handleChange}
                name={dataObjectProperty}
                className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:border-gray-500 hover:border-gray-500 focus:outline-none focus:bg-white"
                type="date"
                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
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
    titleSingular,
    fieldValue,
    handleChange,
    disabled,
}) {
    return (
        <div className="w-full px-3 mb-6">
            {hideToggleUitwerkingstrede ? null : (
                <span
                    className="block w-full mb-6 text-sm text-gray-700 underline cursor-pointer select-none"
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
                        titleSingular={titleSingular}
                    />
                    <input
                        disabled={disabled}
                        value={fieldValue ? fieldValue : ''}
                        onChange={handleChange}
                        name={dataObjectProperty}
                        placeholder={isSafari ? 'jjjj-mm-dd' : 'dd-mm-jjjj'}
                        className="block w-full px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:border-gray-500 hover:border-gray-500 focus:outline-none focus:bg-white"
                        type="date"
                        id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                    />
                </div>
            ) : null}
        </div>
    )
}

export default FormFieldDate
