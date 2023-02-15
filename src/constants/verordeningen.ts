import { getReadVerordeningQueryKey, readVerordening } from '@/api/fetchers'

import * as AFDELING from './verordeningsafdeling'
import * as ARTIKEL from './verordeningsartikel'
import * as HOOFDSTUK from './verordeningshoofdstuk'
import * as LID from './verordeningslid'
import * as PARAGRAAF from './verordeningsparagraaf'

export const apiCall = readVerordening
export const queryKey = getReadVerordeningQueryKey

const TITLE_SINGULAR = 'Verordening'
const TITLE_PLURAL = 'Verordeningen'
const API_ENDPOINT = 'verordeningen'
const SLUG_OVERVIEW = 'verordeningen'

const VERORDENING = {
    SLUG_OVERVIEW,
    TITLE_SINGULAR,
    TITLE_PLURAL,
    API_ENDPOINT,
    LID,
    ARTIKEL,
    PARAGRAAF,
    AFDELING,
    HOOFDSTUK,
}

export default VERORDENING
