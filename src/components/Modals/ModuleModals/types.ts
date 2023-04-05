import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'

export interface ModuleModalActions {
    action?:
        | 'activate'
        | 'lock'
        | 'addContents'
        | 'editObject'
        | 'deleteObject'
        | 'completeModule'
    isOpen: boolean
    object?: ModuleObjectShort
    module?: Module
}
