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
import useAuth from '@/hooks/useAuth'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectContextType extends QueryObserverBaseResult<ModelReturnType> {
    /** Querykey */
    queryKey: QueryKey
    /** Can be used to patch the object */
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
    /** Can be used to patch the static data of object */
    usePostObjectStatic: (onSucces?: () => void) => UseMutationResult<
        ResponseOK,
        HTTPValidationError,
        {
            lineageId: number
            data: ModelPatchStaticType
        },
        unknown
    >
    /** Is user owner of object */
    isOwner?: boolean
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
    const { user } = useAuth()

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
    const latest = useGetLatestLineage!<ModelReturnType>(parseInt(objectId!), {
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
                    queryClient
                        .invalidateQueries(data?.queryKey)
                        .then(onSuccess)

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
                    queryClient
                        .invalidateQueries(data?.queryKey)
                        .then(onSuccess)

                    toastNotification('saved')
                },
            },
        })

    /**
     * Check if logged in user is owner of object
     */
    const isOwner = useMemo(
        () =>
            data?.data?.ObjectStatics?.Owner_1?.UUID === user?.UUID ||
            data?.data?.ObjectStatics?.Owner_2?.UUID === user?.UUID,
        [
            user?.UUID,
            data?.data?.ObjectStatics?.Owner_1?.UUID,
            data?.data?.ObjectStatics?.Owner_2?.UUID,
        ]
    )

    const value = {
        ...data,
        usePatchObject,
        usePostObjectStatic,
        isOwner,
    }

    return (
        <ObjectContext.Provider value={value}>
            {children || <Outlet />}
        </ObjectContext.Provider>
    )
}

export default ObjectProvider
