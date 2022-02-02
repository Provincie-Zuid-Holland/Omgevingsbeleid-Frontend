import { ChangeEventHandler } from 'react'

import { ContainerFormSection } from '@/components/Container'
import {
    FormFieldGeldigheid,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
} from '@/components/Form'

/**
 * @returns The form fields for policy objects of the type Beleidsprestaties
 */

interface FormFieldContainerBeleidsprestatiesProps {
    titleSingular: string
    crudObject: any
    handleChange: ChangeEventHandler
}

function FormFieldContainerBeleidsprestaties({
    titleSingular,
    crudObject,
    handleChange,
}: FormFieldContainerBeleidsprestatiesProps) {
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van deze beleidsprestatie."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving beleidsprestatie"
                beschrijving="Geef een korte omschrijving van deze beleidsprestatie">
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving']}
                    fieldLabel="Omschrijving"
                    dataObjectProperty="Omschrijving"
                    pValue="Geef een korte omschrijving van deze beleidsprestatie"
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding.">
                <FormFieldWeblink
                    handleChange={handleChange}
                    fieldValue={crudObject['Weblink']}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titleSingular={titleSingular}
                />

                <div className="flex flex-wrap -mx-3">
                    <FormFieldGeldigheid
                        handleChange={handleChange}
                        dataObjectProperty="Begin_Geldigheid"
                        fieldValue={crudObject['Begin_Geldigheid']}
                        fieldLabel="Inwerkingtreding"
                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />

                    <FormFieldGeldigheid
                        openUitwerkingstrede={true}
                        handleChange={handleChange}
                        dataObjectProperty="Eind_Geldigheid"
                        fieldValue={crudObject['Eind_Geldigheid']}
                        fieldLabel="Uitwerkingtreding"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                </div>
            </ContainerFormSection>
        </>
    )
}

export default FormFieldContainerBeleidsprestaties
