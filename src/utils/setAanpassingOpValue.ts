/**
 * If the object is of type Maatregel or Beleidskeuze the user can change certain fields while the policy is valid.
 * If this is the case we want to change the Aanpassing_Op value to reference the previous UUID.
 */
const setAanpassingOpValue = (
    obj: any,
    titleSingular: string,
    modus: string | null
) => {
    if (titleSingular !== 'Beleidskeuze' && titleSingular !== 'Maatregel')
        return obj

    if (modus !== 'wijzig_vigerend') return obj

    obj.Aanpassing_Op = obj.UUID

    return obj
}

export default setAanpassingOpValue
