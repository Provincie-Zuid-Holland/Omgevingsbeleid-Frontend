import {
    Regulation,
    RegulationObjectOverwrite,
    RegulationShort,
} from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    model: Model
    connections?: RegulationShort[]
    items?: Regulation[]
    isLoading?: boolean
    setStep?: (step: number) => void
    handleDeleteConnection?: (connection: RegulationObjectOverwrite) => void
}
