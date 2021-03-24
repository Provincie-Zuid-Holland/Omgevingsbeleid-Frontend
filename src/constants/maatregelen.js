import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const TITLE_SINGULAR = 'Maatregel'
export const TITLE_PLURAL = 'Maatregelen'
export const API_ENDPOINT = 'maatregelen'
export const API_ENDPOINT_VIGEREND = 'valid/maatregelen'
export const SLUG_OVERVIEW = 'maatregelen'
export const SLUG_CREATE_NEW = 'nieuwe-maatregel'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
        testValue: `Test maatregel ${currentDateFormatted}`,
        type: 'text input',
    },
    Eigenaar_1: {
        initValue: null,
        required: false,
        requiredMessage: 'Selecteer een eerste eigenaar',
        testValue: `Alex de Roos`,
        type: 'react select',
    },
    Eigenaar_2: {
        initValue: null,
        required: false,
        requiredMessage: 'Selecteer een tweede eigenaar',
        testValue: `Maurice Hermans`,
        type: 'react select',
    },
    Portefeuillehouder_1: {
        initValue: null,
        required: false,
        requiredMessage: 'Selecteer een eerste portefeuillehouder',
        testValue: `Willy de Zoete`,
        type: 'react select',
    },
    Portefeuillehouder_2: {
        initValue: null,
        required: false,
        requiredMessage: 'Selecteer een tweede portefeuillehouder',
        testValue: `Adri Bom-Lemstra`,
        type: 'react select',
    },
    Opdrachtgever: {
        initValue: null,
        required: false,
        requiredMessage: 'Selecteer een opdrachtgever',
        testValue: `Albert Koffeman`,
        type: 'react select',
    },
    Gebied: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: null,
        type: 'werkingsgebied',
    },
    Toelichting: {
        initValue: '',
        required: false,
        requiredMessage: '',
        testValue: `Toelichting`,
        type: 'rich text editor',
    },
    Gebied_Duiding: {
        initValue: `Indicatief`,
        required: false,
        requiredMessage: '',
        testValue: `Indicatief`,
        type: 'radio input',
    },
    Weblink: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: `Toelichting`,
        type: 'text input',
    },
    Status: {
        initValue: 'Ontwerp GS Concept',
        required: false,
        requiredMessage: '',
        testValue: null,
        type: 'hidden', // Property is automatically generated and not displayed in the UI
    },
    Begin_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een inwerkingtreding datum in',
        testValue: currentDate,
        type: 'date input',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een uitwerkingtreding datum in',
        testValue: futureDate,
        type: 'date input',
    },
}
