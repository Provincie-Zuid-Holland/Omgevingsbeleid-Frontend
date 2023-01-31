import {
    VerordeningUpdate,
    ThemaUpdate,
    MaatregelUpdate,
    BeleidsregelUpdate,
    BeleidsprestatieUpdate,
    BeleidsmoduleUpdate,
    BeleidskeuzeUpdate,
    BeleidsdoelUpdate,
    BelangUpdate,
    AmbitieUpdate,
    GebiedsprogrammaUpdate,
} from '@/api/fetchers.schemas'
import { VerordeningLineageWrite } from '@/types/verordening'

const ambitieEmptyWrite: AmbitieUpdate = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const beleidsmoduleEmptyWrite: BeleidsmoduleUpdate = {
    Besluit_Datum: undefined,
    Titel: undefined,
}

const belangEmptyWrite: BelangUpdate = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Type: undefined,
    Weblink: undefined,
}

const beleidsregelEmptyWrite: BeleidsregelUpdate = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Externe_URL: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const beleidskeuzeEmptyWrite: BeleidskeuzeUpdate = {
    Aanleiding: undefined,
    Afweging: undefined,
    Begin_Geldigheid: undefined,
    Belangen: undefined,
    Beleidsdoelen: undefined,
    Beleidsprestaties: undefined,
    Beleidsregels: undefined,
    Besluitnummer: undefined,
    Eigenaar_1_UUID: undefined,
    Eigenaar_2_UUID: undefined,
    Eind_Geldigheid: undefined,
    Maatregelen: undefined,
    Omschrijving_Keuze: undefined,
    Omschrijving_Werking: undefined,
    Opdrachtgever_UUID: undefined,
    Portefeuillehouder_1_UUID: undefined,
    Portefeuillehouder_2_UUID: undefined,
    Provinciaal_Belang: undefined,
    Status: 'Ontwerp GS Concept',
    Tags: undefined,
    Themas: undefined,
    Titel: undefined,
    Verordeningen: undefined,
    Weblink: undefined,
    Werkingsgebieden: undefined,
}

const maatregelEmptyWrite: MaatregelUpdate = {
    Begin_Geldigheid: undefined,
    Eigenaar_1_UUID: undefined,
    Eigenaar_2_UUID: undefined,
    Eind_Geldigheid: undefined,
    Gebied_UUID: undefined,
    Gebied_Duiding: undefined,
    Omschrijving: undefined,
    Opdrachtgever_UUID: undefined,
    Portefeuillehouder_1_UUID: undefined,
    Portefeuillehouder_2_UUID: undefined,
    Status: undefined,
    Tags: undefined,
    Titel: undefined,
    Toelichting: undefined,
    Weblink: undefined,
}

const beleidsdoelEmptyWrite: BeleidsdoelUpdate = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const beleidsprestatieEmptyWrite: BeleidsprestatieUpdate = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const themaEmptyWrite: ThemaUpdate = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Omschrijving: undefined,
    Titel: undefined,
    Weblink: undefined,
}

const verordeningStructureEmptyWrite: VerordeningLineageWrite = {
    Begin_Geldigheid: undefined,
    Eind_Geldigheid: undefined,
    Structuur: undefined,
    Status: undefined,
    Titel: undefined,
}

const verordeningEmptyWrite: VerordeningUpdate = {
    Begin_Geldigheid: undefined,
    Eigenaar_1_UUID: undefined,
    Eigenaar_2_UUID: undefined,
    Eind_Geldigheid: undefined,
    Gebied_UUID: undefined,
    Inhoud: undefined,
    Opdrachtgever_UUID: undefined,
    Portefeuillehouder_1_UUID: undefined,
    Portefeuillehouder_2_UUID: undefined,
    Status: undefined,
    Titel: undefined,
    Type: undefined,
    Volgnummer: undefined,
    Weblink: undefined,
}

const gebiedsprogrammaEmptyWrite: GebiedsprogrammaUpdate = {
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
            return Object.keys(verordeningStructureEmptyWrite) as Array<
                keyof typeof verordeningStructureEmptyWrite
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
