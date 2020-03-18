export const TITEL_ENKELVOUD = 'Doel'
export const TITEL_MEERVOUD = `Doelen`
export const API_ENDPOINT = 'doelen'
export const SLUG_OVERZICHT = 'doelen'
export const SLUG_CREATE_NEW = 'nieuw-doel'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Omschrijving: {
        initValue: '',
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
        requiredMessage: 'Vul een datum van inwerkingstreding in',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
    },
}
