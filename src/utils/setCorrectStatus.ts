/**
 * Reset the status if the policy is currently vigerend and the user is creating a new checked out version.
 */
const setCorrectStatus = (obj: any, modus: string | null) => {
    if (
        'Status' in obj &&
        obj.Status === 'Vigerend' &&
        modus !== 'wijzig_vigerend'
    ) {
        obj.Status = 'Ontwerp GS Concept'
    }

    return obj
}

export default setCorrectStatus
