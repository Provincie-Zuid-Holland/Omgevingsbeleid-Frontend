import cloneDeep from 'lodash.clonedeep'
import { ChangeEventHandler } from 'react'

import { ContainerFormSection } from '@/components/Container'
import {
    FormFieldGeldigheid,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
    FormFieldSelectUserGroup,
    FormFieldRelatieKoppeling,
} from '@/components/Form'
import useAuth from '@/hooks/useAuth'

/**
 * @returns The form fields for policy objects of the type Themas
 */

export interface FormFieldGebiedsprogrammasProps {
    titleSingular: string
    crudObject: any
    handleChange: ChangeEventHandler
    editStatus?: boolean
    voegKoppelingRelatieToe: (
        propertyName: string,
        object: any,
        omschrijving: string,
        callback: () => void
    ) => void
    wijzigKoppelingRelatie: (
        koppelingObject: any,
        nieuweOmschrijving: string,
        callback: () => void
    ) => void
    verwijderKoppelingRelatie: (koppelingObject: any) => void
}

function FormFieldGebiedsprogrammas({
    titleSingular,
    crudObject,
    handleChange,
    editStatus,
    voegKoppelingRelatieToe,
    wijzigKoppelingRelatie,
    verwijderKoppelingRelatie,
}: FormFieldGebiedsprogrammasProps) {
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

    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en eigenaren.">
                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    titleSingular={titleSingular}
                />
                <FormFieldSelectUserGroup
                    disabled={isVigerend && !userIsAllowed}
                    handleChange={handleChange}
                    crudObject={crudObject}
                    fieldLabel="Personen"
                    titleSingular={titleSingular}
                    editStatus={editStatus}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving gebiedsprogramma"
                beschrijving="Beschrijving van het gebied en een visuele presentatie.">
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving']}
                    fieldLabel="Omschrijving"
                    dataObjectProperty="Omschrijving"
                    pValue="Geef een beschrijving op van het gebiedsprogramma. Denk hierbij aan een omschrijving van de ligging."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Nationaal beleid"
                beschrijving="Nationale doelstellingen kunnen de aanleiding vormen voor provinciaal beleid. Zo kan het Rijk wettelijke taken & bevoegdheden voor de provincie hebben vastgelegd of kan provinciaal beleid Nationale belangen uit de Nationale Omgevingsvisie (NOVI) dienen.">
                <FormFieldRelatieKoppeling
                    disabled={isVigerend}
                    placeholderTekst="Er is nog geen Nationaal belang of 'Wettelijke taken & bevoegdheden' gekoppeld."
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={crudObject['Titel']}
                    fieldLabel="Wettelijke taken & bevoegdheden en nationale belangen"
                    dataObjectProperty="Belangen"
                    pValue="Indien deze beleidskeuze voortkomt uit een wettelijke taak of bevoegdheid of een nationaal belang dient, selecteer je dit hieronder."
                    titleSingular={titleSingular}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
                    wijzigKoppelingRelatie={wijzigKoppelingRelatie}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                    connectionProperties={['maatregelen']}
                    crudObject={cloneDeep(crudObject)}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals (indien bekend) de datum van inwerkingtreding.">
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

export default FormFieldGebiedsprogrammas
