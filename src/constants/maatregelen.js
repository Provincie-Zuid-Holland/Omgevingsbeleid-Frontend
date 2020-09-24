export const TITEL_ENKELVOUD = 'Maatregel'
export const TITEL_MEERVOUD = 'Maatregelen'
export const API_ENDPOINT = 'maatregelen'
export const SLUG_OVERZICHT = 'maatregelen'
export const SLUG_CREATE_NEW = 'nieuwe-maatregel'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Gebied: {
        initValue: null,
        required: false,
        requiredMessage: '',
    },
    Toelichting: {
        initValue: '',
        required: false,
        requiredMessage: '',
    },
    Gebied_Duiding: {
        initValue: null,
        required: false,
        requiredMessage: '',
    },
    Weblink: {
        initValue: null,
        required: false,
        requiredMessage: '',
    },
    Status: {
        initValue: 'Ontwerp GS Concept',
        required: false,
        requiredMessage: '',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een inwerkingtreding datum in',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een uitwerkingtreding datum in',
    },
}
