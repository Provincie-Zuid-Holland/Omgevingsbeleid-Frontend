import { getMaatregelen, getValidMaatregelen } from '@/api/fetchers'

import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const apiCall = getMaatregelen
export const validApiCall = getValidMaatregelen

export const TITLE_SINGULAR = 'Maatregel'
export const TITLE_SINGULAR_PREFIX = 'de'
export const TITLE_PLURAL = 'Maatregelen'
export const API_ENDPOINT = 'maatregelen'
export const API_ENDPOINT_VIGEREND = 'valid/maatregelen'
export const SLUG_OVERVIEW = 'maatregelen'
export const SLUG_CREATE_NEW = 'nieuwe-maatregel'
export const DESCRIPTION =
    'De maatregelen geven aan wat de provincie gaat doen om de keuzes uit te voeren. De maatregelen zijn een uitwerking van de beleidskeuzes en komen voort uit het Omgevingsprogramma.'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: [
            'Ontwerp GS Concept',
            'Ontwerp GS',
            'Ontwerp PS',
            'Ontwerp in inspraak',
            'Definitief ontwerp GS concept',
            'Definitief ontwerp GS',
            'Definitief ontwerp PS',
            'Vastgesteld',
            'Vigerend',
            'Uitgecheckt',
        ],
        requiredMessage: 'Vul een titel in',
        testValue: `Test maatregel ${currentDateFormatted}`,
        type: 'text input',
    },
    Eigenaar_1: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een eerste eigenaar',
        testValue: `Alex de Roos`,
        type: 'react select',
    },
    Eigenaar_2: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een tweede eigenaar',
        testValue: `Maurice Hermans`,
        type: 'react select',
    },
    Portefeuillehouder_1: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een eerste portefeuillehouder',
        testValue: `Willy de Zoete`,
        type: 'react select',
    },
    Portefeuillehouder_2: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een tweede portefeuillehouder',
        testValue: `Adri Bom-Lemstra`,
        type: 'react select',
    },
    Opdrachtgever: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een opdrachtgever',
        testValue: `Albert Koffeman`,
        type: 'react select',
    },
    Gebied: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een werkingsgebied',
        testValue: null,
        type: 'werkingsgebied',
    },
    Toelichting: {
        initValue: '',
        required: [],
        requiredMessage: '',
        testValue: `Toelichting`,
        type: 'rich text editor',
    },
    Gebied_Duiding: {
        initValue: `Indicatief`,
        required: [],
        requiredMessage: '',
        testValue: `Indicatief`,
        type: 'radio input',
    },
    Weblink: {
        initValue: null,
        required: [],
        requiredMessage: '',
        testValue: `Toelichting`,
        type: 'text input',
    },
    Status: {
        initValue: 'Ontwerp GS Concept',
        required: [],
        requiredMessage: '',
        testValue: null,
        type: 'hidden', // Property is automatically generated and not displayed in the UI
    },
    Begin_Geldigheid: {
        initValue: null,
        required: ['Definitief ontwerp PS', 'Vastgesteld', 'Vigerend'],
        requiredMessage: 'Vul een inwerkingtreding datum in',
        testValue: currentDate,
        type: 'date input',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: [],
        requiredMessage: 'Vul een uitwerkingtreding datum in',
        testValue: futureDate,
        type: 'date input',
    },
}
