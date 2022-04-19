import formatDate from '@/utils/formatDate'

export interface RevisionOverviewValidTextProps {
    object: any
    revisionObjects: any[]
}

const RevisionOverviewValidText = ({
    object,
    revisionObjects,
}: RevisionOverviewValidTextProps) => {
    if (!revisionObjects) return null

    revisionObjects = revisionObjects.sort(
        (a, b) =>
            (new Date(b.Begin_Geldigheid) as any) -
            (new Date(a.Begin_Geldigheid) as any)
    )

    const uiStatus = revisionObjects.find(e => e.UUID === object.UUID).uiStatus

    const getTextValidFromSince = (object: any) => {
        // Toevoegen van de datum in de revisie: "Vigerend van <datum inwerkingtreding> tot <datum uitwerkingtreding>" voor gearchiveerde beleidskeuzes.
        // Voor vigerende beleidskeuzes: "Vigerend van <datum inwerkingtreding> tot heden"
        if (!object['Begin_Geldigheid'])
            return 'Er is nog geen begin geldigheid'

        const dateStart = formatDate(
            new Date(object['Begin_Geldigheid']),
            'd MMMM yyyy'
        )
        const isCurrentlyVigerend = uiStatus && uiStatus === 'Vigerend'

        if (isCurrentlyVigerend) {
            return `Vigerend vanaf ${dateStart} tot heden`
        } else if (object.Begin_Geldigheid === '1753-01-01T00:00:00Z') {
            return `Er is geen begin geldigheid`
        } else {
            return `Vigerend vanaf ${dateStart}`
        }
    }

    const validText = getTextValidFromSince(object)

    return (
        <span className="inline-block my-3 text-base text-gray-700">
            {validText}
        </span>
    )
}

export default RevisionOverviewValidText
