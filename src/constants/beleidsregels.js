export const TITEL_ENKELVOUD = 'Beleidsregel'
export const TITEL_MEERVOUD = 'Beleidsregels'
export const API_ENDPOINT = 'beleidsregels'
export const SLUG_OVERZICHT = 'beleidsregels'
export const SLUG_CREATE_NEW = 'nieuwe-beleidsregel'

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
