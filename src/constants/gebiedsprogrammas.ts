import { getGebiedsprogrammas, getValidGebiedsprogrammas } from '@/api/fetchers'

import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const apiCall = getGebiedsprogrammas
export const validApiCall = getValidGebiedsprogrammas

export const TITLE_SINGULAR = 'Gebiedsprogramma'
export const TITLE_SINGULAR_PREFIX = 'het'
export const TITLE_PLURAL = "Gebiedsprogramma's"
export const API_ENDPOINT = 'gebiedsprogrammas'
export const API_ENDPOINT_VIGEREND = 'valid/gebiedsprogrammas'
export const SLUG_OVERVIEW = 'gebiedsprogrammas'
export const SLUG_PUBLIC_OVERVIEW = 'omgevingsprogramma/gebiedsprogrammas'
export const DESCRIPTION = 'omschrijving'

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
