import { NextObjectVersion } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'
import { formatDate } from '@pzh-ui/components'

interface Props {
    UUID?: string
    Start_Validity?: string | null
    End_Validity?: string | null
    Next_Version?: NextObjectVersion | null
    isRevision?: boolean
    revisions?: ModelReturnType[]
    withPrefix?: boolean
}

export const formatValidityDate = ({
    UUID,
    Start_Validity,
    End_Validity,
    Next_Version,
    isRevision,
    revisions,
    withPrefix = true,
}: Props) => {
    const today = new Date()
    const startDate = Start_Validity ? new Date(Start_Validity) : null
    const endDate = End_Validity ? new Date(End_Validity) : null
    const nextStartDate = Next_Version?.Start_Validity
        ? new Date(Next_Version.Start_Validity)
        : null

    if (!startDate || isRevision) {
        return 'Nog niet geldig, versie in bewerking'
    }

    const isCurrentlyValid = today > startDate && (!endDate || today <= endDate)
    const hasNextVersionStarted = nextStartDate && today > nextStartDate

    if (isCurrentlyValid) {
        if (!Next_Version) {
            return `${withPrefix ? 'Geldend van ' : ''}${formatDate(
                startDate,
                'dd-MM-yyyy'
            )} t/m heden`
        }
        if (hasNextVersionStarted) {
            return `${withPrefix ? 'Geldend van ' : ''}${formatDate(
                startDate,
                'dd-MM-yyyy'
            )} tot ${formatDate(nextStartDate, 'dd-MM-yyyy')}`
        }
    }

    if (endDate && revisions?.length) {
        const currentIndex = revisions.findIndex(
            revision => revision.UUID === UUID
        )
        if (currentIndex !== -1 && currentIndex < revisions.length - 1) {
            const prevRevision = revisions[currentIndex + 1]
            const prevStartDate = prevRevision.Start_Validity
                ? new Date(prevRevision.Start_Validity)
                : null

            if (prevStartDate) {
                return `${withPrefix ? 'Geldend van ' : ''}${formatDate(
                    prevStartDate,
                    'dd-MM-yyyy'
                )} t/m ${formatDate(endDate, 'dd-MM-yyyy')}`
            }
        }
    }
}
