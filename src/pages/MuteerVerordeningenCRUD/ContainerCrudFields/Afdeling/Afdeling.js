import React from 'react'

// Import Context
import APIcontext from './../../APIContext'

// Import Components
import ContainerMain from './../../../../components/ContainerMain'
import ContainerFormSection from './../../../../components/ContainerFormSection'

// Import Form Fields
import FormFieldTextInput from './../../../../components/FormFieldTextInput'
import FormFieldTextArea from './../../../../components/FormFieldTextArea'
import FormFieldNumberInput from './../../../../components/FormFieldNumberInput'
import FormFieldSelectUserGroup from './../../../../components/FormFieldSelectUserGroup'
import FormFieldWerkingsgebiedKoppeling from './../../../../components/FormFieldWerkingsgebiedKoppeling'
import FormFieldDate from './../../../../components/FormFieldDate'
import FormFieldWeblink from './../../../../components/FormFieldWeblink'

class Afdeling extends React.Component {
    render() {
        const crudObject = this.context.crudObject
        const titelEnkelvoud = this.context.titelEnkelvoud

        return (
            <React.Fragment>
                <ContainerMain>
                    <div className="w-full inline-block flex-grow">
                        <form
                            className="mt-12"
                            onSubmit={this.context.handleSubmit}
                        >
                            <ContainerFormSection
                                titel="Algemene informatie"
                                beschrijving="De algemene informatie bevat een afdelingnummer en een duidelijke titel"
                            >
                                <FormFieldTextInput
                                    handleChange={this.context.handleChange}
                                    fieldValue={crudObject['Volgnummer']}
                                    fieldLabel="Afdeling"
                                    dataObjectProperty="Volgnummer"
                                    pValue="Nummer"
                                    titelEnkelvoud={titelEnkelvoud}
                                />
                                <FormFieldTextInput
                                    handleChange={this.context.handleChange}
                                    fieldValue={crudObject['Titel']}
                                    fieldLabel="Titel"
                                    dataObjectProperty="Titel"
                                    pValue="Beschrijf in een aantal woorden de titel van deze afdeling"
                                    titelEnkelvoud={titelEnkelvoud}
                                />
                            </ContainerFormSection>

                            <ContainerFormSection
                                titel="Aanvullende informatie"
                                beschrijving="Aanvullende informatie."
                            >
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
                                    />

                                    {/* Eind Geldigheid */}

                                    <FormFieldDate
                                        handleChange={this.context.handleChange}
                                        notRequired={true}
                                        fieldValue={
                                            crudObject['Eind_Geldigheid']
                                        }
                                        fieldLabel="Datum uitwerkingtreding"
                                        dataObjectProperty="Eind_Geldigheid"
                                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                        titelEnkelvoud={titelEnkelvoud}
                                    />
                                </div>
                            </ContainerFormSection>

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
            </React.Fragment>
        )
    }
}

Afdeling.contextType = APIcontext

export default Afdeling
