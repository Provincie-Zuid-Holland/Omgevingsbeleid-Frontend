import {
    AmbitiesRead,
    BelangenRead,
    BeleidsdoelenRead,
    BeleidskeuzesRead,
    BeleidsmodulesRead,
    BeleidsprestatiesRead,
    BeleidsregelsRead,
    MaatregelenRead,
    ThemasRead,
} from '@/api/fetchers.schemas'

export const getLatestObjectFromLineage = (
    lineage: Array<
        | AmbitiesRead
        | BelangenRead
        | BeleidsdoelenRead
        | BeleidskeuzesRead
        | BeleidsmodulesRead
        | BeleidsprestatiesRead
        | BeleidsregelsRead
        | MaatregelenRead
        | ThemasRead
    >,
    titleSingular: string,
    modus: string | null
) => {
    const isMaatregelOrBeleidskeuze =
        titleSingular === 'Beleidskeuze' || titleSingular === 'Maatregel'

    const isWijzigVigerendOrOntwerpMaken =
        (modus && modus === 'wijzig_vigerend') ||
        (modus && modus === 'ontwerp_maken')

    if (isWijzigVigerendOrOntwerpMaken) {
        return lineage.find(e => 'Status' in e && e.Status === 'Vigerend')
    } else if (isMaatregelOrBeleidskeuze) {
        return lineage.find(
            e => 'Aanpassing_Op' in e && e.Aanpassing_Op === null
        )
    } else {
        return lineage[0]
    }
}
