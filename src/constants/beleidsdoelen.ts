import {
    readBeleidsdoelen,
    readValidBeleidsdoelen,
    getReadBeleidsdoelenQueryKey,
} from '@/api/fetchers'

import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const apiCall = readBeleidsdoelen
export const validApiCall = readValidBeleidsdoelen
export const queryKey = getReadBeleidsdoelenQueryKey

export const TITLE_SINGULAR = 'Beleidsdoel'
export const TITLE_SINGULAR_PREFIX = 'het'
export const TITLE_PLURAL = 'Beleidsdoelen'
export const API_ENDPOINT = 'beleidsdoelen'
export const API_ENDPOINT_VIGEREND = 'valid/beleidsdoelen'
export const SLUG_OVERVIEW = 'beleidsdoelen'
export const DESCRIPTION =
    'De beleidsdoelen geven aan wat de provincie wil bereiken. De beleidsdoelen zijn een uitwerking van de ambities en komen voort uit de begroting.'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een titel in',
        testValue: `Test beleidsdoel ${currentDateFormatted}`,
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
