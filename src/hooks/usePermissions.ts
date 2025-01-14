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
    canCreateUser: boolean
    canEditUser: boolean
    canResetUserPassword: boolean
    canCreatePublicationTemplate: boolean
    canEditPublicationTemplate: boolean
    canViewPublicationTemplate: boolean
    canViewPublicationEnvironment: boolean
    canViewPublicationAoj: boolean
    canCreatePublication: boolean
    canEditPublication: boolean
    canViewPublication: boolean
    canCreatePublicationVersion: boolean
    canEditPublicationVersion: boolean
    canViewPublicationVersion: boolean
    canCreatePublicationPackage: boolean
    canViewPublicationPackage: boolean
    canDownloadPublicationPackage: boolean
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
        canCreateUser: false,
        canEditUser: false,
        canResetUserPassword: false,
        canCreatePublicationTemplate: false,
        canEditPublicationTemplate: false,
        canViewPublicationTemplate: false,
        canViewPublicationEnvironment: false,
        canViewPublicationAoj: false,
        canCreatePublication: false,
        canEditPublication: false,
        canViewPublication: false,
        canCreatePublicationVersion: false,
        canEditPublicationVersion: false,
        canViewPublicationVersion: false,
        canCreatePublicationPackage: false,
        canViewPublicationPackage: false,
        canDownloadPublicationPackage: false,
    }

    switch (role) {
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
                canCreateUser: true,
                canEditUser: true,
                canResetUserPassword: true,
                canViewPublicationEnvironment: true,
                canViewPublicationAoj: true,
                canCreatePublication: true,
                canEditPublication: true,
                canViewPublication: true,
                canCreatePublicationVersion: true,
                canEditPublicationVersion: true,
                canViewPublicationVersion: true,
                canCreatePublicationPackage: true,
                canViewPublicationPackage: true,
                canDownloadPublicationPackage: true,
            }
        case 'Behandelend Ambtenaar':
            return {
                ...initialPermissions,
                canAddNewObjectToModule: true,
                canAddExistingObjectToModule: true,
                canEditModuleObjectContext: true,
                canPatchObjectInModule: true,
            }
        case 'Ambtelijk opdrachtgever':
            return {
                ...initialPermissions,
                canPatchObjectInModule: true,
                canEditModuleObjectContext: true,
            }
        case 'Technisch Beheerder': {
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
                canCreateUser: true,
                canEditUser: true,
                canResetUserPassword: true,
                canCreatePublicationTemplate: true,
                canEditPublicationTemplate: true,
                canViewPublicationTemplate: true,
                canViewPublicationEnvironment: true,
                canViewPublicationAoj: true,
                canCreatePublication: true,
                canEditPublication: true,
                canViewPublication: true,
                canCreatePublicationVersion: true,
                canEditPublicationVersion: true,
                canViewPublicationVersion: true,
                canCreatePublicationPackage: true,
                canViewPublicationPackage: true,
                canDownloadPublicationPackage: true,
            }
        }
        default:
            return { ...initialPermissions }
    }
}

export default usePermissions
