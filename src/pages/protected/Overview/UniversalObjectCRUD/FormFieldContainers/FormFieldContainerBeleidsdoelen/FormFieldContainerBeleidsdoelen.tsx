import { ChangeEventHandler } from 'react'

import { ContainerFormSection } from '@/components/Container'
import {
    FormFieldGeldigheid,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
} from '@/components/Form'

/**
 * @returns The form fields for policy objects of the type Beleidsdoelen
 */

interface FormFieldContainerBeleidsdoelenProps {
    titleSingular: string
    crudObject: any
    handleChange: ChangeEventHandler
}

function FormFieldContainerBeleidsdoelen({
    titleSingular,
    crudObject,
    handleChange,
}: FormFieldContainerBeleidsdoelenProps) {
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
                    pValue="Formuleer in enkele woorden de titel van dit beleidsdoel."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving beleidsdoel"
                beschrijving="Een beleidsdoel bevindt zich op tactisch niveau, tussen het niveau van de ambities en de beleidskeuzes.">
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving']}
                    fieldLabel="Omschrijving"
                    dataObjectProperty="Omschrijving"
                    pValue="Geef een korte omschrijving van dit beleidsdoel."
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
                        fieldValue={crudObject['Begin_Geldigheid']}
                        fieldLabel="Inwerkingtreding"
                        dataObjectProperty="Begin_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />

                    <FormFieldGeldigheid
                        openUitwerkingstrede={true}
                        handleChange={handleChange}
                        fieldValue={crudObject['Eind_Geldigheid']}
                        fieldLabel="Uitwerkingtreding"
                        dataObjectProperty="Eind_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                </div>
            </ContainerFormSection>
        </>
    )
}

export default FormFieldContainerBeleidsdoelen
