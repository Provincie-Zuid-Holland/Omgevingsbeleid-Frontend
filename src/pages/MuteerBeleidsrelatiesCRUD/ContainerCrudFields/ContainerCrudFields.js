// Import Context
import { Component } from 'react'

import ContainerFormSection from './../../../components/ContainerFormSection'
import ContainerMain from './../../../components/ContainerMain'
// Import Components
import FormFieldGeldigheid from './../../../components/FormFieldGeldigheid'
import FormFieldSelectBeleidskeuze from './../../../components/FormFieldSelectBeleidskeuze'
import FormFieldTextArea from './../../../components/FormFieldTextArea'
import APIcontext from './../APIContext'

/**
 * @returns A container containing the form fields to edit a policy relation
 */
class ContainerCrudFields extends Component {
    render() {
        const crudObject = this.context.crudObject
        const titleSingular = this.context.titleSingular

        return (
            <>
                <ContainerMain>
                    <div className="flex-grow inline-block w-full">
                        <div>
                            <form
                                className="mt-12"
                                onSubmit={this.context.handleSubmit}>
                                <>
                                    <ContainerFormSection
                                        titel="Beleidsrelatie"
                                        beschrijving={`Geef aan met welke beleidskeuze '${this.context.Van_Beleidskeuze_Titel}' een relatie moet krijgen en motiveer waarom.`}>
                                        {crudObject['Naar_Beleidskeuze'] !==
                                        undefined ? (
                                            <FormFieldSelectBeleidskeuze
                                                filter={
                                                    this.context
                                                        .Van_Beleidskeuze_UUID
                                                }
                                                handleChange={
                                                    this.context.handleChange
                                                }
                                                fieldValue={
                                                    crudObject[
                                                        'Naar_Beleidskeuze'
                                                    ]
                                                }
                                                fieldLabel="Naar beleidskeuze"
                                                dataObjectProperty="Naar_Beleidskeuze"
                                                titleSingular={titleSingular}
                                            />
                                        ) : null}

                                        {crudObject['Omschrijving'] !==
                                        undefined ? (
                                            <FormFieldTextArea
                                                handleChange={
                                                    this.context.handleChange
                                                }
                                                fieldValue={
                                                    crudObject['Omschrijving']
                                                }
                                                fieldLabel="Motivering"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte motivering van deze beleidsrelatie"
                                                titleSingular={titleSingular}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldGeldigheid
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Begin_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Inwerkingtreding van de relatie"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de begin datum van de relatie worden ingevuld"
                                                    titleSingular={
                                                        titleSingular
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldGeldigheid
                                                    openUitwerkingstrede={true}
                                                    hideToggleUitwerkingstrede={
                                                        true
                                                    }
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Uitwerkingtreding van de relatie"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de eind datum van de relatie worden ingevuld"
                                                    titleSingular={
                                                        titleSingular
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </>

                                {/* Submit */}
                                <div className="fixed bottom-0 right-0 px-6">
                                    <div className="inline-block px-4 py-4 bg-white rounded-t shadow">
                                        <input
                                            id="form-submit"
                                            className="px-4 py-2 text-sm font-bold leading-tight text-white rounded cursor-pointer bg-pzh-blue hover:underline"
                                            type="submit"
                                            value="Opslaan"></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ContainerMain>
            </>
        )
    }
}

ContainerCrudFields.contextType = APIcontext

export default ContainerCrudFields
