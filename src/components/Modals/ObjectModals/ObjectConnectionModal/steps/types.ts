import { RelationShort } from '@/api/fetchers.schemas'
import { Connection } from '@/components/DynamicObject/ObjectConnections/ObjectConnections'
import { Model } from '@/config/objects/types'

export interface StepProps {
    title?: string
    id?: number
    model: Model
    connectionModel?: Model
    connections?: Connection[]
    setStep?: (step: number) => void
    handleDeleteConnection?: (connection: RelationShort) => void
}
