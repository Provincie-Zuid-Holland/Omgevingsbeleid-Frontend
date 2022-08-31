import { ChangeEventHandler } from 'react'

import { ContainerFormSection } from '@/components/Container'
import {
    FormFieldGeldigheid,
    FormFieldTextInput,
    FormFieldWeblink,
    FormFieldWerkingsgebied,
    FormFieldRadioButton,
    FormFieldRichTextEditor,
    FormFieldInputContainer,
    FormFieldSelectUserGroup,
    FormFieldTitelEnBeschrijving,
} from '@/components/Form'
import useAuth from '@/hooks/useAuth'

const initialValueToelichting = `<p><b>Rolkeuze</b></p><p><br><br></p><p><b>Beleidskeuzes</b></p><p><br><br></p><p><b>Is de maatregel gebiedsspecifiek?</b></p><p><br><br></p><p><b>Toelichting</b></p><p><br><br></p>`

/**
 * @returns The form fields for policy objects of the type Maatregelen
 */

interface FormFieldContainerMaatregelenProps {
    titleSingular: string
    crudObject: any
    handleChange: ChangeEventHandler
    editStatus?: boolean
}

function FormFieldContainerMaatregelen({
    titleSingular,
    crudObject,
    handleChange,
    editStatus,
}: FormFieldContainerMaatregelenProps) {
    // If the beleidskeuze is 'vigerend' we need to specify who can edit which fields
    const isVigerend = crudObject.Status === 'Vigerend'

    const { user } = useAuth()
    const userUUID = user?.UUID
    const userRol = user?.Rol

    const userIsAllowed =
        userRol === 'Beheerder' ||
        userRol === 'Superuser' ||
        userRol === 'Functioneel beheerder' ||
        userRol === 'Behandelend Ambtenaar' ||
        userRol === 'Technisch beheerder' ||
        userUUID === crudObject.Eigenaar_1 ||
        userUUID === crudObject.Eigenaar_2

    const maatregelEditorFormats = ['bold', 'italic', 'list', 'image', 'indent']
    const maatregelEditorToolbar = isVigerend
        ? []
        : ['bold', 'italic', { list: 'bullet' }, { list: 'ordered' }, 'image']

    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken collega's.">
                <FormFieldTextInput
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van de maatregel."
                    titleSingular={titleSingular}
                />
                <FormFieldSelectUserGroup
                    disabled={isVigerend && !userIsAllowed}
                    editStatus={editStatus}
                    handleChange={handleChange}
                    crudObject={crudObject}
                    fieldLabel="Personen"
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving maatregel"
                beschrijving="In deze sectie kun je alle tekst met betrekking tot de maatregel kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’. Maak indien nodig gebruik van tekstopmaak.">
                <FormFieldInputContainer>
                    <FormFieldTitelEnBeschrijving
                        disabled={isVigerend}
                        fieldLabel={'Omschrijving'}
                        pValue={
                            'Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid. Formuleer wat de provincie gaat realiseren, of de maatregel voor een specifiek gebied van toepassing is, aan welke beleidskeuzes de maatregel bijdraagt en in welke rol de provincie op zich neemt.'
                        }
                    />
                    <FormFieldRichTextEditor
                        disabled={isVigerend}
                        editorFormats={maatregelEditorFormats}
                        editorToolbar={maatregelEditorToolbar}
                        titleSingular={titleSingular}
                        initialValue={initialValueToelichting}
                        handleChange={handleChange}
                        fieldValue={crudObject['Toelichting']}
                        dataObjectProperty="Toelichting"
                        placeholder="Schrijf hier uw omschrijving..."
                    />
                </FormFieldInputContainer>
            </ContainerFormSection>

            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waar de maatregel betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld,  toegestaan of juist verboden.">
                <FormFieldWerkingsgebied
                    className="mb-6"
                    disabled={isVigerend}
                    setWerkingsgebiedInParentState={handleChange}
                    werkingsgebiedInParentState={crudObject['Gebied']}
                    titleSingular={titleSingular}
                    fieldLabel="Selecteer werkingsgebied"
                    dataObjectProperty="Gebied"
                    pValue="Selecteer het werkingsgebied wat bij deze maatregel van toepassing is. Heeft jouw maatregel nog geen geschikt werkingsgebied, of moet het huidige gebied aangepast worden? Neem dan contact op via omgevingsbeleid@pzh.nl."
                />
                <FormFieldRadioButton
                    disabled={isVigerend}
                    options={['Indicatief', 'Exact']}
                    handleChange={handleChange}
                    fieldValue={crudObject['Gebied_Duiding']}
                    dataObjectProperty="Gebied_Duiding"
                    titleSingular={titleSingular}
                    label="Geef de intentie van het werkingsgebied aan. De intentie is de manier waarop de geometrie van het gebied geïnterpreteerd moet worden, niet de nauwkeurigheid van het gebied."
                />
            </ContainerFormSection>

            {(user && user.Rol === 'Beheerder') ||
            (user && user.Rol === 'Functioneel beheerder') ||
            (user && user.Rol === 'Technisch beheerder') ? (
                <ContainerFormSection
                    titel="Aanvullende informatie"
                    beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument.">
                    <FormFieldWeblink
                        disabled={isVigerend}
                        handleChange={handleChange}
                        fieldValue={crudObject['Weblink']}
                        dataObjectProperty="Weblink"
                        fieldLabel="IDMS"
                        pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen → Algemeen → Snelkoppeling kopiëren)."
                        titleSingular={titleSingular}
                    />

                    <div className="flex flex-wrap -mx-3">
                        <FormFieldGeldigheid
                            disabled={isVigerend}
                            handleChange={handleChange}
                            fieldValue={crudObject['Begin_Geldigheid']}
                            fieldLabel="Inwerkingtreding"
                            dataObjectProperty="Begin_Geldigheid"
                            pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                            titleSingular={titleSingular}
                        />

                        <FormFieldGeldigheid
                            disabled={isVigerend}
                            openUitwerkingstrede={true}
                            handleChange={handleChange}
                            fieldValue={crudObject['Eind_Geldigheid']}
                            dataObjectProperty="Eind_Geldigheid"
                            fieldLabel="Uitwerkingtreding"
                            pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                            titleSingular={titleSingular}
                        />
                    </div>
                </ContainerFormSection>
            ) : null}
        </>
    )
}

export default FormFieldContainerMaatregelen
