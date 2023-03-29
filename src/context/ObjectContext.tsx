import {
    QueryKey,
    QueryObserverBaseResult,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query'
import { createContext, ReactNode, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { HTTPValidationError, ResponseOK } from '@/api/fetchers.schemas'
import {
    Model,
    ModelPatchStaticType,
    ModelReturnType,
} from '@/config/objects/types'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectContextType extends QueryObserverBaseResult<ModelReturnType> {
    queryKey: QueryKey
    usePostObjectStatic: (onSucces?: () => void) => UseMutationResult<
        ResponseOK,
        HTTPValidationError,
        {
            lineageId: number
            data: ModelPatchStaticType
        },
        unknown
    >
}

export const ObjectContext = createContext<ObjectContextType>(null!)

function ObjectProvider({
    model,
    children,
}: {
    model: Model
    children: ReactNode
}) {
    const queryClient = useQueryClient()

    const { moduleId, objectId } = useParams()

    const { useGetLatestLineage, useGetLatestLineageInModule, usePostStatic } =
        model.fetchers

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

    const usePostObjectStatic = (onSucces?: () => void) =>
        usePostStatic({
            mutation: {
                onError: () => {
                    toastNotification({ type: 'standard error' })
                },
                onSuccess: () => {
                    queryClient.invalidateQueries(data.queryKey).then(onSucces)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    const value = {
        ...data,
        usePostObjectStatic,
    }

    return (
        <ObjectContext.Provider value={value}>
            {children}
        </ObjectContext.Provider>
    )
}

export default ObjectProvider
