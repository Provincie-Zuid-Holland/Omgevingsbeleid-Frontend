/**
 * Function to (possibly) update the status.
 */
const setCorrectStatus = (obj: any, modus: string | null) => {
    /** The modus equals 'wijzig_vigerend' when the user is editing a valid policy and doesn't want to check out a new version */
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
