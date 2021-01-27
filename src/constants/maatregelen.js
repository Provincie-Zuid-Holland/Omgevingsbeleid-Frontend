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
