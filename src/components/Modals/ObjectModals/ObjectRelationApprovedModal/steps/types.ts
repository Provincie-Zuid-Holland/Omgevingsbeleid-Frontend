import { AcknowledgedRelation } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    model: Model
    relations?: AcknowledgedRelation[]
    handleDisconnect: (Object_ID: number, Title?: string) => void
}
