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
import ProtectedRoute from '@/App/Routes/ProtectedRoute'
import allDimensies, { filteredDimensieConstants } from '@/constants/dimensies'
import {
    BeleidsmodulesOverview,
    Beleidsrelaties,
    BeleidsrelatiesCRUD,
    Detail,
    Overview,
} from '@/pages/protected'
import UniversalObjectCRUD from '@/pages/protected/Overview/UniversalObjectCRUD'

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
        dataEndpoint: getAmbitiesLineageid,
        dataVersionEndpoint: getVersionAmbitiesObjectuuid,
        dataValidEndpoint: getValidAmbities,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
        element: getOverview('BELEIDSREGELS'),
        children: getChildren('BELEIDSREGELS'),
        isPublic: true,
        dataEndpoint: getBeleidsregelsLineageid,
        dataVersionEndpoint: getVersionBeleidsregelsObjectuuid,
        dataValidEndpoint: getValidBeleidsregels,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
        element: getOverview('BELANGEN'),
        children: getChildren('BELANGEN'),
        isPublic: true,
        dataEndpoint: getBelangenLineageid,
        dataVersionEndpoint: getVersionBelangenObjectuuid,
        dataValidEndpoint: getValidBelangen,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
        element: getOverview('MAATREGELEN'),
        children: getChildren('MAATREGELEN'),
        isPublic: true,
        dataEndpoint: getMaatregelenLineageid,
        dataVersionEndpoint: getVersionMaatregelenObjectuuid,
        dataValidEndpoint: getValidMaatregelen,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSKEUZES,
        element: getOverview('BELEIDSKEUZES'),
        children: getChildren('BELEIDSKEUZES'),
        isPublic: true,
        dataEndpoint: getBeleidskeuzesLineageid,
        dataVersionEndpoint: getVersionBeleidskeuzesObjectuuid,
        dataValidEndpoint: getValidBeleidskeuzes,
    },
    {
        slug: 'beleidsprestaties',
        dataModel: allDimensies.BELEIDSPRESTATIES,
        element: getOverview('BELEIDSPRESTATIES'),
        children: getChildren('BELEIDSPRESTATIES'),
        isPublic: true,
        dataEndpoint: getBeleidsprestatiesLineageid,
        dataVersionEndpoint: getVersionBeleidsprestatiesObjectuuid,
        dataValidEndpoint: getValidBeleidsprestaties,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
        element: getOverview('THEMAS'),
        children: getChildren('THEMAS'),
        isPublic: true,
        dataEndpoint: getThemasLineageid,
        dataVersionEndpoint: getVersionThemasObjectuuid,
        dataValidEndpoint: getValidThemas,
    },
    {
        slug: 'beleidsdoelen',
        dataModel: allDimensies.BELEIDSDOELEN,
        element: getOverview('BELEIDSDOELEN'),
        children: getChildren('BELEIDSDOELEN'),
        isPublic: true,
        dataEndpoint: getBeleidsdoelenLineageid,
        dataVersionEndpoint: getVersionBeleidsdoelenObjectuuid,
        dataValidEndpoint: getValidBeleidsdoelen,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        element: getOverview('VERORDENINGSTRUCTUUR'),
        isPublic: true,
        dataEndpoint: getVerordeningenLineageid,
        dataVersionEndpoint: getVersionVerordeningenObjectuuid,
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
