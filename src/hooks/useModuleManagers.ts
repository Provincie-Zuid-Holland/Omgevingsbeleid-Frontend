import { useUsersGet } from '@/api/fetchers'
import { Module, UserShort } from '@/api/fetchers.schemas'

/**
 * Array of selected managers of module
 */
const useModuleManagers = (module?: Module) => {
    const { data: users } = useUsersGet()

    const items: UserShort[] = []

    if (module?.Module_Manager_1) {
        const manager_1 = users?.find(
            user => user.UUID === module.Module_Manager_1_UUID
        )

        if (manager_1) items.push(manager_1)
    }

    if (module?.Module_Manager_2) {
        const manager_2 = users?.find(
            user => user.UUID === module.Module_Manager_2_UUID
        )

        if (manager_2) items.push(manager_2)
    }

    return items
}

export default useModuleManagers
