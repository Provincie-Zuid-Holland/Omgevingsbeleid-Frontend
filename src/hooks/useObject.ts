import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Model, ModelReturnType } from '@/config/objects/types'

const useObject = (model: Model) => {
    const { moduleId, objectId } = useParams()

    const { useGetLatestLineage, useGetLatestLineageInModule } = model.fetchers

    const latestInModule = useGetLatestLineageInModule<ModelReturnType>(
        parseInt(moduleId!),
        parseInt(objectId!),
        {
            query: { enabled: !!objectId && !!moduleId },
        }
    )
    const latest = useGetLatestLineage<ModelReturnType>(parseInt(objectId!), {
        query: { enabled: !!objectId && !moduleId },
    })

    /**
     * If object is still in a module return latest lineage of object in module,
     * if object is not in a module return latest valid lineage
     */
    const data = useMemo(() => {
        if (!!moduleId && !!objectId) {
            return latestInModule
        }

        return latest
    }, [moduleId, objectId, latestInModule, latest])

    return { ...data }
}

export default useObject
