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
import { PolicyTitlesSingular } from '@/constants/policyObjects'

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
    titleSingular: PolicyTitlesSingular,
    modus: string | null
) => {
    const isMaatregelOrBeleidskeuze =
        titleSingular === 'beleidskeuze' || titleSingular === 'maatregel'

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