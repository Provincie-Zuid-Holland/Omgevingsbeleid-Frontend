import { RelationShort } from '@/api/fetchers.schemas'
import { Relation } from '@/components/DynamicObject/ObjectRelations/ObjectRelations'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    model: Model
    relationModel?: Model
    relations?: Relation[]
    setStep?: (step: number) => void
    handleDeleteRelation?: (relation: RelationShort) => void
}
