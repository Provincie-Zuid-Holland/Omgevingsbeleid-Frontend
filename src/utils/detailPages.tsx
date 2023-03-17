import {
    getAmbitiesLineageId,
    getBelangenLineageId,
    getBeleidsdoelenLineageId,
    getBeleidskeuzesLineageId,
    getBeleidsprestatiesLineageId,
    getBeleidsregelsLineageId,
    getMaatregelenLineageId,
    getThemasLineageId,
    getVerordeningenLineageId,
    getVersionAmbitiesObjectUuid,
    getVersionBelangenObjectUuid,
    getVersionBeleidsdoelenObjectUuid,
    getVersionBeleidskeuzesObjectUuid,
    getVersionBeleidsprestatiesObjectUuid,
    getVersionBeleidsregelsObjectUuid,
    getVersionMaatregelenObjectUuid,
    getVersionThemasObjectUuid,
    getVersionVerordeningenObjectUuid,
    getValidAmbities,
    getValidBeleidsregels,
    getValidBelangen,
    getValidMaatregelen,
    getValidBeleidskeuzes,
    getValidBeleidsprestaties,
    getValidThemas,
    getValidBeleidsdoelen,
    getValidVerordeningen,
    getGebiedsprogrammas,
    getVersionGebiedsprogrammasObjectUuid,
    getValidGebiedsprogrammas,
} from '@/api/fetchers'
import allDimensies from '@/constants/dimensies'
import { Beleidsrelaties, BeleidsrelatiesCRUD } from '@/pages/protected'

export type DetailPageEndpoint =
    | typeof getAmbitiesLineageId
    | typeof getBeleidsregelsLineageId
    | typeof getBelangenLineageId
    | typeof getMaatregelenLineageId
    | typeof getBeleidskeuzesLineageId
    | typeof getBeleidsprestatiesLineageId
    | typeof getThemasLineageId
    | typeof getBeleidsdoelenLineageId
    | typeof getVerordeningenLineageId
    | typeof getGebiedsprogrammas

export type DetailPageVersionEndpoint =
    | typeof getVersionAmbitiesObjectUuid
    | typeof getVersionBeleidsregelsObjectUuid
    | typeof getVersionBelangenObjectUuid
    | typeof getVersionMaatregelenObjectUuid
    | typeof getVersionBeleidskeuzesObjectUuid
    | typeof getVersionBeleidsprestatiesObjectUuid
    | typeof getVersionThemasObjectUuid
    | typeof getVersionBeleidsdoelenObjectUuid
    | typeof getVersionVerordeningenObjectUuid
    | typeof getVersionGebiedsprogrammasObjectUuid

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
    | typeof getValidGebiedsprogrammas

const detailPages = [
    {
        slug: 'ambities',
        dataModel: allDimensies.AMBITIES,
        isPublic: true,
        dataEndpoint: getAmbitiesLineageId,
        dataVersionEndpoint: getVersionAmbitiesObjectUuid,
        dataValidEndpoint: getValidAmbities,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
        isPublic: true,
        dataEndpoint: getBeleidsregelsLineageId,
        dataVersionEndpoint: getVersionBeleidsregelsObjectUuid,
        dataValidEndpoint: getValidBeleidsregels,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
        isPublic: true,
        dataEndpoint: getBelangenLineageId,
        dataVersionEndpoint: getVersionBelangenObjectUuid,
        dataValidEndpoint: getValidBelangen,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
        isPublic: true,
        dataEndpoint: getMaatregelenLineageId,
        dataVersionEndpoint: getVersionMaatregelenObjectUuid,
        dataValidEndpoint: getValidMaatregelen,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSKEUZES,
        isPublic: true,
        dataEndpoint: getBeleidskeuzesLineageId,
        dataVersionEndpoint: getVersionBeleidskeuzesObjectUuid,
        dataValidEndpoint: getValidBeleidskeuzes,
    },
    {
        slug: 'beleidsprestaties',
        dataModel: allDimensies.BELEIDSPRESTATIES,
        isPublic: true,
        dataEndpoint: getBeleidsprestatiesLineageId,
        dataVersionEndpoint: getVersionBeleidsprestatiesObjectUuid,
        dataValidEndpoint: getValidBeleidsprestaties,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
        isPublic: true,
        dataEndpoint: getThemasLineageId,
        dataVersionEndpoint: getVersionThemasObjectUuid,
        dataValidEndpoint: getValidThemas,
    },
    {
        slug: 'beleidsdoelen',
        dataModel: allDimensies.BELEIDSDOELEN,
        isPublic: true,
        dataEndpoint: getBeleidsdoelenLineageId,
        dataVersionEndpoint: getVersionBeleidsdoelenObjectUuid,
        dataValidEndpoint: getValidBeleidsdoelen,
    },
    {
        slug: 'gebiedsprogrammas',
        dataModel: allDimensies.BELEIDSDOELEN,
        isPublic: true,
        dataEndpoint: getGebiedsprogrammas,
        dataVersionEndpoint: getVersionGebiedsprogrammasObjectUuid,
        dataValidEndpoint: getValidGebiedsprogrammas,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        isPublic: true,
        dataEndpoint: getVerordeningenLineageId,
        dataVersionEndpoint: getVersionVerordeningenObjectUuid,
        dataValidEndpoint: getValidVerordeningen,
    },
    {
        slug: 'beleidsrelaties',
        element: <Beleidsrelaties />,
        children: [
            {
                path: ':UUID',
                children: [
                    { index: true, element: <Beleidsrelaties /> },
                    {
                        path: 'nieuw',
                        element: (
                            <BeleidsrelatiesCRUD
                                dataModel={allDimensies.BELEIDSRELATIES}
                            />
                        ),
                    },
                ],
            },
        ],
        isPublic: false,
    },
    {
        slug: 'beleidsmodules',
        isPublic: false,
    },
]

export default detailPages
