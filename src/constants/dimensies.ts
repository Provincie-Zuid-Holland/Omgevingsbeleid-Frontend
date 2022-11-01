import * as AMBITIES from './ambities'
import * as BELANGEN from './belangen'
import * as BELEIDSDOELEN from './beleidsdoelen'
import * as BELEIDSKEUZES from './beleidskeuzes'
import * as BELEIDSMODULES from './beleidsmodules'
import * as BELEIDSPRESTATIES from './beleidsprestaties'
import * as BELEIDSREGELS from './beleidsregels'
import * as BELEIDSRELATIES from './beleidsrelaties'
import * as GEBIEDSPROGRAMMAS from './gebiedsprogrammas'
import * as MAATREGELEN from './maatregelen'
import * as THEMAS from './themas'
import * as VERORDENINGSARTIKEL from './verordeningsartikel'
import * as VERORDENINGSTRUCTUUR from './verordeningstructuur'

const constants = {
    AMBITIES,
    BELANGEN,
    BELEIDSKEUZES,
    BELEIDSREGELS,
    BELEIDSRELATIES,
    BELEIDSPRESTATIES,
    BELEIDSMODULES,
    BELEIDSDOELEN,
    MAATREGELEN,
    THEMAS,
    GEBIEDSPROGRAMMAS,
    VERORDENINGSTRUCTUUR,
    VERORDENINGSARTIKEL,
}

export type filteredDimensieConstants = Exclude<
    typeof constants[keyof typeof constants],
    | typeof constants['VERORDENINGSARTIKEL']
    | typeof constants['BELEIDSRELATIES']
>

export default constants
