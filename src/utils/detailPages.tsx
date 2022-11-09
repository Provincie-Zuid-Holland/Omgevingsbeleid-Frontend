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
import ProtectedRoute from '@/App/Routes/ProtectedRoute'
import allDimensies, { filteredDimensieConstants } from '@/constants/dimensies'
import policyObjects from '@/constants/policyObjects'
import {
    BeleidsmodulesOverview,
    Beleidsrelaties,
    BeleidsrelatiesCRUD,
    Detail,
    Overview,
} from '@/pages/protected'
import MutatePolicy from '@/pages/protected/MutatePolicy'

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

const getOverview = (policyType: keyof typeof allDimensies) => (
    <ProtectedRoute
        redirectTo="/muteer/dashboard"
        roles={
            policyType === 'BELEIDSMODULES'
                ? [
                      'Beheerder',
                      'Functioneel beheerder',
                      'Technisch beheerder',
                      'Test runner',
                      'Tester',
                      'Behandelend Ambtenaar',
                      'Portefeuillehouder',
                      'Ambtelijk opdrachtgever',
                  ]
                : [
                      'Beheerder',
                      'Functioneel beheerder',
                      'Technisch beheerder',
                      'Test runner',
                      'Tester',
                  ]
        }>
        <Overview
            dimensieConstants={
                allDimensies[policyType] as filteredDimensieConstants
            }
        />
    </ProtectedRoute>
)

const getChildren = (policyType: keyof typeof policyObjects) => [
    {
        path: 'nieuw',
        element: <MutatePolicy policyConstants={policyObjects[policyType]} />,
    },
    {
        path: ':single',
        children: [
            ...(((policyType === 'MAATREGELEN' ||
                policyType === 'BELEIDSKEUZES' ||
                policyType === 'GEBIEDSPROGRAMMAS') && [
                {
                    index: true,
                    element: (
                        <Detail dimensieConstants={allDimensies[policyType]} />
                    ),
                },
            ]) ||
                (policyType === 'BELEIDSMODULES' && [
                    {
                        index: true,
                        element: <BeleidsmodulesOverview />,
                    },
                ]) ||
                []),
            {
                path: 'bewerk',
                element: (
                    <MutatePolicy policyConstants={policyObjects[policyType]} />
                ),
            },
        ],
    },
]

const detailPages = [
    {
        slug: 'ambities',
        dataModel: allDimensies.AMBITIES,
        element: getOverview('AMBITIES'),
        children: getChildren('AMBITIES'),
        isPublic: true,
        dataEndpoint: getAmbitiesLineageId,
        dataVersionEndpoint: getVersionAmbitiesObjectUuid,
        dataValidEndpoint: getValidAmbities,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
        element: getOverview('BELEIDSREGELS'),
        children: getChildren('BELEIDSREGELS'),
        isPublic: true,
        dataEndpoint: getBeleidsregelsLineageId,
        dataVersionEndpoint: getVersionBeleidsregelsObjectUuid,
        dataValidEndpoint: getValidBeleidsregels,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
        element: getOverview('BELANGEN'),
        children: getChildren('BELANGEN'),
        isPublic: true,
        dataEndpoint: getBelangenLineageId,
        dataVersionEndpoint: getVersionBelangenObjectUuid,
        dataValidEndpoint: getValidBelangen,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
        element: getOverview('MAATREGELEN'),
        children: getChildren('MAATREGELEN'),
        isPublic: true,
        dataEndpoint: getMaatregelenLineageId,
        dataVersionEndpoint: getVersionMaatregelenObjectUuid,
        dataValidEndpoint: getValidMaatregelen,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSKEUZES,
        element: getOverview('BELEIDSKEUZES'),
        children: getChildren('BELEIDSKEUZES'),
        isPublic: true,
        dataEndpoint: getBeleidskeuzesLineageId,
        dataVersionEndpoint: getVersionBeleidskeuzesObjectUuid,
        dataValidEndpoint: getValidBeleidskeuzes,
    },
    {
        slug: 'beleidsprestaties',
        dataModel: allDimensies.BELEIDSPRESTATIES,
        element: getOverview('BELEIDSPRESTATIES'),
        children: getChildren('BELEIDSPRESTATIES'),
        isPublic: true,
        dataEndpoint: getBeleidsprestatiesLineageId,
        dataVersionEndpoint: getVersionBeleidsprestatiesObjectUuid,
        dataValidEndpoint: getValidBeleidsprestaties,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
        element: getOverview('THEMAS'),
        children: getChildren('THEMAS'),
        isPublic: true,
        dataEndpoint: getThemasLineageId,
        dataVersionEndpoint: getVersionThemasObjectUuid,
        dataValidEndpoint: getValidThemas,
    },
    {
        slug: 'beleidsdoelen',
        dataModel: allDimensies.BELEIDSDOELEN,
        element: getOverview('BELEIDSDOELEN'),
        children: getChildren('BELEIDSDOELEN'),
        isPublic: true,
        dataEndpoint: getBeleidsdoelenLineageId,
        dataVersionEndpoint: getVersionBeleidsdoelenObjectUuid,
        dataValidEndpoint: getValidBeleidsdoelen,
    },
    {
        slug: 'gebiedsprogrammas',
        dataModel: allDimensies.BELEIDSDOELEN,
        element: getOverview('GEBIEDSPROGRAMMAS'),
        children: getChildren('GEBIEDSPROGRAMMAS'),
        isPublic: true,
        dataEndpoint: getGebiedsprogrammas,
        dataVersionEndpoint: getVersionGebiedsprogrammasObjectUuid,
        dataValidEndpoint: getValidGebiedsprogrammas,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        element: getOverview('VERORDENINGSTRUCTUUR'),
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
        element: getOverview('BELEIDSMODULES'),
        children: getChildren('BELEIDSMODULES'),
        isPublic: false,
    },
]

export default detailPages
