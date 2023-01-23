import { QueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
    readBeleidsmodules,
    updateBeleidsmodule,
    getReadBeleidskeuzeLineageQueryKey,
    getReadMaatregelLineageQueryKey,
    getReadMaatregelenQueryKey,
    getReadBeleidskeuzesQueryKey,
} from '@/api/fetchers'
import { Maatregel, Beleidskeuze, Beleidsmodule } from '@/api/fetchers.schemas'
import handleError from '@/utils/handleError'

/**
 * Remove a policy from a module and invalidate the cache of the lineage.
 */

export const removePolicyFromModule = async (
    policy: Maatregel | Beleidskeuze,
    titleSingular: 'Maatregel' | 'Beleidskeuze' | 'Gebiedsprogramma',
    queryClient: QueryClient,
    type: 'detail' | 'overview'
) => {
    const confirm = window.confirm(
        `Weet je zeker dat je '${policy.Titel}' wil verwijderen uit de module?`
    )
    if (!confirm) return

    const allBeleidsmodules = await readBeleidsmodules().catch(err => {
        console.error(err)
        toast(process.env.REACT_APP_ERROR_MSG)
        return null
    })

    if (!allBeleidsmodules) return

    const connectionProperty =
        titleSingular === 'Maatregel' ? 'Maatregelen' : 'Beleidskeuzes'

    const modulesWithExistingConnection = allBeleidsmodules.filter(
        module =>
            (module[connectionProperty] as any[])?.filter(
                connection => connection.Object.ID === policy.ID
            ).length > 0
    )

    const generatePatchObject = (module: Beleidsmodule) => ({
        [connectionProperty]: (module[connectionProperty] as any[])
            // Filter out the object we want to remove
            ?.filter(connection => connection.Object.ID !== policy.ID)
            // Replace the .Object for a .UUID property for the API
            .map(connection => ({
                Koppeling_Omschrijving: connection.Koppeling_Omschrijving,
                UUID: connection.Object.UUID,
            })),
    })

    Promise.all(
        modulesWithExistingConnection.map((module: Beleidsmodule) =>
            updateBeleidsmodule(module.ID!, generatePatchObject(module))
        )
    )
        .then(res => {
            const isDetailPage = type === 'detail'
            const queryKey =
                titleSingular.toLowerCase() === 'Beleidskeuze' && isDetailPage
                    ? getReadBeleidskeuzeLineageQueryKey(policy.ID!)
                    : titleSingular === 'Maatregel' && isDetailPage
                    ? getReadMaatregelLineageQueryKey(policy.ID!)
                    : titleSingular === 'Maatregel' && !isDetailPage
                    ? getReadMaatregelenQueryKey()
                    : titleSingular === 'Beleidskeuze' && !isDetailPage
                    ? getReadBeleidskeuzesQueryKey()
                    : ['']

            queryClient.invalidateQueries(queryKey)

            toast(`${titleSingular} verwijderd uit module`)
        })
        .catch(err => handleError(err))
}
