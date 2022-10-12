import * as AMBITIES from './ambities'
import * as BELANGEN from './belangen'
import * as BELEIDSDOELEN from './beleidsdoelen'
import * as BELEIDSKEUZES from './beleidskeuzes'
import * as BELEIDSMODULES from './beleidsmodules'
import * as BELEIDSPRESTATIES from './beleidsprestaties'
import * as BELEIDSREGELS from './beleidsregels'
import * as GEBIEDSPROGRAMMAS from './gebiedsprogrammas'
import * as MAATREGELEN from './maatregelen'
import * as THEMAS from './themas'
import * as VERORDENING from './verordeningen'

const policyObjects = {
    AMBITIES,
    BELANGEN,
    BELEIDSDOELEN,
    BELEIDSKEUZES,
    BELEIDSMODULES,
    BELEIDSPRESTATIES,
    BELEIDSREGELS,
    MAATREGELEN,
    GEBIEDSPROGRAMMAS,
    THEMAS,
    VERORDENING,
}

export type PolicyObjectsMeta =
    typeof policyObjects[keyof typeof policyObjects]['META']

export type PolicyTitlesSingular =
    | 'ambitie'
    | 'belang'
    | 'beleidsdoel'
    | 'beleidskeuze'
    | 'beleidsmodule'
    | 'beleidsprestatie'
    | 'beleidsregel'
    | 'maatregel'
    | 'gebiedsprogramma'
    | 'thema'
    | 'verordening'

export type PolicyTitlesPlural =
    | 'ambities'
    | 'belangen'
    | 'beleidsdoelen'
    | 'beleidskeuzes'
    | 'beleidsmodules'
    | 'beleidsprestaties'
    | 'beleidsregels'
    | 'maatregelen'
    | "gebiedsprogramma's"
    | 'themas'
    | 'verordeningen'

export default policyObjects
