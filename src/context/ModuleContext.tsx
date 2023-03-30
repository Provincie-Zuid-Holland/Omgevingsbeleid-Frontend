import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { createContext, useMemo } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
    getModulesGetQueryKey,
    getModulesModuleIdGetQueryKey,
    useModulesModuleIdClosePost,
    useModulesModuleIdGet,
    useModulesModuleIdPost,
    useModulesModuleIdRemoveObjectTypeLineageIdDelete,
} from '@/api/fetchers'
import {
    HTTPValidationError,
    ModuleEdit,
    ModuleOverview,
    ResponseOK,
} from '@/api/fetchers.schemas'
import useAuth from '@/hooks/useAuth'
import { toastNotification } from '@/utils/toastNotification'

interface ModuleContextType {
    /** Data of the module */
    data?: ModuleOverview
    /** Is module data loading */
    isLoading: boolean
    /** Can be used to edit the module */
    useEditModule: (onSucces?: () => void) => UseMutationResult<
        ResponseOK,
        HTTPValidationError,
        {
            moduleId: number
            data: ModuleEdit
        },
        unknown
    >
    /** Can be used to close the module (unsuccessful) */
    useCloseModule: (onSucces?: () => void) => UseMutationResult<
        ResponseOK,
        HTTPValidationError,
        {
            moduleId: number
        },
        unknown
    >
    /** Can be used to remove an object from the module */
    useRemoveObjectFromModule: (onSucces?: () => void) => UseMutationResult<
        ResponseOK,
        HTTPValidationError,
        {
            moduleId: number
            objectType: string
            lineageId: number
        },
        unknown
    >
    /** Is logged in user a manager of the module */
    isModuleManager: boolean
    /** Is module locked */
    isLocked: boolean
}

export const ModuleContext = createContext<ModuleContextType>(null!)

function ModuleProvider() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { moduleId } = useParams()
    const { user } = useAuth()

    const module = useModulesModuleIdGet(parseInt(moduleId!), {
        query: {
            enabled: !!moduleId,
            onError: () => {
                toastNotification({
                    type: 'notAllowed',
                })
                navigate('/muteer')
            },
        },
    })

    const useEditModule = (onSuccess?: () => void) =>
        useModulesModuleIdPost({
            mutation: {
                onError: () => {
                    toastNotification({ type: 'standard error' })
                },
                onSuccess: () => {
                    Promise.all([
                        queryClient.invalidateQueries(
                            getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                        ),
                        queryClient.invalidateQueries(getModulesGetQueryKey(), {
                            refetchType: 'all',
                        }),
                    ]).then(onSuccess)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    const useCloseModule = (onSuccess?: () => void) =>
        useModulesModuleIdClosePost({
            mutation: {
                onError: () => {
                    toastNotification({ type: 'standard error' })
                },
                onSuccess: () => {
                    queryClient
                        .invalidateQueries(getModulesGetQueryKey(), {
                            refetchType: 'all',
                        })
                        .then(onSuccess)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    const useRemoveObjectFromModule = (onSuccess?: () => void) =>
        useModulesModuleIdRemoveObjectTypeLineageIdDelete({
            mutation: {
                onError: () => {
                    toastNotification({ type: 'standard error' })
                },
                onSuccess: () => {
                    queryClient
                        .invalidateQueries(
                            getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                        )
                        .then(onSuccess)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    /**
     * Check if logged in user is a manager of the module
     */
    const isModuleManager = useMemo(() => {
        if (!module.data?.Module) return false

        const { Module_Manager_1_UUID, Module_Manager_2_UUID } =
            module.data.Module

        return (
            Module_Manager_1_UUID === user?.UUID ||
            Module_Manager_2_UUID === user?.UUID
        )
    }, [module.data?.Module, user?.UUID])

    const isLocked = useMemo(
        () => !!module.data?.Module.Temporary_Locked,
        [module.data?.Module]
    )

    const value = {
        ...module,
        useEditModule,
        useCloseModule,
        useRemoveObjectFromModule,
        isModuleManager,
        isLocked,
    }

    return (
        <ModuleContext.Provider value={value}>
            <Outlet />
        </ModuleContext.Provider>
    )
}

export default ModuleProvider
