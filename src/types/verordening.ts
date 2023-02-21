export interface VerordeningStructuur {
    Children: VerordeningStructureChild[]
}
export interface VerordeningLineageRead {
    ID: number
    UUID: string
    Titel: string
    Structuur: VerordeningStructuur
    Begin_Geldigheid: Date
    Eind_Geldigheid: Date
    Created_By: string
    Created_Date: Date
    Modified_By: string
    Modified_Date: Date
    Status: string
}

export interface VerordeningStructureChild {
    Children: VerordeningStructureChild[]
    Gebied: null | string
    Inhoud: string
    Titel: string
    Type: 'Hoofdstuk' | 'Afdeling' | 'Paragraaf' | 'Artikel' | 'Lid'
    UUID: string
    Volgnummer: string
}

export interface VerordeningLineageWrite {
    Titel?: string
    Structuur?: {
        Children: VerordeningStructureChild[]
    }
    Begin_Geldigheid?: string
    Eind_Geldigheid?: string
    Status?: string
}

export interface VerordeningChildWrite {
    Children?: VerordeningChildWrite[]
    Gebied_UUID?: null | string
    Inhoud?: string
    Status?: string
    Titel?: string
    Type: 'Hoofdstuk' | 'Afdeling' | 'Paragraaf' | 'Artikel' | 'Lid'
    Volgnummer?: string
}

export interface Gebied {
    ID: number
    UUID: string
    Begin_Geldigheid: Date
    Eind_Geldigheid: Date
    Created_By: string
    Created_Date: Date
    Modified_By: string
    Modified_Date: Date
    Werkingsgebied: string
    symbol: string
}
