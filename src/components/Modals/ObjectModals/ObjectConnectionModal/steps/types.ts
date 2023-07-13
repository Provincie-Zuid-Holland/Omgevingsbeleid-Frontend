import { ReadRelationShort, WriteRelationShort } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    model: Model
    connectionModel?: Model
    connections?: ReadRelationShort[]
    setStep?: (step: number) => void
    handleDeleteConnection?: (connection: WriteRelationShort) => void
}
