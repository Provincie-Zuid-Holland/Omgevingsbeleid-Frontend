export const TITEL_ENKELVOUD = 'Maatregel'
export const TITEL_MEERVOUD = 'Maatregelen'
export const API_ENDPOINT = 'maatregelen'
export const SLUG_OVERZICHT = 'maatregelen'
export const SLUG_CREATE_NEW = 'nieuwe-maatregel'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Gebied: {
        initValue: null,
        required: false,
        requiredMessage: '',
    },
    Omschrijving: {
        initValue: '',
        required: false,
        requiredMessage: '',
    },
    Verplicht_Programma: {
        initValue: null,
        required: false,
        requiredMessage: '',
    },
    Specifiek_Of_Generiek: {
        initValue: null,
        required: false,
        requiredMessage: '',
    },
    Weblink: {
        initValue: '',
        required: false,
        requiredMessage: '',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een inwerkingtreding datum in',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een uitwerkingtreding datum in',
    },
}
