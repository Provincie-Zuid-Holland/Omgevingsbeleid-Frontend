import { useEffect, useState } from 'react'

import { GebruikerInline } from '@/api/fetchers.schemas'
import { MutateWriteObjects } from '@/types/dimensions'

/**
 * Function to determine if user can edit all the fields on a mutatePolicy page
 */
const useFullMutateRights = (
    user: GebruikerInline | undefined,
    initialValues: MutateWriteObjects
) => {
    const [hasFullRights, setHasFullRights] = useState(false)

    useEffect(() => {
        const userRol = user?.Rol
        const userUUID = user?.UUID
        setHasFullRights(
            userRol === 'Beheerder' ||
                userRol === 'Superuser' ||
                userRol === 'Functioneel beheerder' ||
                userRol === 'Behandelend Ambtenaar' ||
                userRol === 'Technisch beheerder' ||
                ('Eigenaar_1_UUID' in initialValues &&
                    userUUID === initialValues.Eigenaar_1_UUID) ||
                ('Eigenaar_2_UUID' in initialValues &&
                    userUUID === initialValues.Eigenaar_2_UUID)
        )
    }, [user, initialValues])

    return hasFullRights
}

export { useFullMutateRights }
