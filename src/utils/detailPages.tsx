import {
    readAmbitieLineage,
    readBelangLineage,
    readBeleidsdoelLineage,
    readBeleidskeuzeLineage,
    readBeleidsprestatieLineage,
    readBeleidsregelLineage,
    readMaatregelLineage,
    readThemaLineage,
    readVerordeningLineage,
    readGebiedsprogrammas,
    readAmbitieVersion,
    readBelangVersion,
    readBeleidsdoelVersion,
    readBeleidskeuzeVersion,
    readBeleidsprestatieVersion,
    readBeleidsregelVersion,
    readMaatregelVersion,
    readThemaVersion,
    readVerordeningVersion,
    readGebiedsprogrammaVersion,
    readValidAmbities,
    readValidBeleidsregels,
    readValidBelangen,
    readValidMaatregelen,
    readValidBeleidskeuzes,
    readValidBeleidsprestaties,
    readValidThemas,
    readValidBeleidsdoelen,
    readValidVerordening,
    readValidGebiedsprogrammas,
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
    | typeof readAmbitieLineage
    | typeof readBeleidsregelLineage
    | typeof readBelangLineage
    | typeof readMaatregelLineage
    | typeof readBeleidskeuzeLineage
    | typeof readBeleidsprestatieLineage
    | typeof readThemaLineage
    | typeof readBeleidsdoelLineage
    | typeof readVerordeningLineage
    | typeof readGebiedsprogrammas

export type DetailPageVersionEndpoint =
    | typeof readAmbitieVersion
    | typeof readBelangVersion
    | typeof readBeleidsregelVersion
    | typeof readMaatregelVersion
    | typeof readBeleidskeuzeVersion
    | typeof readBeleidsprestatieVersion
    | typeof readThemaVersion
    | typeof readBeleidsdoelVersion
    | typeof readVerordeningVersion
    | typeof readGebiedsprogrammaVersion

export type DetailPageValidEndpoint =
    | typeof readValidAmbities
    | typeof readValidBeleidsregels
    | typeof readValidBelangen
    | typeof readValidMaatregelen
    | typeof readValidBeleidskeuzes
    | typeof readValidBeleidsprestaties
    | typeof readValidThemas
    | typeof readValidBeleidsdoelen
    | typeof readValidVerordening
    | typeof readValidGebiedsprogrammas

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
        dataEndpoint: readAmbitieLineage,
        dataVersionEndpoint: readAmbitieVersion,
        dataValidEndpoint: readValidAmbities,
    },
    {
        slug: 'beleidsregels',
        dataModel: allDimensies.BELEIDSREGELS,
        element: getOverview('BELEIDSREGELS'),
        children: getChildren('BELEIDSREGELS'),
        isPublic: true,
        dataEndpoint: readBeleidsregelLineage,
        dataVersionEndpoint: readBeleidsregelVersion,
        dataValidEndpoint: readValidBeleidsregels,
    },
    {
        slug: 'belangen',
        dataModel: allDimensies.BELANGEN,
        element: getOverview('BELANGEN'),
        children: getChildren('BELANGEN'),
        isPublic: true,
        dataEndpoint: readBelangLineage,
        dataVersionEndpoint: readBelangVersion,
        dataValidEndpoint: readValidBelangen,
    },
    {
        slug: 'maatregelen',
        dataModel: allDimensies.MAATREGELEN,
        element: getOverview('MAATREGELEN'),
        children: getChildren('MAATREGELEN'),
        isPublic: true,
        dataEndpoint: readMaatregelLineage,
        dataVersionEndpoint: readMaatregelVersion,
        dataValidEndpoint: readValidMaatregelen,
    },
    {
        slug: 'beleidskeuzes',
        dataModel: allDimensies.BELEIDSKEUZES,
        element: getOverview('BELEIDSKEUZES'),
        children: getChildren('BELEIDSKEUZES'),
        isPublic: true,
        dataEndpoint: readBeleidskeuzeLineage,
        dataVersionEndpoint: readBeleidskeuzeVersion,
        dataValidEndpoint: readValidBeleidskeuzes,
    },
    {
        slug: 'beleidsprestaties',
        dataModel: allDimensies.BELEIDSPRESTATIES,
        element: getOverview('BELEIDSPRESTATIES'),
        children: getChildren('BELEIDSPRESTATIES'),
        isPublic: true,
        dataEndpoint: readBeleidsprestatieLineage,
        dataVersionEndpoint: readBeleidsprestatieVersion,
        dataValidEndpoint: readValidBeleidsprestaties,
    },
    {
        slug: 'themas',
        dataModel: allDimensies.THEMAS,
        element: getOverview('THEMAS'),
        children: getChildren('THEMAS'),
        isPublic: true,
        dataEndpoint: readThemaLineage,
        dataVersionEndpoint: readThemaVersion,
        dataValidEndpoint: readValidThemas,
    },
    {
        slug: 'beleidsdoelen',
        dataModel: allDimensies.BELEIDSDOELEN,
        element: getOverview('BELEIDSDOELEN'),
        children: getChildren('BELEIDSDOELEN'),
        isPublic: true,
        dataEndpoint: readBeleidsdoelLineage,
        dataVersionEndpoint: readBeleidsdoelVersion,
        dataValidEndpoint: readValidBeleidsdoelen,
    },
    {
        slug: 'gebiedsprogrammas',
        dataModel: allDimensies.GEBIEDSPROGRAMMAS,
        element: getOverview('GEBIEDSPROGRAMMAS'),
        children: getChildren('GEBIEDSPROGRAMMAS'),
        isPublic: true,
        dataEndpoint: readGebiedsprogrammas,
        dataVersionEndpoint: readGebiedsprogrammaVersion,
        dataValidEndpoint: readValidGebiedsprogrammas,
    },
    {
        slug: 'verordeningen',
        dataModel: allDimensies.VERORDENINGSARTIKEL,
        element: getOverview('VERORDENINGSTRUCTUUR'),
        isPublic: true,
        dataEndpoint: readVerordeningLineage,
        dataVersionEndpoint: readVerordeningVersion,
        dataValidEndpoint: readValidVerordening,
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
