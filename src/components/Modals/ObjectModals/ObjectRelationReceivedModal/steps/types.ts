import { AcknowledgedRelation } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    model: Model
    relations?: AcknowledgedRelation[]
    history?: AcknowledgedRelation[]
    handleAction: (
        action: 'accept' | 'deny',
        relation: AcknowledgedRelation
    ) => void
}
