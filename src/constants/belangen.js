export const TITEL_ENKELVOUD = 'Belang'
export const TITEL_MEERVOUD = 'Belangen'
export const API_ENDPOINT = 'belangen'
export const SLUG_OVERZICHT = 'belangen'
export const SLUG_CREATE_NEW = 'nieuw-belang'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Omschrijving: {
        initValue: null,
        required: false,
        requiredMessage: '',
    },
    Type: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul het type in',
    },
    Weblink: {
        initValue: null,
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
