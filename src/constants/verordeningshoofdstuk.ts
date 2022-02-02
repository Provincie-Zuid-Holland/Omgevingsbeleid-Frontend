export const TITLE_SINGULAR = 'Hoofdstuk'
export const TITLE_SINGULAR_PREFIX = 'het'
export const TITLE_PLURAL = 'Hoofdstukken'
export const TYPE = 'Hoofdstuk'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
        type: null,
    },
    Volgnummer: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een volgnummer in',
        type: null,
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
        type: null,
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
        type: null,
    },
    Status: {
        initValue: 'Vigerend',
        type: null,
    },
    Type: {
        initValue: 'Hoofdstuk',
        type: null,
    },
}
