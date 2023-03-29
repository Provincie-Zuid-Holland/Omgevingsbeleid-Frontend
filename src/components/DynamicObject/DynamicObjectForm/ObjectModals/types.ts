import { RelationShort } from '@/api/fetchers.schemas'
import { Model, ModelReturnType } from '@/config/objects/types'

export interface ObjectModalActions {
    action?: 'addConnection'
    connectionKey?: keyof ModelReturnType
    isOpen: boolean
    relationModel?: Model
    initialStep?: number
    initialValues: RelationShort
}
