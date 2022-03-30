import {
    VerordeningenRead,
    ThemasRead,
    MaatregelenRead,
    BeleidsregelsRead,
    BeleidsprestatiesRead,
    BeleidsmodulesRead,
    BeleidskeuzesRead,
    BeleidsdoelenRead,
    BelangenRead,
    AmbitiesRead,
} from '@/api/fetchers.schemas'
import { TitleSingularType } from '@/types/dimensions'

export const getWriteObjectProperties = (titleSingular: TitleSingularType) => {
    switch (titleSingular) {
        case 'Ambitie':
            const ambitieWriteObject = createEmptyWriteObject('Ambitie')
            return Object.keys(ambitieWriteObject) as Array<
                keyof typeof ambitieWriteObject
            >
        case 'Beleidsmodule':
            const beleidsmoduleWriteObject =
                createEmptyWriteObject('Beleidsmodule')
            return Object.keys(beleidsmoduleWriteObject) as Array<
                keyof typeof beleidsmoduleWriteObject
            >
        case 'Belang':
            const belangWriteObject = createEmptyWriteObject('Belang')
            return Object.keys(belangWriteObject) as Array<
                keyof typeof belangWriteObject
            >
        case 'Beleidsregel':
            const beleidsregelWriteObject =
                createEmptyWriteObject('Beleidsregel')
            return Object.keys(beleidsregelWriteObject) as Array<
                keyof typeof beleidsregelWriteObject
            >
        case 'Beleidskeuze':
            const beleidskeuzeWriteObject =
                createEmptyWriteObject('Beleidskeuze')
            return Object.keys(beleidskeuzeWriteObject) as Array<
                keyof typeof beleidskeuzeWriteObject
            >
        case 'Maatregel':
            const maatregelWriteObject = createEmptyWriteObject('Maatregel')
            return Object.keys(maatregelWriteObject) as Array<
                keyof typeof maatregelWriteObject
            >
        case 'Beleidsdoel':
            const beleidsdoelWriteObject = createEmptyWriteObject('Beleidsdoel')
            return Object.keys(beleidsdoelWriteObject) as Array<
                keyof typeof beleidsdoelWriteObject
            >
        case 'Beleidsprestatie':
            const beleidsprestatieWriteObject =
                createEmptyWriteObject('Beleidsprestatie')
            return Object.keys(beleidsprestatieWriteObject) as Array<
                keyof typeof beleidsprestatieWriteObject
            >
        case 'Thema':
            const themaWriteObject = createEmptyWriteObject('Thema')
            return Object.keys(themaWriteObject) as Array<
                keyof typeof themaWriteObject
            >
        case 'Verordening':
            const verordeningWriteObject = createEmptyWriteObject('Verordening')
            return Object.keys(verordeningWriteObject) as Array<
                keyof typeof verordeningWriteObject
            >
    }
}

export const createEmptyWriteObject = (titleSingular: TitleSingularType) => {
    switch (titleSingular) {
        case 'Ambitie':
            const ambitieEmptyWrite: AmbitiesRead = {
                Begin_Geldigheid: undefined,
                Eind_Geldigheid: undefined,
                Omschrijving: undefined,
                Titel: undefined,
                Weblink: undefined,
            }
            return ambitieEmptyWrite
        case 'Beleidsmodule':
            const beleidsmoduleEmptyWrite: BeleidsmodulesRead = {
                Begin_Geldigheid: undefined,
                Beleidskeuzes: undefined,
                Besluit_Datum: undefined,
                Eind_Geldigheid: undefined,
                Maatregelen: undefined,
                Titel: undefined,
            }
            return beleidsmoduleEmptyWrite
        case 'Belang':
            const belangEmptyWrite: BelangenRead = {
                Begin_Geldigheid: undefined,
                Eind_Geldigheid: undefined,
                Omschrijving: undefined,
                Titel: undefined,
                Type: undefined,
                Weblink: undefined,
            }
            return belangEmptyWrite
        case 'Beleidsregel':
            const beleidsregelEmptyWrite: BeleidsregelsRead = {
                Begin_Geldigheid: undefined,
                Eind_Geldigheid: undefined,
                Externe_URL: undefined,
                Omschrijving: undefined,
                Titel: undefined,
                Weblink: undefined,
            }
            return beleidsregelEmptyWrite
        case 'Beleidskeuze':
            const beleidskeuzeEmptyWrite: BeleidskeuzesRead = {
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
                Status: undefined,
                Tags: undefined,
                Themas: undefined,
                Titel: undefined,
                Verordeningen: undefined,
                Weblink: undefined,
                Werkingsgebieden: undefined,
            }
            return beleidskeuzeEmptyWrite
        case 'Maatregel':
            const maatregelEmptyWrite: MaatregelenRead = {
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
            return maatregelEmptyWrite
        case 'Beleidsdoel':
            const beleidsdoelEmptyWrite: BeleidsdoelenRead = {
                Begin_Geldigheid: undefined,
                Eind_Geldigheid: undefined,
                Omschrijving: undefined,
                Titel: undefined,
                Weblink: undefined,
            }
            return beleidsdoelEmptyWrite
        case 'Beleidsprestatie':
            const beleidsprestatieEmptyWrite: BeleidsprestatiesRead = {
                Begin_Geldigheid: undefined,
                Eind_Geldigheid: undefined,
                Omschrijving: undefined,
                Titel: undefined,
                Weblink: undefined,
            }
            return beleidsprestatieEmptyWrite
        case 'Thema':
            const themaEmptyWrite: ThemasRead = {
                Begin_Geldigheid: undefined,
                Eind_Geldigheid: undefined,
                Omschrijving: undefined,
                Titel: undefined,
                Weblink: undefined,
            }
            return themaEmptyWrite
        case 'Verordening':
            const verordeningEmptyWrite: VerordeningenRead = {
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
            return verordeningEmptyWrite
    }
}

export default createEmptyWriteObject
