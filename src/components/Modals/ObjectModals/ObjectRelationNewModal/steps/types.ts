import { AcknowledgedRelation } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    id?: number
    model: Model
    relations?: AcknowledgedRelation[]
}
