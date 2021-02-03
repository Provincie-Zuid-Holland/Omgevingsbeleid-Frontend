import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const TITEL_ENKELVOUD = 'Doel'
export const TITEL_MEERVOUD = `Doelen`
export const API_ENDPOINT = 'doelen'
export const SLUG_OVERZICHT = 'doelen'
export const SLUG_CREATE_NEW = 'nieuw-doel'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
        testValue: `Test beleidsregel ${currentDateFormatted}`,
        type: 'text input',
    },
    Omschrijving: {
        initValue: '',
        required: false,
        requiredMessage: '',
        testValue: 'Omschrijving',
        type: 'text input',
    },
    Weblink: {
        initValue: '',
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
