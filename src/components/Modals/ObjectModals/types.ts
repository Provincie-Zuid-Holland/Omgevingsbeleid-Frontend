import {
    AcknowledgedRelation,
    RelationShort,
    UserShort,
} from '@/api/fetchers.schemas'
import {
    Model,
    ModelPatchStaticType,
    ModelReturnType,
} from '@/config/objects/types'

export interface ObjectConnectionModalActions {
    connectionKey?: Exclude<keyof ModelReturnType, 'Regulations'>
    isOpen: boolean
    connectionModel?: Model
    initialStep?: number
    initialValues: RelationShort
}

export interface ObjectPersonModalActions {
    person?: {
        key: string
        label: string
        value?: UserShort
    }
    isOpen: boolean
    isEdit?: boolean
    initialValues: ModelPatchStaticType
}

export interface ObjectRelationModalActions {
    action?: 'add' | 'approved' | 'sent' | 'received'
    isOpen: boolean
    relations?: AcknowledgedRelation[]
}
