export const TITLE_SINGULAR = 'Artikel'
export const TITLE_SINGULAR_PREFIX = 'het'
export const TITLE_PLURAL = 'Artikelen'
export const TYPE = 'Artikel'
export const API_ENDPOINT = 'verordening'
export const SLUG_OVERVIEW = 'verordeningen'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Inhoud: {
        initValue: '',
        required: false,
    },
    Volgnummer: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een volgnummer in',
    },
    Werkingsgebied: {
        initValue: null,
        required: false,
    },
    Eigenaar_1: {
        initValue: '',
        required: true,
        requiredMessage: 'Selecteer een eerste eigenaar',
    },
    Eigenaar_2: {
        initValue: '',
        required: true,
        requiredMessage: 'Selecteer een tweede eigenaar',
    },
    Portefeuillehouder_1: {
        required: true,
        requiredMessage: 'Selecteer een eerste portefeuillehouder',
        initValue: '',
    },
    Portefeuillehouder_2: {
        required: true,
        requiredMessage: 'Selecteer een tweede portefeuillehouder',
        initValue: '',
    },
    Opdrachtgever: {
        required: true,
        requiredMessage: 'Selecteer een opdrachtgever',
        initValue: '',
    },
    Weblink: {
        initValue: '',
        required: false,
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
    Status: {
        initValue: 'Vigerend',
    },
    Type: {
        initValue: 'Artikel',
    },
}
