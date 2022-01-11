import * as LID from "./verordeningslid"
import * as ARTIKEL from "./verordeningsartikel"
import * as PARAGRAAF from "./verordeningsparagraaf"
import * as AFDELING from "./verordeningsafdeling"
import * as HOOFDSTUK from "./verordeningshoofdstuk"

const TITLE_SINGULAR = "Verordening"
const TITLE_PLURAL = "Verordeningen"
const API_ENDPOINT = "verordeningen"
const SLUG_OVERVIEW = "verordeningen"

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
