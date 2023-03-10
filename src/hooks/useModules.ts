import { useQueryClient } from '@tanstack/react-query'

import {
    getModulesModuleIdGetQueryKey,
    useModulesModuleIdPost,
    useModulesModuleIdRemoveObjectTypeLineageIdDelete,
} from '@/api/fetchers'
import { toastNotification } from '@/utils/toastNotification'

const useModules = () => {
    const queryClient = useQueryClient()

    const useEditModule = (id: number, onSucces?: () => void) =>
        useModulesModuleIdPost({
            mutation: {
                onError: () => {
                    toastNotification({ type: 'standard error' })
                },
                onSuccess: () => {
                    queryClient
                        .invalidateQueries(getModulesModuleIdGetQueryKey(id))
                        .then(onSucces)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    const useRemoveObjectFromModule = (id: number, onSucces?: () => void) =>
        useModulesModuleIdRemoveObjectTypeLineageIdDelete({
            mutation: {
                onError: () => {
                    toastNotification({ type: 'standard error' })
                },
                onSuccess: () => {
                    queryClient
                        .invalidateQueries(getModulesModuleIdGetQueryKey(id))
                        .then(onSucces)

                    toastNotification({ type: 'saved' })
                },
            },
        })

    return { useEditModule, useRemoveObjectFromModule }
}

export default useModules
