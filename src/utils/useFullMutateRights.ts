import { useEffect, useState } from 'react'

import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'
import { MutateWriteObjects } from '@/types/dimensions'

/**
 * Function to determine if user can edit all the fields on a mutatePolicy page
 */
const useFullMutateRights = (
    user: GetTokeninfo200Identifier | undefined,
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
                ('Eigenaar_1' in initialValues &&
                    userUUID === initialValues.Eigenaar_1) ||
                ('Eigenaar_2' in initialValues &&
                    userUUID === initialValues.Eigenaar_2)
        )
    }, [user, initialValues])

    return hasFullRights
}

export { useFullMutateRights }
