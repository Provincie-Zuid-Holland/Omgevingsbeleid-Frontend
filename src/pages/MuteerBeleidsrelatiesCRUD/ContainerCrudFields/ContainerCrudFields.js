import React from 'react'

// Import Context
import APIcontext from './../APIContext'

// Import Components
import ContainerMain from './../../../components/ContainerMain'
import ContainerFormSection from './../../../components/ContainerFormSection'
import FormFieldTextInput from './../../../components/FormFieldTextInput'
import FormFieldTextArea from './../../../components/FormFieldTextArea'
import FormFieldWeblink from './../../../components/FormFieldWeblink'
import FormFieldDate from './../../../components/FormFieldDate'
import FormFieldTags from './../../../components/FormFieldTags'
import FormFieldSelect from './../../../components/FormFieldSelect'
import FormFieldSelectBeleidsbeslissing from './../../../components/FormFieldSelectBeleidsbeslissing'
import FormFieldBeleidsrelatie from './../../../components/FormFieldBeleidsrelatie'
import FormFieldWerkingsgebiedrelatie from './../../../components/FormFieldWerkingsgebiedrelatie'
import FormFieldWerkingsgebiedKoppeling from './../../../components/FormFieldWerkingsgebiedKoppeling'
import FormFieldSelectUserGroup from './../../../components/FormFieldSelectUserGroup'
import FormFieldUniverseleRelatieKoppeling from './../../../components/FormFieldUniverseleRelatieKoppeling'
import FormFieldBeleidsrelatieKoppeling from '../../../components/FormFieldBeleidsrelatieKoppeling/FormFieldBeleidsrelatieKoppeling'

class ContainerCrudFields extends React.Component {
    render() {
        const objectUUID = this.context.objectUUID
        const crudObject = this.context.crudObject
        const titelEnkelvoud = this.context.titelEnkelvoud

        return (
            <React.Fragment>
                <ContainerMain>
                    <div className="w-full inline-block flex-grow">
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
                                        {/* Eind Geldigheid */}
                                        {crudObject[
                                            'Naar_Beleidsbeslissing'
                                        ] !== undefined ? (
                                            <FormFieldSelectBeleidsbeslissing
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
                                                    fieldLabel="Begin datum"
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
                                                    handleChange={
                                                        this.context
                                                            .handleChange
                                                    }
                                                    fieldValue={
                                                        crudObject[
                                                            'Eind_Geldigheid'
                                                        ]
                                                    }
                                                    fieldLabel="Eind datum"
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
                    </div>
                </ContainerMain>
            </React.Fragment>
        )
    }
}

ContainerCrudFields.contextType = APIcontext

export default ContainerCrudFields
