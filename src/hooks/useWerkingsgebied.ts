import {
    useWerkingsgebiedViewModuleObjectLatest,
    useWerkingsgebiedViewObjectLatest,
} from '@/api/fetchers'
import { useParams } from 'react-router-dom'
import useAuth from './useAuth'

export const useWerkingsgebied = (Object_ID: number) => {
    const { moduleId } = useParams()
    const { user } = useAuth()

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useWerkingsgebiedViewModuleObjectLatest(
        parseInt(moduleId!),
        Object_ID,
        {
            query: {
                enabled: !!moduleId && !!Object_ID && !!user,
            },
        }
    )

    const { data: validData } = useWerkingsgebiedViewObjectLatest(Object_ID, {
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
