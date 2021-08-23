const maatregelen = [
    {
        ID: 1,
        UUID: "0000-1234",
        Begin_Geldigheid: "2020-12-12T00:00:00Z",
        Eind_Geldigheid: "2030-12-12T00:00:00Z",
        Created_By: {
            UUID: "0000-0001",
            Gebruikersnaam: "John Doe",
            Rol: "Beheerder",
            Status: "Actief",
        },
        Created_Date: "2021-03-10T14:15:23.953000Z",
        Modified_By: {
            UUID: "0000-0001",
            Gebruikersnaam: "John Doe",
            Rol: "Beheerder",
            Status: "Actief",
        },
        Modified_Date: "2021-06-29T15:08:44.693000Z",
        Eigenaar_1: {
            UUID: "0000-0001",
            Gebruikersnaam: "John Doe",
            Rol: "Behandelend Ambtenaar",
            Status: "Actief",
        },
        Eigenaar_2: {
            UUID: "0000-0001",
            Gebruikersnaam: "John Doe",
            Rol: "Behandelend Ambtenaar",
            Status: "Actief",
        },
        Portefeuillehouder_1: {
            UUID: "0000-0001",
            Gebruikersnaam: "John Doe",
            Rol: "Portefeuillehouder",
            Status: "Actief",
        },
        Portefeuillehouder_2: {
            UUID: "0000-0001",
            Gebruikersnaam: "John Doe",
            Rol: "Portefeuillehouder",
            Status: "Actief",
        },
        Opdrachtgever: {
            UUID: "0000-0001",
            Gebruikersnaam: "John Doe",
            Rol: "Ambtelijk opdrachtgever",
            Status: "Actief",
        },
        Titel: "#1 Test maatregel",
        Omschrijving: null,
        Toelichting:
            "<h2><strong>Rolkeuze</strong></h2><p><br></p><h2><strong>Uitvoering</strong></h2><p><br></p>",
        Status: "Vigerend",
        Weblink: null,
        Gebied: {
            ID: 3,
            UUID: "0000-0001",
            Begin_Geldigheid: "2018-10-30T00:00:00Z",
            Eind_Geldigheid: "2999-12-31T23:59:59Z",
            Created_By: "00000000-0000-0000-0000-000000000000",
            Created_Date: "2018-10-30T00:00:00Z",
            Modified_By: "00000000-0000-0000-0000-000000000000",
            Modified_Date: "2018-10-30T00:00:00Z",
            Werkingsgebied: "Bestaand stads- en dorpsgebied 2018",
            symbol: null,
        },
        Gebied_Duiding: "Indicatief",
        Tags: null,
        Aanpassing_Op: null,
        Ref_Beleidskeuzes: [],
        Ref_Beleidsmodules: [
            {
                ID: 2,
                UUID: "0000-0001",
                Titel: "Beleidsmodule Dos",
            },
        ],
    },
]

export { maatregelen }
