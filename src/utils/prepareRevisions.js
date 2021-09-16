// REFACTOR into a custom hook
// Because the history is intact, every past revision object that has been 'vigerend'
// still has that status. In this function we calculate a status to display in the UI,
// based on the revision history. We also filter out object that have been edited while 'vigerend',
// To display only the latest object. We do this based on the property 'Aanpassing_Op'
const prepareRevisions = (revisions) => {
    const sortedFilteredRevisions = revisions
        .sort((a, b) => new Date(b.Modified_Date) - new Date(a.Modified_Date))
        .filter((revision) => revision.Status === "Vigerend")

    // Give each object a uiStatus
    // We need this because the first object with a status of Vigerend is the current one, which is still 'Vigerend'
    // But the older objects with a status 'Vigerend', are actually archived
    // They keep their 'Vigerend' status, because we don't change the history in our dataModel
    // So after the first object with a status of 'Vigerend', we want to display a status of 'Archived' in the UI
    const preppedRevisions = sortedFilteredRevisions
        .filter((revision, index) => {
            const objectHasLaterVersion = sortedFilteredRevisions.findIndex(
                (e) => e.Aanpassing_Op === revision.UUID
            )
            if (objectHasLaterVersion !== -1) return false
            // if (revision.Aanpassing_Op === null) return true

            // Check if this revision has an 'Aanpassing_Op' value
            // and if there is another object in revisions that has the same 'Aanpassing_Op' value, but earlier in the array
            // indicating that there is a later version of this 'vigerend' object
            const indexOfLastEdited = sortedFilteredRevisions.findIndex(
                (e) => e.Aanpassing_Op === revision.Aanpassing_Op
            )

            const editedWithLaterVersion =
                revision.Aanpassing_Op &&
                index !== indexOfLastEdited &&
                indexOfLastEdited !== -1

            if (editedWithLaterVersion) return false

            return true
        })
        .map((revision, index) => {
            if (index === 0) {
                // If it is the first item with a Status of 'Vigerend'
                revision.uiStatus = "Vigerend"
            } else {
                revision.uiStatus = "Gearchiveerd"
            }

            return revision
        })

    const firstInspraakIndex = sortedFilteredRevisions.findIndex(
        (revision) => revision.Status === "Ontwerp in inspraak"
    )

    const firstVigerendIndex = sortedFilteredRevisions.findIndex(
        (revision) => revision.Status === "Vigerend"
    )

    // If one of the items doesn't exist, return
    if (firstInspraakIndex === -1 || firstVigerendIndex === -1)
        return preppedRevisions

    const inspraakComesBeforeVigerend = firstInspraakIndex < firstVigerendIndex

    // Check if the item with a Status 'Ontwerp in inspraak' is newer,
    // then the last item with a Status of 'Vigerend'
    // If so, place this item on index 0
    if (inspraakComesBeforeVigerend) {
        const firstInspraakItem = sortedFilteredRevisions[firstInspraakIndex]
        firstInspraakItem.uiStatus = "In inspraak"
        preppedRevisions.splice(0, 0, firstInspraakItem)
    }

    return preppedRevisions
}

export { prepareRevisions }
