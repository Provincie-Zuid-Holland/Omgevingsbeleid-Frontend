import { Heading } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import { ObjectListAllLatestResponseUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

const ObjectCard = ({
    object_type,
    model: _model,
}: ObjectListAllLatestResponseUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic) => {
    const model = models[object_type as ModelType]
    const { plural } = model.defaults

    return (
        <li data-testid="object-card">
            <Link
                to={`/muteer/${plural}/${_model.object_id}`}
                className="group flex items-center justify-between border-b border-b-pzh-gray-300 py-4 pr-1">
                <Heading level="4" size="s">
                    {_model.title}
                </Heading>
                <div className="transition group-hover:translate-x-1">
                    <AngleRight size={20} />
                </div>
            </Link>
        </li>
    )
}

export default ObjectCard
