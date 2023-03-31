import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'

export interface ModuleModalActions {
    action?: 'activate' | 'lock' | 'addContents' | 'editObject' | 'deleteObject'
    isOpen: boolean
    object?: ModuleObjectShort
    module?: Module
}
