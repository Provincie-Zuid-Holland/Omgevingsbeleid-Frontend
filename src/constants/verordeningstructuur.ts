import { customInstance } from '@/api/instance'

export const TITLE_SINGULAR = 'Verordening'
export const TITLE_SINGULAR_PREFIX = 'de'
export const TITLE_PLURAL = 'Verordeningen'
export const TYPE = 'Verordening'
export const API_ENDPOINT = 'verordeningstructuur'

export const SLUG_OVERVIEW = 'verordeningen'
export const SLUG_CREATE_NEW = 'nieuwe-verordening'

export const apiCall = (params?: any) => {
    return customInstance<any[]>({
        url: `/verordeningstructuur`,
        method: 'get',
        params,
    })
}

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
    },
}
