import { FormikDate, FormikInput, FormikRte } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useContext } from 'react'

import { BeleidskeuzesWrite } from '@/api/fetchers.schemas'
import { ContainerFormSection } from '@/components/Container'
import FormikRelationConnection from '@/components/Form/FormikRelationConnection'
import FormikSelectUserGroup from '@/components/Form/FormikSelectUserGroup'
import FormikWerkingsgebied from '@/components/Form/FormikWerkingsgebied'
import FormSpacer from '@/components/Form/FormSpacer'
import { beleidskeuzeStatussesWithStartValidity } from '@/constants/policyObjects/beleidskeuzes'

import MutateContext from '../../MutateContext'

const FieldsBeleidskeuze = () => {
    const { values } = useFormikContext<BeleidskeuzesWrite>()
    const {
        userHasFullMutateRights,
        isVigerend,
        hideAdditionalInfo,
        isRequired,
    } = useContext(MutateContext)
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken collega's.">
                <FormikInput
                    label="Titel"
                    required={isRequired('Titel')}
                    description="Formuleer in enkele woorden de titel van de beleidskeuze."
                    name="Titel"
                    type="text"
                    disabled={isVigerend}
                />
                <FormikSelectUserGroup
                    className="mt-6"
                    disabled={isVigerend && !userHasFullMutateRights}
                />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Beleidstekst"
                beschrijving="In deze sectie kun je alle tekst met betrekking tot de beleidskeuze kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct welke keuze de provincie maakt en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.">
                <FormikRte
                    testId="formik-rte-omschrijving-keuze"
                    disabled={isVigerend}
                    label="Wat wil de provincie bereiken?"
                    description="Hier geef je aan welke keuze de provincie heeft genomen. Formuleer in één of enkele zinnen wat de provincie wil bereiken en welke rechtsgevolgen dit eventueel heeft voor derden."
                    name="Omschrijving_Keuze"
                />
                <FormSpacer />
                <FormikRte
                    testId="formik-rte-aanleiding"
                    disabled={isVigerend}
                    label="Aanleiding"
                    description="De aanleiding geeft de lezer informatie over welke ontwikkelingen gaande zijn in de maatschappij en waarom de provincie hier op inspeelt. Beschrijf hier welk probleem, dreiging of kans ten grondslag ligt aan de beleidskeuze."
                    name="Aanleiding"
                />
                <FormSpacer />
                <FormikRte
                    disabled={isVigerend}
                    label="Provinciaal belang"
                    description={
                        <>
                            Beschrijf waarom de provincie deze keuze maakt en
                            waarom dit niet (enkel) kan worden overgelaten aan
                            andere overheden. Vanuit juridisch perspectief is
                            het belangrijk om het provinciaal belang te
                            definiëren. Zie ook{' '}
                            <a
                                href="https://zoek.officielebekendmakingen.nl/stb-2016-156.html#d16e418"
                                className="underline"
                                target="_blank"
                                rel="noopener noreferrer">
                                artikel 2.3 van de Omgevingswet
                            </a>
                            .
                        </>
                    }
                    name="Provinciaal_Belang"
                />
                <FormSpacer />
                <FormikRte
                    disabled={isVigerend}
                    label="Toelichting"
                    description="Op welke thema’s, onderwerpen en gebieden gaat de beleidskeuze iets wijzigen, en waarom is dit gewenst? Beschrijf ook de relatie met andere beleidsterreinen."
                    name="Omschrijving_Werking"
                />
                <FormSpacer />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Nationaal beleid"
                beschrijving="Nationale doelstellingen kunnen de aanleiding vormen voor provinciaal beleid. Zo kan het Rijk wettelijke taken & bevoegdheden voor de provincie hebben vastgelegd of kan provinciaal beleid Nationale belangen uit de Nationale Omgevingsvisie (NOVI) dienen.">
                <FormikRelationConnection
                    disabled={isVigerend}
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
                <FormikWerkingsgebied
                    disabled={isVigerend}
                    titleSingular={'Beleidskeuze'}
                    label="Selecteer werkingsgebied"
                    description="Selecteer het werkingsgebied wat bij deze beleidskeuze van toepassing is. Heeft jouw beleidskeuze nog geen geschikt werkingsgebied, of moet het huidige gebied aangepast worden? Neem dan contact op via omgevingsbeleid@pzh.nl."
                    dataObjectProperty="Werkingsgebieden"
                />
            </ContainerFormSection>
            <ContainerFormSection
                titel="Koppelingen"
                beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidskeuze koppelingen met andere onderdelen van het provinciale beleid heeft. Zo wordt duidelijk welke delen beleid met elkaar te maken hebben of elkaar beïnvloeden.">
                <FormikRelationConnection
                    disabled={isVigerend && !userHasFullMutateRights}
                    placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidskeuze"
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={values['Titel'] || ''}
                    label="Koppelingen"
                    dataObjectProperty="Koppelingen"
                    description="Aan welke ambities, beleidsdoelen, artikelen uit de verordening, maatregelen en beleidsregels heeft deze beleidskeuze een koppeling?"
                    titleSingular="Beleidskeuze"
                    connectionProperties={[
                        'beleidsdoelen',
                        'themas',
                        'beleidsregels',
                        'beleidsprestaties',
                        'maatregelen',
                        'verordening',
                    ]}
                    crudObject={values}
                />
            </ContainerFormSection>
            <ContainerFormSection
                hide={hideAdditionalInfo}
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie die bij de beleidskeuze hoort.">
                <FormikInput
                    disabled={isVigerend}
                    name="Weblink"
                    label="IDMS"
                    placeholder="IDMS"
                    description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                />
                <FormSpacer />

                <FormikInput
                    disabled={isVigerend}
                    name="Besluitnummer"
                    label="Besluitnummer"
                    placeholder="Besluitnummer"
                    description="Geef hier het PZH besluitnummer."
                />
                <FormSpacer />

                <FormikDate
                    disabled={isVigerend}
                    name="Begin_Geldigheid"
                    label="Inwerking"
                    placeholder="dd-mm-jjjj"
                    description="De datum waarop dit object inwerking moet treden."
                    optimized={false}
                    required={beleidskeuzeStatussesWithStartValidity.includes(
                        values.Status || ''
                    )}
                />
                <FormSpacer />
                <FormikDate
                    optimized={false}
                    disabled={isVigerend}
                    required={isRequired('Eind_Geldigheid')}
                    name="Eind_Geldigheid"
                    label="Uitwerking"
                    placeholder="dd-mm-jjjj"
                    description="De datum waarop dit object uitwerking moet treden."
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsBeleidskeuze
