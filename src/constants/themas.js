export const TITEL_ENKELVOUD = 'Thema'
export const TITEL_MEERVOUD = `Thema's`
export const API_ENDPOINT = 'themas'
export const SLUG_OVERZICHT = 'themas'
export const SLUG_CREATE_NEW = 'nieuw-thema'

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
