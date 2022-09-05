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
} from '@/api/fetchers'
import ProtectedRoute from '@/App/Routes/ProtectedRoute'
import allDimensies, { filteredDimensieConstants } from '@/constants/dimensies'
import {
    BeleidsmodulesOverview,
    Beleidsrelaties,
    BeleidsrelatiesCRUD,
    Detail,
    Overview,
    VerordeningenstructuurOverzicht,
} from '@/pages/protected'
import UniversalObjectCRUD from '@/pages/protected/Overview/UniversalObjectCRUD'

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

const getOverview = (dimensie: keyof typeof allDimensies) => (
    <ProtectedRoute
        redirectTo="/muteer/dashboard"
        roles={
            dimensie === 'BELEIDSMODULES'
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
                allDimensies[dimensie] as filteredDimensieConstants
            }
        />
    </ProtectedRoute>
)

const getChildren = (dimensie: keyof typeof allDimensies) => [
    {
        path: 'nieuw',
        element: (
            <UniversalObjectCRUD
                dimensieConstants={
                    allDimensies[dimensie] as filteredDimensieConstants
                }
            />
        ),
    },
    {
        path: ':single',
        children: [
            ...(((dimensie === 'MAATREGELEN' ||
                dimensie === 'BELEIDSKEUZES') && [
                {
                    index: true,
                    element: (
                        <Detail dimensieConstants={allDimensies[dimensie]} />
                    ),
                },
            ]) ||
                (dimensie === 'BELEIDSMODULES' && [
                    {
                        index: true,
                        element: <BeleidsmodulesOverview />,
                    },
                ]) ||
                []),
            {
                path: 'bewerk',
                element: (
                    <UniversalObjectCRUD
                        dimensieConstants={
                            allDimensies[dimensie] as filteredDimensieConstants
                        }
                    />
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
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        element: (
            <VerordeningenstructuurOverzicht
                dataModel={allDimensies.VERORDENINGSTRUCTUUR}
            />
        ),
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
