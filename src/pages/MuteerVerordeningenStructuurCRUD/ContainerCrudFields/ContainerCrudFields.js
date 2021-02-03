import React from 'react'

// Import Context
import APIcontext from './../APIContext'

// Import Components
import ContainerMain from './../../../components/ContainerMain'
import ContainerFormSection from './../../../components/ContainerFormSection'
import FormFieldTextInput from './../../../components/FormFieldTextInput'
import FormFieldDate from './../../../components/FormFieldDate'

// Import Form Fields
import FormFields from './../../../components/FormFieldsExport'

class ContainerCrudFields extends React.Component {
    render() {
        const crudObject = this.context.crudObject
        const titelEnkelvoud = this.context.titelEnkelvoud

        return (
            <ContainerMain>
                <div className="w-full inline-block flex-grow">
                    <form
                        className="mt-12"
                        onSubmit={this.context.handleSubmit}
                    >
                        <React.Fragment>
                            <ContainerFormSection
                                titel="Verordening"
                                beschrijving={`Geef de verordening een passende titel.`}
                            >
                                <FormFieldTextInput
                                    handleChange={this.context.handleChange}
                                    fieldValue={
                                        this.context.crudObject['Titel']
                                    }
                                    fieldLabel="Titel"
                                    dataObjectProperty="Titel"
                                    pValue="Vul hier uw titel in"
                                    titelEnkelvoud={this.context.titelEnkelvoud}
                                />
                            </ContainerFormSection>
                            <ContainerFormSection titel="Aanvullende informatie">
                                {/* Geldigheid */}
                                <div className="flex flex-wrap -mx-3">
                                    {/* Begin Geldigheid */}
                                    <FormFieldDate
                                        handleChange={this.context.handleChange}
                                        fieldValue={
                                            crudObject['Begin_Geldigheid']
                                        }
                                        fieldLabel="Datum inwerkingtreding"
                                        notRequired={true}
                                        dataObjectProperty="Begin_Geldigheid"
                                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                        titelEnkelvoud={titelEnkelvoud}
                                        openUitwerkingstrede={true}
                                    />

                                    {/* Eind Geldigheid */}

                                    <FormFieldDate
                                        handleChange={this.context.handleChange}
                                        notRequired={true}
                                        fieldValue={
                                            crudObject['Eind_Geldigheid']
                                        }
                                        openUitwerkingstrede={true}
                                        fieldLabel="Datum uitwerkingtreding"
                                        dataObjectProperty="Eind_Geldigheid"
                                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                        titelEnkelvoud={titelEnkelvoud}
                                    />
                                </div>
                            </ContainerFormSection>
                        </React.Fragment>

                        {/* Submit */}
                        <div className="fixed bottom-0 right-0 px-6">
                            <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                                <input
                                    id="form-submit"
                                    className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline"
                                    type="submit"
                                    value="Opslaan"
                                ></input>
                            </div>
                        </div>
                    </form>
                </div>
            </ContainerMain>
        )
    }
}

ContainerCrudFields.contextType = APIcontext

export default ContainerCrudFields
