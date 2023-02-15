import {
    getReadVerordeningQueryKey,
    readVerordeningstructuren,
} from '@/api/fetchers'

export const TITLE_SINGULAR = 'Verordening'
export const TITLE_SINGULAR_PREFIX = 'de'
export const TITLE_PLURAL = 'Verordeningen'
export const TYPE = 'Verordening'
export const API_ENDPOINT = 'verordeningstructuur'

export const SLUG_OVERVIEW = 'verordeningen'

export const apiCall = readVerordeningstructuren
export const queryKey = getReadVerordeningQueryKey

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
        type: null,
    },
    Status: {
        initValue: 'Concept',
        required: false,
        requiredMessage: null,
        type: null,
    },
    Structuur: {
        initValue: { Children: [] },
        required: false,
        requiredMessage: null,
        type: null,
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
        type: null,
    },
    Eind_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
        type: null,
    },
}
