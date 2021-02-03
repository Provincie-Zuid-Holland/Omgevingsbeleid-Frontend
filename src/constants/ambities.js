import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const TITEL_ENKELVOUD = 'Ambitie'
export const TITEL_MEERVOUD = 'Ambities'
export const API_ENDPOINT = 'ambities'

// Wordt gebruikt voor de overzicht pagina's
export const SLUG_OVERZICHT = 'ambities'

// Wordt gebruikt bij CRUD detail pagina's
export const SLUG_CREATE_NEW = 'nieuwe-ambitie'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
        testValue: `Test ambitie ${currentDateFormatted}`,
        type: 'text input',
    },
    Omschrijving: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: 'Omschrijving',
        type: 'text input',
    },
    Weblink: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: 'Weblink',
        type: 'text input',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
        testValue: currentDate,
        type: 'date input',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
        testValue: futureDate,
        type: 'date input',
    },
}
