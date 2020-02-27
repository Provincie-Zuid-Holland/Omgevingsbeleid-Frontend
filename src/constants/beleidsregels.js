export const TITEL_ENKELVOUD = 'Beleidsregel'
export const TITEL_MEERVOUD = 'Beleidsregels'
export const API_ENDPOINT = 'beleidsregels'
export const SLUG_OVERZICHT = 'beleidsregels'
export const SLUG_CREATE_NEW = 'nieuwe-beleidsregel'

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
