import { useParams } from 'react-router-dom'

import {
    useGebiedengroepViewModuleObjectLatest,
    useGebiedengroepViewObjectLatest,
} from '@/api/fetchers'

import useAuth from './useAuth'

export const useArea = (object_id: number) => {
    const { moduleId } = useParams()
    const { user } = useAuth()

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useGebiedengroepViewModuleObjectLatest(parseInt(moduleId!), object_id, {
        query: {
            enabled: !!moduleId && !!object_id && !!user,
        },
    })

    const { data: validData } = useGebiedengroepViewObjectLatest(object_id, {
        query: {
            enabled:
                (!moduleId && !!object_id) ||
                (!!moduleId && !!object_id && !moduleData && isSuccess) ||
                isError,
        },
    })

    const data = moduleId && isSuccess ? moduleData : validData

    return data
}
