import { getBeleidsregels, getValidBeleidsregels } from '@/api/fetchers'

import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const apiCall = getBeleidsregels
export const validApiCall = getValidBeleidsregels

export const TITLE_SINGULAR = 'Beleidsregel'
export const TITLE_SINGULAR_PREFIX = 'de'
export const TITLE_PLURAL = 'Beleidsregels'
export const API_ENDPOINT = 'beleidsregels'
export const API_ENDPOINT_VIGEREND = 'valid/beleidsregels'
export const SLUG_OVERVIEW = 'beleidsregels'
export const DESCRIPTION =
    'De beleidsregels geven aan waar de provincie zich minimaal voor moet inspannen. De beleidsregels zijn individuele regels die de provincie zelf vaststelt. '

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
        testValue: `Test beleidsregel ${currentDateFormatted}`,
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
    Externe_URL: {
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
