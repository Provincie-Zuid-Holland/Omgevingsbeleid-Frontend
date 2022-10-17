import { QueryClient } from 'react-query'
import { toast } from 'react-toastify'

import {
    getBeleidsmodules,
    patchBeleidsmodulesLineageid,
    getGetBeleidskeuzesLineageidQueryKey,
    getGetMaatregelenLineageidQueryKey,
    getGetMaatregelenQueryKey,
    getGetBeleidskeuzesQueryKey,
} from '@/api/fetchers'
import {
    MaatregelenRead,
    BeleidskeuzesRead,
    BeleidsmodulesRead,
} from '@/api/fetchers.schemas'
import handleError from '@/utils/handleError'

/**
 * Remove a policy from a module and invalidate the cache of the lineage.
 */

export const removePolicyFromModule = async (
    policy: MaatregelenRead | BeleidskeuzesRead,
    titleSingular: 'Maatregel' | 'Beleidskeuze',
    queryClient: QueryClient,
    type: 'detail' | 'overview'
) => {
    const confirm = window.confirm(
        `Weet je zeker dat je '${policy.Titel}' wil verwijderen uit de module?`
    )
    if (!confirm) return

    const allBeleidsmodules = await getBeleidsmodules().catch(err => {
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

    const generatePatchObject = (module: BeleidsmodulesRead) => ({
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
        modulesWithExistingConnection.map((module: BeleidsmodulesRead) =>
            patchBeleidsmodulesLineageid(
                module.ID!,
                generatePatchObject(module)
            )
        )
    )
        .then(res => {
            const isDetailPage = type === 'detail'
            const queryKey =
                titleSingular.toLowerCase() === 'Beleidskeuze' && isDetailPage
                    ? getGetBeleidskeuzesLineageidQueryKey(policy.ID!)
                    : titleSingular === 'Maatregel' && isDetailPage
                    ? getGetMaatregelenLineageidQueryKey(policy.ID!)
                    : titleSingular === 'Maatregel' && !isDetailPage
                    ? getGetMaatregelenQueryKey()
                    : titleSingular === 'Beleidskeuze' && !isDetailPage
                    ? getGetBeleidskeuzesQueryKey()
                    : ''

            queryClient.invalidateQueries(queryKey)

            toast(`${titleSingular} verwijderd uit module`)
        })
        .catch(err => handleError(err))
}
