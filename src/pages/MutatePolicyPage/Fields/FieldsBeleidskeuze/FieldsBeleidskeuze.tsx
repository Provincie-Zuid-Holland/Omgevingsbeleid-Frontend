import {
    FormikDate,
    FormikInput,
    FormikTextArea,
    FormikRte,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { BeleidskeuzesWrite } from '@/api/fetchers.schemas'
import { ContainerFormSection } from '@/components/Container'
import FormFieldSelectUserGroup from '@/components/Form/FormFieldSelectUserGroup'
import FormikRelationConnection from '@/components/Form/FormikRelationConnection'
import FormikWerkingsgebied from '@/components/Form/FormikWerkingsgebied'

export interface FieldsBeleidskeuzeProps {}

function FieldsBeleidskeuze({}: FieldsBeleidskeuzeProps) {
    const { values } = useFormikContext<BeleidskeuzesWrite>()

    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormikInput
                    label="Titel"
                    description="Formuleer in enkele woorden de titel van de beleidskeuze."
                    optimized={true}
                    name="Titel"
                    type="text"
                    className="mb-6"
                />
                <FormFieldSelectUserGroup disabled={false} />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Beleidstekst"
                beschrijving="In deze sectie kun je alle tekst met betrekking tot de beleidskeuze kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct welke keuze de provincie maakt en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.">
                <FormikRte
                    label="Wat wil de provincie bereiken?"
                    description="Hier geef je aan welke keuze de provincie heeft genomen. Formuleer in één of enkele zinnen wat de provincie wil bereiken en welke rechtsgevolgen dit eventueel heeft voor derden."
                    name="Omschrijving_Keuze"
                    className="mb-6"
                />
                <FormikRte
                    label="Aanleiding"
                    description="De aanleiding geeft de lezer informatie over welke ontwikkelingen gaande zijn in de maatschappij en waarom de provincie hier op inspeelt. Beschrijf hier welk probleem, dreiging of kans ten grondslag ligt aan de beleidskeuze."
                    name="Aanleiding"
                    className="mb-6"
                />
                {/* TODO: ADD Anchor text */}
                <FormikRte
                    label="Provinciaal belang"
                    description="Beschrijf waarom de provincie deze keuze maakt en waarom dit niet (enkel) kan worden overgelaten aan andere overheden. Vanuit juridisch perspectief is het belangrijk om het provinciaal belang te definiëren. Zie ook"
                    name="Provinciaal_Belang"
                    className="mb-6"
                />
                <FormikRte
                    label="Toelichting"
                    description="Op welke thema’s, onderwerpen en gebieden gaat de beleidskeuze iets wijzigen, en waarom is dit gewenst? Beschrijf ook de relatie met andere beleidsterreinen."
                    name="Omschrijving_Werking"
                    className="mb-6"
                />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Nationaal beleid"
                beschrijving="Nationale doelstellingen kunnen de aanleiding vormen voor provinciaal beleid. Zo kan het Rijk wettelijke taken & bevoegdheden voor de provincie hebben vastgelegd of kan provinciaal beleid Nationale belangen uit de Nationale Omgevingsvisie (NOVI) dienen.">
                <FormikRelationConnection
                    disabled={false}
                    placeholderTekst="Er is nog geen Nationaal belang of 'Wettelijke taken & bevoegdheden' gekoppeld."
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={values['Titel'] || ''}
                    label="Wettelijke taken & bevoegdheden en nationale belangen"
                    dataObjectProperty="Belangen"
                    description="Indien deze beleidskeuze voortkomt uit een wettelijke taak of bevoegdheid of een nationaal belang dient, selecteer je dit hieronder."
                    titleSingular="Beleidskeuze"
                    connectionProperties={['belangen', 'taken']}
                    crudObject={values}
                />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waar de beleidskeuze betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld, toegestaan of juist verboden.">
                {/* <FormikWerkingsgebied /> */}
            </ContainerFormSection>
        </>
    )
}

export default FieldsBeleidskeuze
