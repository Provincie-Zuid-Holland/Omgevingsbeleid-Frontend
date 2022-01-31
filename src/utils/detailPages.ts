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
    getValidAmbities,
    getValidBeleidsregels,
    getValidBelangen,
    getValidMaatregelen,
    getValidBeleidskeuzes,
    getValidBeleidsprestaties,
    getValidThemas,
    getValidBeleidsdoelen,
    getValidVerordeningen,
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

export type DetailPageValidEndpoint =
    | typeof getValidAmbities
    | typeof getValidBeleidsregels
    | typeof getValidBelangen
    | typeof getValidMaatregelen
    | typeof getValidBeleidskeuzes
    | typeof getValidBeleidsprestaties
    | typeof getValidThemas
    | typeof getValidBeleidsdoelen
    | typeof getValidVerordeningen

const detailPages = [
    {
        slug: 'ambities',
        dataModel: allDimensies.AMBITIES,
        dataEndpoint: getAmbitiesLineageid,
        dataVersionEndpoint: getVersionAmbitiesObjectuuid,
        dataValidEndpoint: getValidAmbities,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
        dataEndpoint: getBeleidsregelsLineageid,
        dataVersionEndpoint: getVersionBeleidsregelsObjectuuid,
        dataValidEndpoint: getValidBeleidsregels,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
        dataEndpoint: getBelangenLineageid,
        dataVersionEndpoint: getVersionBelangenObjectuuid,
        dataValidEndpoint: getValidBelangen,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
        dataEndpoint: getMaatregelenLineageid,
        dataVersionEndpoint: getVersionMaatregelenObjectuuid,
        dataValidEndpoint: getValidMaatregelen,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSKEUZES,
        dataEndpoint: getBeleidskeuzesLineageid,
        dataVersionEndpoint: getVersionBeleidskeuzesObjectuuid,
        dataValidEndpoint: getValidBeleidskeuzes,
    },
    {
        slug: 'beleidsprestaties',
        dataModel: allDimensies.BELEIDSPRESTATIES,
        dataEndpoint: getBeleidsprestatiesLineageid,
        dataVersionEndpoint: getVersionBeleidsprestatiesObjectuuid,
        dataValidEndpoint: getValidBeleidsprestaties,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
        dataEndpoint: getThemasLineageid,
        dataVersionEndpoint: getVersionThemasObjectuuid,
        dataValidEndpoint: getValidThemas,
    },
    {
        slug: 'beleidsdoelen',
        dataModel: allDimensies.BELEIDSDOELEN,
        dataEndpoint: getBeleidsdoelenLineageid,
        dataVersionEndpoint: getVersionBeleidsdoelenObjectuuid,
        dataValidEndpoint: getValidBeleidsdoelen,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        dataEndpoint: getVerordeningenLineageid,
        dataVersionEndpoint: getVersionVerordeningenObjectuuid,
        dataValidEndpoint: getValidVerordeningen,
    },
]

export default detailPages
