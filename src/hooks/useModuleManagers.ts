import { Module, ModuleShort, UserShort } from '@/api/fetchers.schemas'

/**
 * Array of selected managers of module
 */
const useModuleManagers = (module?: Module | ModuleShort) => {
    const items: UserShort[] = []

    if (module?.module_manager_1) {
        items.push(module.module_manager_1)
    }

    if (module?.module_manager_2) {
        items.push(module.module_manager_2)
    }

    return items
}

export default useModuleManagers
