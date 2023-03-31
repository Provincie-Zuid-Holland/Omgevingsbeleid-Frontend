import {
    QueryKey,
    QueryObserverBaseResult,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query'
import { createContext, ReactNode, useMemo } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import { HTTPValidationError, ResponseOK } from '@/api/fetchers.schemas'
import {
    Model,
    ModelPatchStaticType,
    ModelPatchType,
    ModelReturnType,
} from '@/config/objects/types'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectContextType extends QueryObserverBaseResult<ModelReturnType> {
    queryKey: QueryKey
    usePatchObject: (onSuccess?: () => void) => UseMutationResult<
        {
            Object_ID?: number
            UUID?: string
        },
        HTTPValidationError,
        {
            moduleId: number
            lineageId: number
            data: ModelPatchType
        },
        unknown
    >
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
    children?: ReactNode
}) {
    const queryClient = useQueryClient()

    const { moduleId, objectId } = useParams()

    const {
        useGetLatestLineage,
        useGetLatestLineageInModule,
        usePatchObjectInModule,
        usePostStatic,
    } = model.fetchers

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

    const usePatchObject = (onSuccess?: () => void) =>
        usePatchObjectInModule({
            mutation: {
                onError: () => {
                    toastNotification('error')
                },
                onSuccess: () => {
                    queryClient.invalidateQueries(data.queryKey).then(onSuccess)

                    toastNotification('saved')
                },
            },
        })

    const usePostObjectStatic = (onSuccess?: () => void) =>
        usePostStatic({
            mutation: {
                onError: () => {
                    toastNotification('error')
                },
                onSuccess: () => {
                    queryClient.invalidateQueries(data.queryKey).then(onSuccess)

                    toastNotification('saved')
                },
            },
        })

    const value = {
        ...data,
        usePatchObject,
        usePostObjectStatic,
    }

    return (
        <ObjectContext.Provider value={value}>
            {children || <Outlet />}
        </ObjectContext.Provider>
    )
}

export default ObjectProvider
