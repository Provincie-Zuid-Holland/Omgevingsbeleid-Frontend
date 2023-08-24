import {
    QueryKey,
    QueryObserverBaseResult,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { createContext, ReactNode, useMemo } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
    ActiveModuleObjectWrapper,
    HTTPValidationError,
    ResponseOK,
} from '@/api/fetchers.schemas'
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
    usePatchObject: () => UseMutationResult<
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
    /** List the last modified module object grouped per module ID */
    activeModules?: ActiveModuleObjectWrapper[]
    /** Active modules loading */
    activeModulesLoading?: boolean
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
    const navigate = useNavigate()

    const { moduleId, objectId } = useParams()

    const {
        useGetLatestLineage,
        useGetLatestLineageInModule,
        usePatchObjectInModule,
        usePostStatic,
        useGetActiveModules,
    } = model.fetchers

    const latestInModule = useGetLatestLineageInModule?.<ModelReturnType>(
        parseInt(moduleId!),
        parseInt(objectId!),
        {
            query: {
                enabled: !!objectId && !!moduleId,
                onError: error => {
                    if ((error as AxiosError).response?.status === 404) {
                        navigate(`/muteer/modules/${moduleId}`)
                        toastNotification('notAllowed')
                    }
                },
            },
        }
    )
    const latest = useGetLatestLineage!<ModelReturnType>(parseInt(objectId!), {
        query: {
            enabled: !!objectId && !moduleId,
            onError: error => {
                if ((error as AxiosError).response?.status === 404) {
                    navigate('/muteer')
                    toastNotification('notAllowed')
                }
            },
        },
    })

    const { data: activeModules, isLoading: activeModulesLoading } =
        useGetActiveModules?.(
            parseInt(objectId!),
            { minimum_status: 'Ontwerp GS Concept' },
            {
                query: { enabled: !!objectId, onError: () => {} },
            }
        ) || {}

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

    const usePatchObject = () =>
        usePatchObjectInModule?.({
            mutation: {
                onSuccess: () => toastNotification('saved'),
            },
        })

    const usePostObjectStatic = (onSuccess?: () => void) =>
        usePostStatic?.({
            mutation: {
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
        activeModules,
        activeModulesLoading,
    }

    return (
        // @ts-ignore
        <ObjectContext.Provider value={value}>
            {children || <Outlet />}
        </ObjectContext.Provider>
    )
}

export default ObjectProvider
