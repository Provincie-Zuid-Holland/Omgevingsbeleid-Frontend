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
                beschrijving="De algemene informatie bevat een duidelijke titel en de mogelijkheid om aan te geven of het om een nationaal belang gaat, of een wettelijke taak of bevoegdheid.">
                <FormFieldInputContainer>
                    <FormikInput
                        label="Titel"
                        required={true}
                        description="Formuleer in enkele woorden de titel van dit nationaal belang of deze wettelijke taak."
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
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en de in- en uitwerkingstredingsdatum">
                <FormikInput
                    label="IDMS"
                    description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    name="Weblink"
                    type="text"
                    className="mb-6"
                />
                <FormikDate
                    required={true}
                    placeholderText="dd-mm-jjjj"
                    label="Inwerkingtreding"
                    description="De datum waarop dit object inwerking moet treden."
                    name="Begin_Geldigheid"
                    className="mb-6"
                />
                <FormikDate
                    label="Uitwerkingtreding"
                    description="De datum waarop dit object uitwerking moet treden."
                    placeholderText="dd-mm-jjjj"
                    name="Eind_Geldigheid"
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsBelang