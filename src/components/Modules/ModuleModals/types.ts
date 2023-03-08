import { Module } from '@/api/fetchers.schemas'

export interface ModuleModalActions {
    action?: 'activate' | 'lock' | 'addContents'
    isOpen: boolean
    module?: Module
}
