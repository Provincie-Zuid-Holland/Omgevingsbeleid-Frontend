import {
    getAmbitiesLineageid,
    getBelangenLineageid,
    getBeleidsdoelenLineageid,
    getBeleidskeuzesLineageid,
    getBeleidsprestatiesLineageid,
    getBeleidsregelsLineageid,
    getMaatregelenLineageid,
    getThemasLineageid,
    getVerordeningenLineageid,
    getVersionAmbitiesObjectuuid,
    getVersionBelangenObjectuuid,
    getVersionBeleidsdoelenObjectuuid,
    getVersionBeleidskeuzesObjectuuid,
    getVersionBeleidsprestatiesObjectuuid,
    getVersionBeleidsregelsObjectuuid,
    getVersionMaatregelenObjectuuid,
    getVersionThemasObjectuuid,
    getVersionVerordeningenObjectuuid,
} from '@/api/fetchers'
import allDimensies from '@/constants/dimensies'

export type DetailPageEndpoint =
    | typeof getAmbitiesLineageid
    | typeof getBeleidsregelsLineageid
    | typeof getBelangenLineageid
    | typeof getMaatregelenLineageid
    | typeof getBeleidskeuzesLineageid
    | typeof getBeleidsprestatiesLineageid
    | typeof getThemasLineageid
    | typeof getBeleidsdoelenLineageid
    | typeof getVerordeningenLineageid

export type DetailPageVersionEndpoint =
    | typeof getVersionAmbitiesObjectuuid
    | typeof getVersionBeleidsregelsObjectuuid
    | typeof getVersionBelangenObjectuuid
    | typeof getVersionMaatregelenObjectuuid
    | typeof getVersionBeleidskeuzesObjectuuid
    | typeof getVersionBeleidsprestatiesObjectuuid
    | typeof getVersionThemasObjectuuid
    | typeof getVersionBeleidsdoelenObjectuuid
    | typeof getVersionVerordeningenObjectuuid

const detailPages = [
    {
        slug: 'ambities',
        dataModel: allDimensies.AMBITIES,
        dataEndpoint: getAmbitiesLineageid,
        dataVersionEndpoint: getVersionAmbitiesObjectuuid,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
        dataEndpoint: getBeleidsregelsLineageid,
        dataVersionEndpoint: getVersionBeleidsregelsObjectuuid,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
        dataEndpoint: getBelangenLineageid,
        dataVersionEndpoint: getVersionBelangenObjectuuid,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
        dataEndpoint: getMaatregelenLineageid,
        dataVersionEndpoint: getVersionMaatregelenObjectuuid,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSKEUZES,
        dataEndpoint: getBeleidskeuzesLineageid,
        dataVersionEndpoint: getVersionBeleidskeuzesObjectuuid,
    },
    {
        slug: 'beleidsprestaties',
        dataModel: allDimensies.BELEIDSPRESTATIES,
        dataEndpoint: getBeleidsprestatiesLineageid,
        dataVersionEndpoint: getVersionBeleidsprestatiesObjectuuid,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
        dataEndpoint: getThemasLineageid,
        dataVersionEndpoint: getVersionThemasObjectuuid,
    },
    {
        slug: 'beleidsdoelen',
        dataModel: allDimensies.BELEIDSDOELEN,
        dataEndpoint: getBeleidsdoelenLineageid,
        dataVersionEndpoint: getVersionBeleidsdoelenObjectuuid,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        dataEndpoint: getVerordeningenLineageid,
        dataVersionEndpoint: getVersionVerordeningenObjectuuid,
    },
]

export default detailPages
