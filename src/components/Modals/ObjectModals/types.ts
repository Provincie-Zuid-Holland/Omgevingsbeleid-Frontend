import {
    AcknowledgedRelation,
    ObjectStaticShort,
    ReadRelation,
    UserShort,
} from '@/api/fetchers.schemas'
import { Model, ModelType } from '@/config/objects/types'
import { Role } from '@/context/AuthContext'

export interface ObjectConnectionModalActions {
    connectionKey?: ModelType
    connectionModel: Model
    initialStep?: number
    initialValues:
        | Partial<ReadRelation>
        | { items?: { value: number; label: string }[] }
}

export interface ObjectPersonModalActions {
    person?: {
        key: string
        label: string
        value?: UserShort
        required?: boolean
        filter?: string | null
        filterRoles?: Role[]
    }
    isEdit?: boolean
    initialValues: ObjectStaticShort
}

export interface ObjectRelationModalActions {
    action?: 'add' | 'approved' | 'sent' | 'received'
    relations?: AcknowledgedRelation[]
    history?: AcknowledgedRelation[]
}
