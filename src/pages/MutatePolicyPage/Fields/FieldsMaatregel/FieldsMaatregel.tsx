import {
    FormikDate,
    FormikRadioGroup,
    FormikInput,
    FormikRte,
    FieldLabel,
} from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import FormFieldSelectUserGroup from '@/components/Form/FormFieldSelectUserGroup'
import FormikWerkingsgebied from '@/components/Form/FormikWerkingsgebied'

import MutateContext from '../../MutateContext'

const FieldsMaatregel = () => {
    const { userHasFullMutateRights, isVigerend, hideAdditionalInfo } =
        useContext(MutateContext)

    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormikInput
                    label="Titel"
                    disabled={isVigerend}
                    description="Formuleer in enkele woorden de titel van de maatregel."
                    name="Titel"
                    type="text"
                />
                <FormFieldSelectUserGroup
                    className="mt-6"
                    disabled={isVigerend && !userHasFullMutateRights}
                />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Omschrijving maatregel"
                beschrijving="In deze sectie kun je alle tekst met betrekking tot de maatregel kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’. Maak indien nodig gebruik van tekstopmaak.">
                <FormikRte
                    disabled={isVigerend}
                    label="Omschrijving"
                    description="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid. Formuleer wat de provincie gaat realiseren, of de maatregel voor een specifiek gebied van toepassing is, aan welke beleidskeuzes de maatregel bijdraagt en in welke rol de provincie op zich neemt."
                    name="Toelichting"
                    placeholder="Schrijf hier uw omschrijving..."
                    className="mb-6"
                />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waar de maatregel betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld,  toegestaan of juist verboden.">
                <FormikWerkingsgebied
                    disabled={isVigerend}
                    titleSingular={'Maatregel'}
                    label="Selecteer werkingsgebied"
                    description="Selecteer het werkingsgebied wat bij deze maatregel van toepassing is. Heeft jouw maatregel nog geen geschikt werkingsgebied, of moet het huidige gebied aangepast worden? Neem dan contact op via omgevingsbeleid@pzh.nl."
                    dataObjectProperty="Gebied"
                />
                <FieldLabel
                    name="Gebied_Duidig"
                    label="Intentie van het werkingsgebied"
                    description="Geef de intentie van het werkingsgebied aan. De intentie is de manier waarop de geometrie van het gebied geïnterpreteerd moet worden, niet de nauwkeurigheid van het gebied."
                />
                <FormikRadioGroup
                    disabled={isVigerend}
                    name="Gebied_Duiding"
                    options={[
                        {
                            label: 'Indicatief',
                            value: 'Indicatief',
                        },
                        {
                            label: 'Exact',
                            value: 'Exact',
                        },
                    ]}
                />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Aanvullende informatie"
                hide={hideAdditionalInfo}
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding.">
                <FormikInput
                    disabled={isVigerend}
                    className="mb-6"
                    name="Weblink"
                    label="IDMS"
                    placeholder="IDMS"
                    description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                />

                <FormikInput
                    disabled={isVigerend}
                    className="mb-6"
                    name="Besluitnummer"
                    label="Besluitnummer"
                    placeholder="Besluitnummer"
                    description="Geef hier het PZH besluitnummer."
                />
                <FormikDate
                    disabled={isVigerend}
                    className="mb-6"
                    name="Begin_Geldigheid"
                    label="Inwerkingtreding"
                    placeholder="dd-mm-jjjj"
                    description="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                />

                <FormikDate
                    disabled={isVigerend}
                    name="Eind_Geldigheid"
                    label="Uitwerkingtreding"
                    placeholder="dd-mm-jjjj"
                    description="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsMaatregel
