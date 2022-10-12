import { PolicyTitlesSingular } from '@/constants/policyObjects'

/**
 * Reset the status if the policy is currently vigerend and the user is creating a new checked out version.
 */
const setCorrectStatus = (
    obj: any,
    modus: string | null,
    titleSingular: PolicyTitlesSingular
) => {
    const hasValidStatus =
        obj &&
        'Status' in obj &&
        obj.Status === 'Vigerend' &&
        modus !== 'wijzig_vigerend'

    if (
        (hasValidStatus && titleSingular === 'maatregel') ||
        (hasValidStatus && titleSingular === 'beleidskeuze')
    ) {
        obj.Status = 'Ontwerp GS Concept'
    }

    return obj
}

export default setCorrectStatus
