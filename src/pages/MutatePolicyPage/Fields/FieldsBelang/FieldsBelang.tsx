import {
    FormikDate,
    FormikSelect,
    FormikInput,
    FormikTextArea,
} from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'
import { FormFieldInputContainer } from '@/components/Form'

export interface FieldsBelangProps {}

function FieldsBelang({}: FieldsBelangProps) {
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormFieldInputContainer>
                    <FormikInput
                        label="Titel"
                        description="Formuleer in enkele woorden de titel van dit nationaal belang of deze wettelijke taak."
                        optimized={true}
                        name="Titel"
                        type="text"
                        className="mb-6"
                    />
                    <FormikSelect
                        label="Type"
                        name="Type"
                        options={[
                            {
                                label: 'Nationaal Belang',
                                value: 'Nationaal Belang',
                            },
                            {
                                label: 'Wettelijke Taak & Bevoegdheid',
                                value: 'Wettelijke Taak & Bevoegdheid',
                            },
                        ]}
                    />
                </FormFieldInputContainer>
            </ContainerFormSection>
            <ContainerFormSection
                titel="Omschrijving nationaal belang of wettelijke taak"
                beschrijving="De nationale belangen zijn afkomstig uit de nationale omgevingsvisie, danwel aanvullende afspraken tussen rijk en provincies. De wettelijke taken refereren aan het betreffende wetsartikel waarin de provincie een medebewindstaak opgedragen krijgt.">
                <FormikTextArea
                    name="Omschrijving"
                    label="Omschrijving"
                    description="Geef een korte omschrijving van dit nationaal belang of deze wettelijke taak."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding.">
                <FormikInput
                    className="mb-6"
                    name="Weblink"
                    label="IDMS"
                    placeholder="IDMS"
                    description="Vul hier
                     de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                />

                <FormikDate
                    className="mb-6"
                    name="Begin_Geldigheid"
                    label="Inwerkingtreding"
                    placeholder="dd-mm-jjjj"
                    description="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                />

                <FormikDate
                    name="Eind_Geldigheid"
                    label="Uitwerkingtreding"
                    placeholder="dd-mm-jjjj"
                    description="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsBelang
