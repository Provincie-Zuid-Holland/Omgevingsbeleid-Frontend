import {
    AcknowledgedRelation,
    ReadRelation,
    UserShort,
} from '@/api/fetchers.schemas'
import { Model, ModelPatchStaticType, ModelType } from '@/config/objects/types'

export interface ObjectConnectionModalActions {
    connectionKey?: ModelType
    connectionModel: Model
    initialStep?: number
    initialValues:
        | ReadRelation
        | { items?: { Object_ID: number; Title: string }[] }
}

export interface ObjectPersonModalActions {
    person?: {
        key: string
        label: string
        value?: UserShort
        required?: boolean
        filter?: string | null
    }
    isEdit?: boolean
    initialValues: ModelPatchStaticType
}

export interface ObjectRelationModalActions {
    action?: 'add' | 'approved' | 'sent' | 'received'
    relations?: AcknowledgedRelation[]
    history?: AcknowledgedRelation[]
}
