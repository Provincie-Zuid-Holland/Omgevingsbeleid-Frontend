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
    GebiedsprogrammasWrite,
} from '@/api/fetchers.schemas'

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

const gebiedsprogrammaEmptyWrite: GebiedsprogrammasWrite = {
    Afbeelding: undefined,
    Maatregelen: undefined,
    Titel: undefined,
    Omschrijving: undefined,
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Status: undefined,
}

export const getWriteObjectProperties = (titleSingular: string) => {
    switch (titleSingular) {
        case 'ambitie':
            return Object.keys(ambitieEmptyWrite) as Array<
                keyof typeof ambitieEmptyWrite
            >
        case 'beleidsmodule':
            return Object.keys(beleidsmoduleEmptyWrite) as Array<
                keyof typeof beleidsmoduleEmptyWrite
            >
        case 'belang':
            return Object.keys(belangEmptyWrite) as Array<
                keyof typeof belangEmptyWrite
            >
        case 'beleidsregel':
            return Object.keys(beleidsregelEmptyWrite) as Array<
                keyof typeof beleidsregelEmptyWrite
            >
        case 'beleidskeuze':
            return Object.keys(beleidskeuzeEmptyWrite) as Array<
                keyof typeof beleidskeuzeEmptyWrite
            >
        case 'maatregel':
            return Object.keys(maatregelEmptyWrite) as Array<
                keyof typeof maatregelEmptyWrite
            >
        case 'beleidsdoel':
            return Object.keys(beleidsdoelEmptyWrite) as Array<
                keyof typeof beleidsdoelEmptyWrite
            >
        case 'beleidsprestatie':
            return Object.keys(beleidsprestatieEmptyWrite) as Array<
                keyof typeof beleidsprestatieEmptyWrite
            >
        case 'gebiedsprogramma':
            return Object.keys(gebiedsprogrammaEmptyWrite) as Array<
                keyof typeof gebiedsprogrammaEmptyWrite
            >
        case 'thema':
            return Object.keys(themaEmptyWrite) as Array<
                keyof typeof themaEmptyWrite
            >
        case 'verordening':
            return Object.keys(verordeningEmptyWrite) as Array<
                keyof typeof verordeningEmptyWrite
            >
    }
}

export const createEmptyWriteObject = (titleSingular: string) => {
    switch (titleSingular) {
        case 'ambitie':
            return ambitieEmptyWrite
        case 'beleidsmodule':
            return beleidsmoduleEmptyWrite
        case 'belang':
            return belangEmptyWrite
        case 'beleidsregel':
            return beleidsregelEmptyWrite
        case 'beleidskeuze':
            return beleidskeuzeEmptyWrite
        case 'maatregel':
            return maatregelEmptyWrite
        case 'beleidsdoel':
            return beleidsdoelEmptyWrite
        case 'beleidsprestatie':
            return beleidsprestatieEmptyWrite
        case 'thema':
            return themaEmptyWrite
        case 'verordening':
            return verordeningEmptyWrite
    }
}

export default createEmptyWriteObject
