import React from 'react'

// Import Context
import APIcontext from './../APIContext'

// Import Components
import ContainerMain from './../../../components/ContainerMain'
import ContainerFormSection from './../../../components/ContainerFormSection'
import FormFieldTextArea from './../../../components/FormFieldTextArea'
import FormFieldDate from './../../../components/FormFieldDate'
import FormFieldSelectBeleidsbeslissing from './../../../components/FormFieldSelectBeleidsbeslissing'

class ContainerCrudFields extends React.Component {
    render() {
        const crudObject = this.context.crudObject
        const titelEnkelvoud = this.context.titelEnkelvoud

        return (
            <React.Fragment>
                <ContainerMain>
                    <div className="flex-grow inline-block w-full">
                        <div>
                            <form
                                className="mt-12"
                                onSubmit={this.context.handleSubmit}
                            >
                                <React.Fragment>
                                    <ContainerFormSection
                                        titel="Beleidsrelatie"
                                        beschrijving={`Geef aan met welke beleidsbeslissing '${this.context.Van_Beleidsbeslissing_Titel}' een relatie moet krijgen en motiveer waarom.`}
                                    >
                                        {crudObject[
                                            'Naar_Beleidsbeslissing'
                                        ] !== undefined ? (
                                            <FormFieldSelectBeleidsbeslissing
                                                filter={
                                                    this.context
                                                        .Van_Beleidsbeslissing_UUID
                                                }
                                                handleChange={
                                                    this.context.handleChange
                                                }
                                                fieldValue={
                                                    crudObject[
                                                        'Naar_Beleidsbeslissing'
                                                    ]
                                                }
                                                fieldLabel="Naar Beleidsbeslissing"
                                                dataObjectProperty="Naar_Beleidsbeslissing"
                                                titelEnkelvoud={titelEnkelvoud}
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
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        ) : null}

                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                            {/* Begin Geldigheid */}
                                            {crudObject['Begin_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
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
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}

                                            {/* Eind Geldigheid */}
                                            {crudObject['Eind_Geldigheid'] !==
                                            undefined ? (
                                                <FormFieldDate
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
                                                    titelEnkelvoud={
                                                        titelEnkelvoud
                                                    }
                                                />
                                            ) : null}
                                        </div>
                                    </ContainerFormSection>
                                </React.Fragment>

                                {/* Submit */}
                                <div className="fixed bottom-0 right-0 px-6">
                                    <div className="inline-block px-4 py-4 bg-white rounded-t shadow">
                                        <input
                                            id="form-submit"
                                            className="px-4 py-2 text-sm font-bold leading-tight text-white rounded mbg-color hover:underline"
                                            type="submit"
                                            value="Opslaan"
                                        ></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ContainerMain>
            </React.Fragment>
        )
    }
}

ContainerCrudFields.contextType = APIcontext

export default ContainerCrudFields
