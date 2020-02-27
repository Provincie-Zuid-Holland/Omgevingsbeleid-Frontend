export const TITEL_ENKELVOUD = 'Belang'
export const TITEL_MEERVOUD = 'Belangen'
export const API_ENDPOINT = 'belangen'
export const SLUG_OVERZICHT = 'belangen'
export const SLUG_CREATE_NEW = 'nieuw-belang'

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
    Type: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul het type in',
    },
    Weblink: {
        initValue: '',
        required: false,
        requiredMessage: '',
    },
    Begin_Geldigheid: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
    },
    Eind_Geldigheid: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
    },
}
