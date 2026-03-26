import { Heading } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import { ObjectListAllLatestResponseUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

const ObjectCard = ({
    Object_Type,
    Model,
}: ObjectListAllLatestResponseUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic) => {
    const model = models[Object_Type as ModelType]
    const { plural } = model.defaults

    return (
        <li data-testid="object-card">
            <Link
                to={`/muteer/${plural}/${Model.Object_ID}`}
                className="group border-b-pzh-gray-300 flex items-center justify-between border-b py-4 pr-1">
                <Heading level="4" size="s">
                    {Model.Title}
                </Heading>
                <div className="transition group-hover:translate-x-1">
                    <AngleRight size={20} />
                </div>
            </Link>
        </li>
    )
}

export default ObjectCard
