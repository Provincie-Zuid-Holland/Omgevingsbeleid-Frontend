import { SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic } from '@/api/fetchers.schemas'
import { ModelReturnTypeBasic } from '@/config/objects/types'

export interface StepProps {
    setExistingObject: (
        object?:
            | SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic
            | ModelReturnTypeBasic
    ) => void
    existingObject?:
        | SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic
        | ModelReturnTypeBasic
        | null
    title?: string
}
