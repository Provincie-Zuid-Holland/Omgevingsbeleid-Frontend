import { RelationShort } from '@/api/fetchers.schemas'

export interface ObjectModalActions {
    action?: 'addConnection'
    isOpen: boolean
    relation?: RelationShort
    initialStep?: number
    isEdit?: boolean
}
