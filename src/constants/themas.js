import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const TITLE_SINGULAR = 'Thema'
export const TITLE_PLURAL = `Thema's`
export const API_ENDPOINT = 'themas'
export const SLUG_OVERVIEW = 'themas'
export const SLUG_CREATE_NEW = 'nieuw-thema'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
        testValue: `Test Thema ${currentDateFormatted}`,
        type: 'text input',
    },
    Omschrijving: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: `Omschrijving`,
        type: 'text input',
    },
    Weblink: {
        initValue: null,
        required: false,
        requiredMessage: '',
        testValue: `Weblink`,
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
