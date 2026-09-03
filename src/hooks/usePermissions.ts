import { useMemo } from 'react'

import useAuth from './useAuth'

export type Permissions = typeof initialPermissions

type Role =
    | 'Behandelend Ambtenaar'
    | 'Regisseur Omgevingsbeleid'
    | 'Publiceerder'
    | 'Technisch Beheerder'
    | 'Ambtelijk opdrachtgever'
    | 'Portefeuillehouder'
    | 'Basic'
    | 'Superuser'

const initialPermissions = {
    atemporalCanCreateObject: false,
    atemporalCanEditObject: false,
    atemporalCanDeleteObject: false,
    canCreateModule: false,
    canCloseModule: false,
    canEditModule: false,
    canActivateModule: false,
    canPatchModuleStatus: false,
    canCompleteModule: false,
    canAddNewObjectToModule: false,
    canAddExistingObjectToModule: false,
    canEditModuleObjectContext: false,
    canRemoveObjectFromModule: false,
    canPatchObjectInModule: false,
    canCreateUser: false,
    canEditUser: false,
    canResetUserPassword: false,
    canPatchObjectStatic: false,
    canCreatePublicationTemplate: false,
    canEditPublicationTemplate: false,
    canViewPublicationTemplate: false,
    canViewPublicationAoj: false,
    canCreatePublicationAoj: false,
    canCreatePublication: false,
    canEditPublication: false,
    canViewPublication: false,
    canViewUnifiedPackages: false,
    canCreatePublicationVersion: false,
    canEditPublicationVersion: false,
    canViewPublicationVersion: false,
    canUploadPublicationVersionAttachment: false,
    canDownloadPublicationVersionAttachment: false,
    canDeletePublicationVersionAttachment: false,
    canCreatePublicationAct: false,
    canEditPublicationAct: false,
    canViewPublicationAct: false,
    canClosePublicationAct: false,
    canCreatePublicationActPackage: false,
    canViewPublicationActPackage: false,
    canDownloadPublicationActPackage: false,
    canAbortPublicationActPackage: false,
    canUploadPublicationActPackageReport: false,
    canViewPublicationActPackageReport: false,
    canDownloadPublicationActPackageReport: false,
    canCreatePublicationAnnouncement: false,
    canEditPublicationAnnouncement: false,
    canViewPublicationAnnouncement: false,
    canCreatePublicationAnnouncementPackage: false,
    canViewPublicationAnnouncementPackage: false,
    canDownloadPublicationAnnouncementPackage: false,
    canUploadPublicationAnnouncementPackageReport: false,
    canViewPublicationAnnouncementPackageReport: false,
    canDownloadPublicationAnnouncementPackageReport: false,
    canViewPublicationEnvironment: false,
    canCreatePublicationEnvironment: false,
    canEditPublicationEnvironment: false,
    storageFileCanUploadFiles: false,
    canCreateObjectRelatedFile: false,
    canDeleteObjectRelatedFile: false,
}

const regisseurOmgevingsbeleidPermissions: Partial<Permissions> = {
    atemporalCanCreateObject: true,
    atemporalCanEditObject: true,
    atemporalCanDeleteObject: true,
    canCreateModule: true,
    canCloseModule: true,
    canEditModule: true,
    canActivateModule: true,
    canPatchModuleStatus: true,
    canCompleteModule: true,
    canAddNewObjectToModule: true,
    canAddExistingObjectToModule: true,
    canEditModuleObjectContext: true,
    canRemoveObjectFromModule: true,
    canPatchObjectInModule: true,
    canCreateUser: true,
    canEditUser: true,
    canResetUserPassword: true,
    canPatchObjectStatic: true,
    canViewPublicationEnvironment: true,
    canCreatePublication: true,
    canEditPublication: true,
    canViewPublication: true,
    canViewUnifiedPackages: true,
    canCreatePublicationVersion: true,
    canEditPublicationVersion: true,
    canViewPublicationVersion: true,
    canUploadPublicationVersionAttachment: true,
    canDownloadPublicationVersionAttachment: true,
    canCreatePublicationAct: true,
    canEditPublicationAct: true,
    canViewPublicationAct: true,
    canClosePublicationAct: true,
    canCreatePublicationActPackage: true,
    canViewPublicationActPackage: true,
    canDownloadPublicationActPackage: true,
    canAbortPublicationActPackage: true,
    canViewPublicationActPackageReport: true,
    canDownloadPublicationActPackageReport: true,
    canCreatePublicationAnnouncement: true,
    canEditPublicationAnnouncement: true,
    canViewPublicationAnnouncement: true,
    canCreatePublicationAnnouncementPackage: true,
    canViewPublicationAnnouncementPackage: true,
    canDownloadPublicationAnnouncementPackage: true,
    canUploadPublicationAnnouncementPackageReport: true,
    canViewPublicationAnnouncementPackageReport: true,
    canDownloadPublicationAnnouncementPackageReport: true,
    storageFileCanUploadFiles: true,
    canCreateObjectRelatedFile: true,
    canDeleteObjectRelatedFile: true,
}

const publiceerderPermissions: Partial<Permissions> = {
    canCreatePublicationTemplate: true,
    canEditPublicationTemplate: true,
    canViewPublicationTemplate: true,
    canViewPublicationAoj: true,
    canCreatePublicationAoj: true,
    canCreatePublication: true,
    canEditPublication: true,
    canViewPublication: true,
    canViewUnifiedPackages: true,
    canCreatePublicationVersion: true,
    canEditPublicationVersion: true,
    canViewPublicationVersion: true,
    canUploadPublicationVersionAttachment: true,
    canDownloadPublicationVersionAttachment: true,
    canCreatePublicationAct: true,
    canEditPublicationAct: true,
    canViewPublicationAct: true,
    canClosePublicationAct: true,
    canCreatePublicationActPackage: true,
    canViewPublicationActPackage: true,
    canDownloadPublicationActPackage: true,
    canAbortPublicationActPackage: true,
    canUploadPublicationActPackageReport: true,
    canViewPublicationActPackageReport: true,
    canDownloadPublicationActPackageReport: true,
    canCreatePublicationAnnouncement: true,
    canEditPublicationAnnouncement: true,
    canViewPublicationAnnouncement: true,
    canCreatePublicationAnnouncementPackage: true,
    canViewPublicationAnnouncementPackage: true,
    canDownloadPublicationAnnouncementPackage: true,
    canUploadPublicationAnnouncementPackageReport: true,
    canViewPublicationAnnouncementPackageReport: true,
    canDownloadPublicationAnnouncementPackageReport: true,
    canViewPublicationEnvironment: true,
    storageFileCanUploadFiles: true,
}

const technischBeheerderPermissions = Object.fromEntries(
    Object.keys(initialPermissions).map(permission => [permission, true])
) as unknown as Permissions

const permissionsByRole: Record<Role, Partial<Permissions>> = {
    'Behandelend Ambtenaar': {
        canAddNewObjectToModule: true,
        canAddExistingObjectToModule: true,
        canEditModuleObjectContext: true,
    },
    'Regisseur Omgevingsbeleid': regisseurOmgevingsbeleidPermissions,
    Publiceerder: publiceerderPermissions,
    'Technisch Beheerder': technischBeheerderPermissions,
    'Ambtelijk opdrachtgever': {
        canPatchObjectStatic: true,
    },
    Portefeuillehouder: {},
    Basic: {},
    Superuser: technischBeheerderPermissions,
}

const usePermissions = (): Permissions => {
    const { roles = [] } = useAuth()

    return useMemo(
        () =>
            roles.reduce<Permissions>(
                (combinedPermissions, role) => {
                    const rolePermissions = permissionsByRole[role as Role]

                    if (!rolePermissions) return combinedPermissions

                    for (const permission of Object.keys(
                        rolePermissions
                    ) as Array<keyof Permissions>) {
                        combinedPermissions[permission] ||=
                            rolePermissions[permission] === true
                    }

                    return combinedPermissions
                },
                { ...initialPermissions }
            ),
        [roles]
    )
}

export default usePermissions
