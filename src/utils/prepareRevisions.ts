import { isBefore } from 'date-fns'

import { Beleidskeuze } from '@/api/fetchers.schemas'

/**
 * This function filters out revisions that we do not want to diplay in the revision timeline.
 * It also gives every object a correct status that we can display in the UI.
 * We need to do this because we never edit the history, only push upon the stack for new changes.
 * This makes it possible that there are multiple objects with a status of 'Vigerend'.
 * All the previous objects with a status of 'Vigerend' need to be assigned a UI Status of 'Archived'
 *
 * @param {array} revisions - Contains all of the revisions of the object
 * @returns {array} - Returns an array containing the revision objects
 */

export type Revisions = (Beleidskeuze & { uiStatus?: string })[]

const prepareRevisions = (revisions: Revisions) => {
    let vigerendSet = false

    const sortedAndFilteredRevisions = revisions
        .sort(
            (a, b) =>
                (new Date(b.Begin_Geldigheid!) as any) -
                (new Date(a.Begin_Geldigheid!) as any)
        )
        .filter(revision => revision.Status === 'Vigerend')

    /**
     * Filters the revisions based on the "Vigerend" status
     * @param {array} revisions - Contains the original revisions
     */
    const prepareVigerendeRevisions = (revisions: Revisions) =>
        revisions
            // Filter out policies that have been edited while the status was 'Vigerend'
            // These policies will have a value on the 'Aanpassing_Op' property
            // We only want the latest version of that specific 'Vigerend' policy
            .filter((revision, index) => {
                /**
                 * If an object with a status of vigerend is edited
                 * the UUID value is assigned to the property 'Aanpassing_Op' of the newer object.
                 */
                const indexOfPotentialNewerVersion =
                    sortedAndFilteredRevisions.findIndex(
                        e => e.Aanpassing_Op === revision.UUID
                    )

                const objectHasLaterVersion =
                    indexOfPotentialNewerVersion !== -1

                /** This revision contains a newer version, so we filter it out */
                if (objectHasLaterVersion) return false

                /** If there is a later edited version we want  */
                // Check if this revision has an 'Aanpassing_Op' value
                // and if there is another object in revisions that has the same 'Aanpassing_Op' value, but earlier in the array
                // indicating that there is a later version of this 'vigerend' object
                const indexOfLastEdited = sortedAndFilteredRevisions.findIndex(
                    e => e.Aanpassing_Op === revision.Aanpassing_Op
                )

                const editedWithLaterVersion =
                    revision.Aanpassing_Op &&
                    index !== indexOfLastEdited &&
                    indexOfLastEdited !== -1

                if (editedWithLaterVersion) return false

                return true
            })
            .map(revision => {
                const beginGeldigheid = new Date(
                    revision.Begin_Geldigheid || ''
                )
                const currentDate = new Date()

                const willTurnValidInTheFuture = isBefore(
                    currentDate,
                    beginGeldigheid
                )

                if (willTurnValidInTheFuture) {
                    revision.uiStatus = 'Toekomstig Vigerend'
                } else if (!vigerendSet) {
                    // If it is the first item with a Status of 'Vigerend'
                    revision.uiStatus = 'Vigerend'
                    vigerendSet = true
                } else {
                    revision.uiStatus = 'Gearchiveerd'
                }

                return revision
            })

    /**
     * Checks if there is an revision object with 'Ontwerp in inspraak' which satisfies:
     * - Is the last version of the checked out status
     * - Comes after the last revision object with a status of 'Vigerend' and a 'Aanpassing_Op' value of null
     * @param {array} preppedRevisions - Contains the result of prepareVigerendeRevisions()
     * @param {array} revisions - Contains the original revisions
     */
    const prepareOntwerpInInspraakRevisions = (
        preppedRevisions: Revisions,
        revisions: Revisions
    ) => {
        const firstInspraakIndex = revisions.findIndex(
            revision => revision.Status === 'Ontwerp in inspraak'
        )

        const firstVigerendIndex = revisions.findIndex(
            revision =>
                revision.Status === 'Vigerend' &&
                revision.Aanpassing_Op === null
        )

        // If one of the items doesn't exist, return
        if (firstInspraakIndex === -1 || firstVigerendIndex === -1)
            return preppedRevisions

        const inspraakComesAfterVigerend =
            firstInspraakIndex < firstVigerendIndex

        const checkIfInspraakInOntwerpIsLastCheckedOutItem = (
            revisions: Revisions
        ) => {
            if (firstInspraakIndex === 0) return true

            // If the firstInspraakIndex is greater then 0 we need to check if the items that come before it have a status of 'Vigerend'

            // Generate an array containing the index from 0 to the index before the firstInspraakIndex
            const indexesToCheck = Array.from(
                { length: firstInspraakIndex - 1 },
                (v, k) => k + 1
            )
            indexesToCheck.unshift(0)

            const inspraakInOntwerpIsLastCheckedOutItem = indexesToCheck.every(
                index => revisions[index].Status === 'Vigerend'
            )

            return inspraakInOntwerpIsLastCheckedOutItem
        }

        const inspraakIsLastItem =
            checkIfInspraakInOntwerpIsLastCheckedOutItem(revisions)

        // Check if the item with a Status 'Ontwerp in inspraak' is newer,
        // then the last item with a Status of 'Vigerend'
        // If so, place this item on index 0
        if (inspraakComesAfterVigerend && inspraakIsLastItem) {
            const firstInspraakItem = revisions[firstInspraakIndex]
            firstInspraakItem.uiStatus = 'Ter inzage'
            preppedRevisions.splice(0, 0, firstInspraakItem)
        }

        return preppedRevisions
    }

    const preppedVigerendeRevisions = prepareVigerendeRevisions(
        sortedAndFilteredRevisions
    )

    const preppedRevisions = prepareOntwerpInInspraakRevisions(
        preppedVigerendeRevisions,
        revisions
    )

    return preppedRevisions
}

export { prepareRevisions }
