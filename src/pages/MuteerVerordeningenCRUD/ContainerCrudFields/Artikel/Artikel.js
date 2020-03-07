import React, { useContext } from 'react'

// Import Context
import APIcontext from './../../APIContext'

// Import Components
import ContainerMain from './../../../../components/ContainerMain'
import ContainerFormSection from './../../../../components/ContainerFormSection'

// Import Form Fields
import {
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldSelectUserGroup,
    FormFieldWerkingsgebiedKoppeling,
    FormFieldDate,
    FormFieldWeblink,
} from './../../../../components/FormFieldsExport'

import ButtonSubmitFixed from './../../../../components/ButtonSubmitFixed'

function Artikel() {
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
                            beschrijving="De algemene informatie bevat een artikelnummer, een duidelijke titel en de betrokken personen"
                        >
                            <FormFieldTextInput
                                handleChange={context.handleChange}
                                fieldValue={crudObject['Volgnummer']}
                                fieldLabel="Artikelnummer"
                                dataObjectProperty="Volgnummer"
                                pValue="Artikelnummer"
                                titelEnkelvoud={titelEnkelvoud}
                            />
                            <FormFieldTextInput
                                handleChange={context.handleChange}
                                fieldValue={crudObject['Titel']}
                                fieldLabel="Titel"
                                dataObjectProperty="Titel"
                                pValue="Vul hier uw titel in"
                                titelEnkelvoud={titelEnkelvoud}
                            />
                            <FormFieldSelectUserGroup
                                handleChange={context.handleChange}
                                crudObject={crudObject}
                                marginRight={true}
                                fieldLabel="Personen"
                                titelEnkelvoud={titelEnkelvoud}
                                editStatus={context.editStatus}
                            />
                        </ContainerFormSection>

                        <ContainerFormSection
                            titel="Inhoud artikel"
                            beschrijving="De inhoud van het artikel moet zelfstandig leesbaar zijn"
                        >
                            <FormFieldTextArea
                                handleChange={context.handleChange}
                                fieldValue={crudObject['Inhoud']}
                                fieldLabel="Artikel"
                                pValue={false}
                                dataObjectProperty="Inhoud"
                                titelEnkelvoud={titelEnkelvoud}
                            />
                        </ContainerFormSection>

                        <ContainerFormSection
                            titel="Werkingsgebied"
                            beschrijving="Het werkingsgebied geeft het gebied weer waarin dit artikel werking heeft.
                                
                                Heeft jouw artikel nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van team GEO (teamgeo@pzh.nl)."
                        >
                            <FormFieldWerkingsgebiedKoppeling
                                handleChange={context.handleChange}
                                titelEnkelvoud={titelEnkelvoud}
                                fieldValue={crudObject['Werkingsgebied']}
                                fieldLabel="Selecteer werkingsgebied"
                                dataObjectProperty="Werkingsgebied"
                                pValue="Selecteer hier het werkingsgebied wat bij deze beleidsbeslissing past."
                            />
                        </ContainerFormSection>

                        <ContainerFormSection
                            titel="Aanvullende informatie"
                            beschrijving="Het werkingsgebied geeft het gebied weer waarin dit artikel werking heeft. /n Heeft jouw artikel nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van team GEO (teamgeo@pzh.nl)."
                        >
                            <FormFieldWeblink
                                handleChange={context.handleChange}
                                fieldValue={crudObject['Weblink']}
                                dataObjectProperty="Weblink"
                                fieldLabel="IDMS"
                                pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                                titelEnkelvoud={titelEnkelvoud}
                            />

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

Artikel.contextType = APIcontext

export default Artikel
