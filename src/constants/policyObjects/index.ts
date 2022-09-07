import * as AMBITIES from './ambities'
import * as BELANGEN from './belangen'
import * as BELEIDSDOELEN from './beleidsdoelen'
import * as BELEIDSKEUZES from './beleidskeuzes'
import * as BELEIDSMODULES from './beleidsmodules'
import * as BELEIDSPRESTATIES from './beleidsprestaties'
import * as BELEIDSREGELS from './beleidsregels'
import * as MAATREGELEN from './maatregelen'

const policyObjects = {
    AMBITIES,
    BELANGEN,
    BELEIDSDOELEN,
    BELEIDSKEUZES,
    BELEIDSMODULES,
    BELEIDSPRESTATIES,
    BELEIDSREGELS,
    MAATREGELEN,
}

export type PolicyObjectsMeta =
    typeof policyObjects[keyof typeof policyObjects]['META']

export default policyObjects
