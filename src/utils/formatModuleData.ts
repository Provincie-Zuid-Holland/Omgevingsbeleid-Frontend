import { Module } from '@/api/fetchers.schemas'

export const formatEditModuleData = (data: Module) => {
    const { Title, Description, Module_Manager_1_UUID, Module_Manager_2_UUID } =
        data

    return { Title, Description, Module_Manager_1_UUID, Module_Manager_2_UUID }
}
