import {
    AcknowledgedRelation,
    ReadRelationShort,
    UserShort,
} from '@/api/fetchers.schemas'
import { Model, ModelPatchStaticType, ModelType } from '@/config/objects/types'

export interface ObjectConnectionModalActions {
    connectionKey?: ModelType
    isOpen: boolean
    connectionModel: Model
    initialStep?: number
    initialValues: ReadRelationShort | { items?: number[] }
}

export interface ObjectPersonModalActions {
    person?: {
        key: string
        label: string
        value?: UserShort
        required?: boolean
        filter?: string | null
    }
    isOpen: boolean
    isEdit?: boolean
    initialValues: ModelPatchStaticType
}

export interface ObjectRelationModalActions {
    action?: 'add' | 'approved' | 'sent' | 'received'
    isOpen: boolean
    relations?: AcknowledgedRelation[]
    history?: AcknowledgedRelation[]
}
