import {
    RelationShort,
    RequestAcknowledgedRelation,
    UserShort,
} from '@/api/fetchers.schemas'
import {
    Model,
    ModelPatchStaticType,
    ModelReturnType,
} from '@/config/objects/types'

export interface ObjectConnectionModalActions {
    connectionKey?: keyof ModelReturnType
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

export interface ObjectRelationNewModalActions {
    isOpen: boolean
    initialValues: RequestAcknowledgedRelation
}
