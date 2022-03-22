import { FieldLabel, FormikInput } from '@pzh-ui/components'
import { ChangeEventHandler } from 'react'

import { ContainerFormSection } from '@/components/Container'
import {
    FormFieldGeldigheid,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
    FormFieldInputContainer,
} from '@/components/Form'

/**
 *
 * @param {object} props
 * @param {string} props.titleSingular - Contains the singular form of the policy object type (e.g. 'maatregel')
 * @param {object} props.crudObject - Contains the policy object that is being edited / created
 * @param {function} props.handleChange - Contains the change handler function
 * @returns The form fields for policy objects of the type Ambities
 */

interface FormFieldContainerAmbitiesProps {
    titleSingular: string
    crudObject: any
    handleChange: ChangeEventHandler
}

const FormFieldContainerAmbities = ({
    titleSingular,
    crudObject,
    handleChange,
}: FormFieldContainerAmbitiesProps) => (
    <>
        <ContainerFormSection
            titel="Algemene informatie"
            beschrijving="De algemene informatie bevat een duidelijke titel.">
            <FormFieldInputContainer>
                <FieldLabel name="naam" label="naam" description="test" />
                <FormikInput name="naam" />
            </FormFieldInputContainer>
            {/* <FormFieldInputContainer>
                <FormFieldTitelEnBeschrijving
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van deze ambitie."
                />
            </FormFieldInputContainer>
            <FormFieldTextInput
                handleChange={handleChange}
                fieldValue={crudObject['Titel']}
                dataObjectProperty="Titel"
                titleSingular={titleSingular}
            /> */}
        </ContainerFormSection>

        <ContainerFormSection
            titel="Omschrijving ambitie"
            beschrijving="Geef een korte omschrijving van deze ambitie">
            <FormFieldTextArea
                handleChange={handleChange}
                fieldValue={crudObject['Omschrijving']}
                fieldLabel="Omschrijving"
                dataObjectProperty="Omschrijving"
                pValue="Geef een korte omschrijving van deze ambitie"
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

export default FormFieldContainerAmbities
