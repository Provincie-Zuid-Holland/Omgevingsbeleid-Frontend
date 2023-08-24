import { ReadRelation, WriteRelation } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    model: Model
    connectionModel?: Model
    connections?: ReadRelation[]
    setStep?: (step: number) => void
    handleDeleteConnection?: (connection: WriteRelation) => void
}
