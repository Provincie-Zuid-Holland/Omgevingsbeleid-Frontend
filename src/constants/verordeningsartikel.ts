export const TITLE_SINGULAR = 'Artikel'
export const TITLE_SINGULAR_PREFIX = 'het'
export const TITLE_PLURAL = 'Artikelen'
export const TYPE = 'Artikel'
export const API_ENDPOINT = 'verordeningen'
export const SLUG_OVERVIEW = 'verordeningen'
export const SLUG_CREATE_NEW = null

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
        type: null,
    },
    Inhoud: {
        initValue: '',
        required: false,
        type: null,
    },
    Volgnummer: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een volgnummer in',
        type: null,
    },
    Werkingsgebied: {
        initValue: null,
        required: false,
        type: null,
    },
    Eigenaar_1: {
        initValue: '',
        required: true,
        requiredMessage: 'Selecteer een eerste eigenaar',
        type: null,
    },
    Eigenaar_2: {
        initValue: '',
        required: true,
        requiredMessage: 'Selecteer een tweede eigenaar',
        type: null,
    },
    Portefeuillehouder_1: {
        required: true,
        requiredMessage: 'Selecteer een eerste portefeuillehouder',
        initValue: '',
        type: null,
    },
    Portefeuillehouder_2: {
        required: true,
        requiredMessage: 'Selecteer een tweede portefeuillehouder',
        initValue: '',
        type: null,
    },
    Opdrachtgever: {
        required: true,
        requiredMessage: 'Selecteer een opdrachtgever',
        initValue: '',
        type: null,
    },
    Weblink: {
        initValue: '',
        required: false,
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
        initValue: 'Artikel',
        type: null,
    },
}
