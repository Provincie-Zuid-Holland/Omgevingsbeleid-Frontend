import { ModuleObjectShort } from '@/api/fetchers.schemas'

export interface ModuleModalActions {
    action?: 'activate' | 'lock' | 'addContents' | 'editObject'
    isOpen: boolean
    object?: ModuleObjectShort
}
