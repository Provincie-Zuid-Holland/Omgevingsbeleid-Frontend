import { Module } from '@/api/fetchers.schemas'

export const formatEditModuleData = (data: Module) => {
    const { title, description, module_manager_1_id, module_manager_2_id } =
        data

    return {
        title,
        description,
        module_manager_1_id,
        module_manager_2_id,
    }
}
