import {
    useGebiedengroepViewModuleObjectLatest,
    useGebiedengroepViewObjectLatest,
} from '@/api/fetchers'
import { useParams } from 'react-router-dom'
import useAuth from './useAuth'

export const useArea = (Object_ID: number) => {
    const { moduleId } = useParams()
    const { user } = useAuth()

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useGebiedengroepViewModuleObjectLatest(parseInt(moduleId!), Object_ID, {
        query: {
            enabled: !!moduleId && !!Object_ID && !!user,
        },
    })

    const { data: validData } = useGebiedengroepViewObjectLatest(Object_ID, {
        query: {
            enabled:
                (!moduleId && !!Object_ID) ||
                (!!moduleId && !!Object_ID && !moduleData && isSuccess) ||
                isError,
        },
    })

    const data = moduleId && isSuccess ? moduleData : validData

    return data
}
