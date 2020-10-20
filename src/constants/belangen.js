import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const TITEL_ENKELVOUD = 'Belang'
export const TITEL_MEERVOUD = 'Belangen'
export const API_ENDPOINT = 'belangen'
export const SLUG_OVERZICHT = 'belangen'
export const SLUG_CREATE_NEW = 'nieuw-belang'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        testValue: `Test ambitie ${currentDateFormatted}`,
        type: 'text input',
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Omschrijving: {
        initValue: null,
        testValue: 'Omschrijving',
        type: 'text input',
        required: false,
        requiredMessage: '',
    },
    Type: {
        initValue: null,
        testValue: 'Nationaal Belang',
        type: 'select',
        required: true,
        requiredMessage: 'Vul het type in',
    },
    Weblink: {
        initValue: null,
        testValue: 'Weblink',
        type: 'text input',
        required: false,
        requiredMessage: '',
    },
    Begin_Geldigheid: {
        initValue: null,
        testValue: currentDate,
        type: 'date input',
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
    },
    Eind_Geldigheid: {
        initValue: null,
        testValue: futureDate,
        type: 'date input',
        required: false,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
    },
}
