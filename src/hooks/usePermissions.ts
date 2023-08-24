import useAuth from './useAuth'

export interface Permissions {
    canCreateModule: boolean
    canEditModule: boolean
    canPatchModuleStatus: boolean
    canAddNewObjectToModule: boolean
    canAddExistingObjectToModule: boolean
    canEditModuleObjectContext: boolean
    canRemoveObjectFromModule: boolean
    canPatchObjectInModule: boolean
}

const usePermissions = (): Permissions => {
    const { role } = useAuth()

    const initialPermissions = {
        canCreateModule: false,
        canEditModule: false,
        canPatchModuleStatus: false,
        canAddNewObjectToModule: false,
        canAddExistingObjectToModule: false,
        canEditModuleObjectContext: false,
        canRemoveObjectFromModule: false,
        canPatchObjectInModule: false,
    }

    switch (role) {
        case 'Technisch beheerder':
        case 'Functioneel beheerder':
        case 'Beheerder':
        case 'Superuser':
        case 'Test runner':
        case 'Tester':
            return {
                ...initialPermissions,
                canCreateModule: true,
                canEditModule: true,
                canPatchModuleStatus: true,
                canAddNewObjectToModule: true,
                canAddExistingObjectToModule: true,
                canEditModuleObjectContext: true,
                canRemoveObjectFromModule: true,
                canPatchObjectInModule: true,
            }
        case 'Behandelend Ambtenaar':
            return {
                ...initialPermissions,
                canAddNewObjectToModule: true,
                canAddExistingObjectToModule: true,
                canEditModuleObjectContext: true,
                canPatchObjectInModule: true,
            }
        default:
            return { ...initialPermissions }
    }
}

export default usePermissions
