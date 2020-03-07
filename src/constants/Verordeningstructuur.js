export const TITEL_ENKELVOUD = 'Verordening'
export const TITEL_MEERVOUD = 'Verordeningen'
export const TYPE = 'Verordening'

export const SLUG_OVERZICHT = 'verordeningen'
export const SLUG_CREATE_NEW = 'nieuwe-verordeningen'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
    },
}
