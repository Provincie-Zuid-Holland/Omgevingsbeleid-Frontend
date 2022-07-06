export interface VerordeningLineageRead {
    ID: number
    UUID: string
    Titel: string
    Structuur: {
        Children: VerordeningChildRead[]
    }
    Begin_Geldigheid: Date
    Eind_Geldigheid: Date
    Created_By: string
    Created_Date: Date
    Modified_By: string
    Modified_Date: Date
    Status: string
}

export interface VerordeningChildRead {
    Children: VerordeningChildRead[]
    Gebied: null | string
    Inhoud: string
    Titel: string
    Type: 'Hoofdstuk' | 'Paragraaf' | 'Artikel' | 'Lid'
    UUID: string
    Volgnummer: string
}
