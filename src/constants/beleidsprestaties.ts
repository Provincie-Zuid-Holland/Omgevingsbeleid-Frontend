import { getBeleidsprestaties, getValidBeleidsprestaties } from '@/api/fetchers'

import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const apiCall = getBeleidsprestaties
export const validApiCall = getValidBeleidsprestaties

export const TITLE_SINGULAR = 'Beleidsprestatie'
export const TITLE_SINGULAR_PREFIX = 'de'
export const TITLE_PLURAL = `Beleidsprestaties`
export const API_ENDPOINT = 'beleidsprestaties'
export const API_ENDPOINT_VIGEREND = 'valid/beleidsprestaties'
export const SLUG_OVERVIEW = 'beleidsprestaties'
export const SLUG_PUBLIC_OVERVIEW = 'beleidsprestaties'
export const DESCRIPTION =
    'De beleidsprestaties geven aan wat de provincie gaat doen om haar doelen te behalen. De beleidsprestaties zijn een uitwerking van de beleidsdoelen en komen voort uit de begroting.'

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
