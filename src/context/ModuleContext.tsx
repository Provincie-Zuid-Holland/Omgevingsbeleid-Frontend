import { createContext, ReactNode, useEffect, useMemo } from 'react'

import {
    QueryKey,
    UseMutationResult,
    useQueryClient,
} from '@tanstack/react-query'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import {
    getModulesGetListModuleObjectsQueryKey,
    getModulesGetListModulesQueryKey,
    getModulesViewModuleOverviewQueryKey,
    useModulesPostCloseModule,
    useModulesPostEditModule,
    useModulesPostModuleRemoveObject,
    useModulesViewModuleOverview,
} from '@/api/fetchers'
import {
    HTTPValidationError,
    ModuleEdit,
    ModuleOverviewResponse,
    ResponseOK,
} from '@/api/fetchers.schemas'
import { ToastType } from '@/config/notifications'
import useAuth from '@/hooks/useAuth'
import { toastNotification } from '@/utils/toastNotification'

interface ModuleContextType {
    /** Data of the module */
    data?: ModuleOverviewResponse
    /** Is module data loading */
    isLoading: boolean
    /** Can be used to edit the module */
    useEditModule: (
        toastType?: ToastType,
        onSucces?: () => void
    ) => UseMutationResult<
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
    /** Is module activated */
    isActive: boolean
    /** Is module locked */
    isLocked: boolean
    /** Is module closed */
    isClosed: boolean
    /** Can module be completed */
    canComplete: boolean
    /** Querykey */
    queryKey: QueryKey
}

export const ModuleContext = createContext<ModuleContextType>(null!)

function ModuleProvider({ children }: { children?: ReactNode }) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { moduleId } = useParams()
    const { user } = useAuth()

    const module = useModulesViewModuleOverview(parseInt(moduleId!), {
        query: {
            enabled: !!moduleId,
        },
    })

    const useEditModule = (
        toastType = 'moduleEdit' as ToastType,
        onSuccess?: () => void
    ) =>
        useModulesPostEditModule({
            mutation: {
                onSuccess: () => {
                    Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: getModulesViewModuleOverviewQueryKey(
                                parseInt(moduleId!)
                            ),
                        }),
                        queryClient.invalidateQueries({
                            queryKey: getModulesGetListModulesQueryKey(),
                            refetchType: 'all',
                        }),
                    ]).then(onSuccess)

                    toastNotification(toastType)
                },
            },
        })

    const useCloseModule = (onSuccess?: () => void) =>
        useModulesPostCloseModule({
            mutation: {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries({
                            queryKey: getModulesGetListModulesQueryKey(),
                            refetchType: 'all',
                        })
                        .then(onSuccess)

                    toastNotification('moduleClosed')
                },
            },
        })

    const useRemoveObjectFromModule = (onSuccess?: () => void) =>
        useModulesPostModuleRemoveObject({
            mutation: {
                onSuccess: () => {
                    Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: getModulesViewModuleOverviewQueryKey(
                                parseInt(moduleId!)
                            ),
                        }),
                        queryClient.invalidateQueries({
                            queryKey: getModulesGetListModuleObjectsQueryKey(),
                            refetchType: 'all',
                            exact: false,
                        }),
                    ]).then(onSuccess)

                    toastNotification('objectRemoved')
                },
            },
        })

    /**
     * Check if logged in user is a manager of the module
     */
    const isModuleManager = useMemo(() => {
        if (!module.data?.module) return false

        const { module_manager_1_id, module_manager_2_id } = module.data.module

        return (
            module_manager_1_id === user?.id || module_manager_2_id === user?.id
        )
    }, [module.data?.module, user?.id])

    const isActive = useMemo(
        () => !!module.data?.module.activated,
        [module.data?.module.activated]
    )

    const isLocked = useMemo(
        () => !!module.data?.module.temporary_locked,
        [module.data?.module.temporary_locked]
    )

    const isClosed = useMemo(
        () => !!module.data?.module.closed,
        [module.data?.module.closed]
    )

    const canComplete = useMemo(
        () => module.data?.module.status?.status === 'Vastgesteld',
        [module.data?.module.status?.status]
    )

    const value = {
        ...module,
        useEditModule,
        useCloseModule,
        useRemoveObjectFromModule,
        isModuleManager,
        isActive,
        isLocked,
        isClosed,
        canComplete,
    }

    useEffect(() => {
        if (module.isError) {
            toastNotification('notAllowed')
            navigate('/muteer')
        }
    }, [module.isError, navigate])

    return (
        <ModuleContext.Provider value={value}>
            {children || <Outlet />}
        </ModuleContext.Provider>
    )
}

export default ModuleProvider
