import React, { useContext } from 'react'

// Import Context
import APIcontext from './../../APIContext'

// Import Components
import ContainerMain from './../../../../components/ContainerMain'
import ContainerFormSection from './../../../../components/ContainerFormSection'

// Import Form Fields
import {
    FormFieldTextInput,
    FormFieldDate,
} from './../../../../components/FormFieldsExport'

import ButtonSubmitFixed from './../../../../components/ButtonSubmitFixed'

function Afdeling() {
    const context = useContext(APIcontext)

    const crudObject = context.crudObject
    const titelEnkelvoud = context.titelEnkelvoud

    return (
        <React.Fragment>
            <ContainerMain>
                <div className="w-full inline-block flex-grow">
                    <form className="mt-12" onSubmit={context.handleSubmit}>
                        <ContainerFormSection
                            titel="Algemene informatie"
                            beschrijving="De algemene informatie bevat een afdelingnummer en een duidelijke titel"
                        >
                            <FormFieldTextInput
                                handleChange={context.handleChange}
                                fieldValue={crudObject['Volgnummer']}
                                fieldLabel="Afdeling"
                                dataObjectProperty="Volgnummer"
                                pValue="Nummer"
                                titelEnkelvoud={titelEnkelvoud}
                            />
                            <FormFieldTextInput
                                handleChange={context.handleChange}
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
                                    handleChange={context.handleChange}
                                    fieldValue={crudObject['Begin_Geldigheid']}
                                    fieldLabel="Datum inwerkingtreding"
                                    notRequired={true}
                                    dataObjectProperty="Begin_Geldigheid"
                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                    titelEnkelvoud={titelEnkelvoud}
                                />

                                {/* Eind Geldigheid */}

                                <FormFieldDate
                                    handleChange={context.handleChange}
                                    notRequired={true}
                                    fieldValue={crudObject['Eind_Geldigheid']}
                                    fieldLabel="Datum uitwerkingtreding"
                                    dataObjectProperty="Eind_Geldigheid"
                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                    titelEnkelvoud={titelEnkelvoud}
                                />
                            </div>
                        </ContainerFormSection>

                        {/* Submit */}
                        <ButtonSubmitFixed saving={context.saving} />
                    </form>
                </div>
            </ContainerMain>
        </React.Fragment>
    )
}

export default Afdeling
