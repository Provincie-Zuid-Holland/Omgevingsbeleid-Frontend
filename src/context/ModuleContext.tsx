import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { createContext, useMemo } from 'react'
import { Outlet, useParams } from 'react-router-dom'

import {
    getModulesGetQueryKey,
    getModulesModuleIdGetQueryKey,
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
    data?: ModuleOverview
    useEditModule: (onSucces?: () => void) => UseMutationResult<
        ResponseOK,
        HTTPValidationError,
        {
            moduleId: number
            data: ModuleEdit
        },
        unknown
    >
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
    isModuleManager: boolean
}

export const ModuleContext = createContext<ModuleContextType>(null!)

function ModuleProvider() {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()
    const { user } = useAuth()

    const module = useModulesModuleIdGet(parseInt(moduleId!), {
        query: { enabled: !!moduleId },
    })

    const useEditModule = (onSucces?: () => void) =>
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
                    ]).then(onSucces)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    const useRemoveObjectFromModule = (onSucces?: () => void) =>
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
                        .then(onSucces)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    const isModuleManager = useMemo(() => {
        if (!module.data?.Module) return false

        const { Module_Manager_1_UUID, Module_Manager_2_UUID } =
            module.data.Module

        return (
            Module_Manager_1_UUID === user?.UUID ||
            Module_Manager_2_UUID === user?.UUID
        )
    }, [module.data?.Module, user?.UUID])

    const value = {
        ...module,
        useEditModule,
        useRemoveObjectFromModule,
        isModuleManager,
    }

    return (
        <ModuleContext.Provider value={value}>
            <Outlet />
        </ModuleContext.Provider>
    )
}

export default ModuleProvider
