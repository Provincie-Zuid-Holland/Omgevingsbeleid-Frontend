/* istanbul ignore file */

import { Component } from 'react'

import ContainerFormSection from './../../../components/ContainerFormSection'
import ContainerMain from './../../../components/ContainerMain'
import FormFieldGeldigheid from './../../../components/FormFieldGeldigheid'
import FormFieldTextInput from './../../../components/FormFieldTextInput'
import APIcontext from './../APIContext'

class ContainerCrudFields extends Component {
    render() {
        const crudObject = this.context.crudObject
        const titleSingular = this.context.titleSingular

        return (
            <ContainerMain>
                <div className="flex-grow inline-block w-full">
                    <form
                        className="mt-12"
                        onSubmit={this.context.handleSubmit}
                    >
                        <>
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
                                    titleSingular={this.context.titleSingular}
                                />
                            </ContainerFormSection>
                            <ContainerFormSection titel="Aanvullende informatie">
                                {/* Geldigheid */}
                                <div className="flex flex-wrap -mx-3">
                                    {/* Begin Geldigheid */}
                                    <FormFieldGeldigheid
                                        handleChange={this.context.handleChange}
                                        fieldValue={
                                            crudObject['Begin_Geldigheid']
                                        }
                                        fieldLabel="Datum inwerkingtreding"
                                        notRequired={true}
                                        dataObjectProperty="Begin_Geldigheid"
                                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                        titleSingular={titleSingular}
                                        openUitwerkingstrede={true}
                                    />

                                    {/* Eind Geldigheid */}

                                    <FormFieldGeldigheid
                                        handleChange={this.context.handleChange}
                                        notRequired={true}
                                        fieldValue={
                                            crudObject['Eind_Geldigheid']
                                        }
                                        openUitwerkingstrede={true}
                                        fieldLabel="Datum uitwerkingtreding"
                                        dataObjectProperty="Eind_Geldigheid"
                                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                        titleSingular={titleSingular}
                                    />
                                </div>
                            </ContainerFormSection>
                        </>

                        {/* Submit */}
                        <div className="fixed bottom-0 right-0 px-6">
                            <div className="inline-block px-4 py-4 bg-white rounded-t shadow">
                                <input
                                    id="form-submit"
                                    className="px-4 py-2 text-sm font-bold leading-tight text-white rounded bg-pzh-blue hover:underline"
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
