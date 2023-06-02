import { Werkingsgebied } from '@/api/fetchers.schemas'

export interface StepProps {
    data?: {
        [key: string]: Werkingsgebied[]
    }
    isLoading?: boolean
}
