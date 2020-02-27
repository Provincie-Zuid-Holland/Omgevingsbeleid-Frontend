export const TITEL_ENKELVOUD = 'Ambitie'
export const TITEL_MEERVOUD = 'Ambities'
export const API_ENDPOINT = 'ambities'

// Wordt gebruikt voor de overzicht pagina's
export const SLUG_OVERZICHT = 'ambities'

// Wordt gebruikt bij CRUD detail pagina's
export const SLUG_CREATE_NEW = 'nieuwe-ambitie'

// !REFACTOR!
// Werd gebruikt als key bij het opslaan van de state in LocalStorage
export const OBJECT_NAME = 'Ambitie'

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
