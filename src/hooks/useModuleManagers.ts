import { Module, UserShort } from '@/api/fetchers.schemas'

/**
 * Array of selected managers of module
 */
const useModuleManagers = (module?: Module) => {
    const items: UserShort[] = []

    if (module?.Module_Manager_1) {
        items.push(module.Module_Manager_1)
    }

    if (module?.Module_Manager_2) {
        items.push(module.Module_Manager_2)
    }

    return items
}

export default useModuleManagers
