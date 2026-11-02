import { formatDate } from '@pzh-ui/components'

import { NextObjectVersion } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'

import { parseUtc } from './parseUtc'

interface Props {
    id?: string
    start_validity?: string | null
    end_validity?: string | null
    next_version?: NextObjectVersion | null
    isRevision?: boolean
    revisions?: ModelReturnType[]
    withPrefix?: boolean
}

export const formatValidityDate = ({
    id,
    start_validity,
    end_validity,
    next_version,
    isRevision,
    revisions,
    withPrefix = true,
}: Props) => {
    const today = new Date()
    const startDate = start_validity ? parseUtc(start_validity) : null
    const endDate = end_validity ? parseUtc(end_validity) : null
    const nextStartDate = next_version?.start_validity
        ? parseUtc(next_version.start_validity)
        : null

    if (!startDate || isRevision) {
        return 'Nog niet geldig, versie in bewerking'
    }

    const isCurrentlyValid = today > startDate && (!endDate || today <= endDate)
    const hasNextVersionStarted = nextStartDate && today > nextStartDate

    if (isCurrentlyValid) {
        if (!next_version) {
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
        const currentIndex = revisions.findIndex(revision => revision.id === id)
        if (currentIndex !== -1 && currentIndex < revisions.length - 1) {
            const prevRevision = revisions[currentIndex + 1]
            const prevStartDate = prevRevision.start_validity
                ? parseUtc(prevRevision.start_validity)
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
