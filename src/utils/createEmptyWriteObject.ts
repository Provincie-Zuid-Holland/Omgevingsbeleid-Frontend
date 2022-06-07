import {
    VerordeningenWrite,
    ThemasWrite,
    MaatregelenWrite,
    BeleidsregelsWrite,
    BeleidsprestatiesWrite,
    BeleidsmodulesWrite,
    BeleidskeuzesWrite,
    BeleidsdoelenWrite,
    BelangenWrite,
    AmbitiesWrite,
} from '@/api/fetchers.schemas'
import { TitleSingularType } from '@/types/dimensions'

const ambitieEmptyWrite: AmbitiesWrite = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const beleidsmoduleEmptyWrite: BeleidsmodulesWrite = {
    Besluit_Datum: undefined,
    Titel: undefined,
}

const belangEmptyWrite: BelangenWrite = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Type: undefined,
    Weblink: undefined,
}

const beleidsregelEmptyWrite: BeleidsregelsWrite = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Externe_URL: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const beleidskeuzeEmptyWrite: BeleidskeuzesWrite = {
    Aanleiding: undefined,
    Afweging: undefined,
    Ambities: undefined,
    Begin_Geldigheid: undefined,
    Belangen: undefined,
    Beleidsdoelen: undefined,
    Beleidsprestaties: undefined,
    Beleidsregels: undefined,
    Besluitnummer: undefined,
    Eigenaar_1: undefined,
    Eigenaar_2: undefined,
    Eind_Geldigheid: undefined,
    Maatregelen: undefined,
    Omschrijving_Keuze: undefined,
    Omschrijving_Werking: undefined,
    Opdrachtgever: undefined,
    Portefeuillehouder_1: undefined,
    Portefeuillehouder_2: undefined,
    Provinciaal_Belang: undefined,
    Status: 'Ontwerp GS Concept',
    Tags: undefined,
    Themas: undefined,
    Titel: undefined,
    Verordeningen: undefined,
    Weblink: undefined,
    Werkingsgebieden: undefined,
}

const maatregelEmptyWrite: MaatregelenWrite = {
    Begin_Geldigheid: undefined,
    Eigenaar_1: undefined,
    Eigenaar_2: undefined,
    Eind_Geldigheid: undefined,
    Gebied: undefined,
    Gebied_Duiding: undefined,
    Omschrijving: undefined,
    Opdrachtgever: undefined,
    Portefeuillehouder_1: undefined,
    Portefeuillehouder_2: undefined,
    Status: undefined,
    Tags: undefined,
    Titel: undefined,
    Toelichting: undefined,
    Weblink: undefined,
}

const beleidsdoelEmptyWrite: BeleidsdoelenWrite = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const beleidsprestatieEmptyWrite: BeleidsprestatiesWrite = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const themaEmptyWrite: ThemasWrite = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const verordeningEmptyWrite: VerordeningenWrite = {
    Begin_Geldigheid: undefined,
    Eigenaar_1: undefined,
    Eigenaar_2: undefined,
    Eind_Geldigheid: undefined,
    Gebied: undefined,
    Inhoud: undefined,
    Opdrachtgever: undefined,
    Portefeuillehouder_1: undefined,
    Portefeuillehouder_2: undefined,
    Status: undefined,
    Titel: undefined,
    Type: undefined,
    Volgnummer: undefined,
    Weblink: undefined,
}

export const getWriteObjectProperties = (titleSingular: TitleSingularType) => {
    switch (titleSingular) {
        case 'Ambitie':
            return Object.keys(ambitieEmptyWrite) as Array<
                keyof typeof ambitieEmptyWrite
            >
        case 'Beleidsmodule':
            return Object.keys(beleidsmoduleEmptyWrite) as Array<
                keyof typeof beleidsmoduleEmptyWrite
            >
        case 'Belang':
            return Object.keys(belangEmptyWrite) as Array<
                keyof typeof belangEmptyWrite
            >
        case 'Beleidsregel':
            return Object.keys(beleidsregelEmptyWrite) as Array<
                keyof typeof beleidsregelEmptyWrite
            >
        case 'Beleidskeuze':
            return Object.keys(beleidskeuzeEmptyWrite) as Array<
                keyof typeof beleidskeuzeEmptyWrite
            >
        case 'Maatregel':
            return Object.keys(maatregelEmptyWrite) as Array<
                keyof typeof maatregelEmptyWrite
            >
        case 'Beleidsdoel':
            return Object.keys(beleidsdoelEmptyWrite) as Array<
                keyof typeof beleidsdoelEmptyWrite
            >
        case 'Beleidsprestatie':
            return Object.keys(beleidsprestatieEmptyWrite) as Array<
                keyof typeof beleidsprestatieEmptyWrite
            >
        case 'Thema':
            return Object.keys(themaEmptyWrite) as Array<
                keyof typeof themaEmptyWrite
            >
        case 'Verordening':
            return Object.keys(verordeningEmptyWrite) as Array<
                keyof typeof verordeningEmptyWrite
            >
    }
}

export const createEmptyWriteObject = (titleSingular: TitleSingularType) => {
    switch (titleSingular) {
        case 'Ambitie':
            return ambitieEmptyWrite
        case 'Beleidsmodule':
            return beleidsmoduleEmptyWrite
        case 'Belang':
            return belangEmptyWrite
        case 'Beleidsregel':
            return beleidsregelEmptyWrite
        case 'Beleidskeuze':
            return beleidskeuzeEmptyWrite
        case 'Maatregel':
            return maatregelEmptyWrite
        case 'Beleidsdoel':
            return beleidsdoelEmptyWrite
        case 'Beleidsprestatie':
            return beleidsprestatieEmptyWrite
        case 'Thema':
            return themaEmptyWrite
        case 'Verordening':
            return verordeningEmptyWrite
    }
}

export default createEmptyWriteObject
