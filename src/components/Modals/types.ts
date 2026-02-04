import { Editor } from '@tiptap/core'

import {
    DocumentType,
    Module,
    PackageType,
    ProcedureType,
    Publication,
    PublicationEnvironment,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'
import { Error } from '@/utils/handleError'

import { ModelReturnTypeBasic } from '@/config/objects/types'
import { PublicationType } from '../Publications/types'

export type ModalType =
    | 'regulationAdd'
    | 'regulationDelete'
    | 'regulationEdit'
    | 'revision'
    | 'passwordForget'
    | 'passwordReset'
    | 'moduleLock'
    | 'moduleActivate'
    | 'moduleComplete'
    | 'moduleAddObject'
    | 'moduleEditObject'
    | 'moduleDeleteObject'
    | 'moduleScan'
    | 'areaAdd'
    | 'areaEdit'
    | 'objectArea'
    | 'objectAreaAnnotate'
    | 'objectDetails'
    | 'objectAddConnection'
    | 'objectGeneralInformation'
    | 'objectRelationAdd'
    | 'objectRelationApproved'
    | 'objectRelationReceived'
    | 'objectRelationSent'
    | 'userAdd'
    | 'userEdit'
    | 'userPasswordReset'
    | 'publicationAdd'
    | 'publicationEdit'
    | 'publicationVersionAdd'
    | 'publicationVersionEdit'
    | 'publicationPackages'
    | 'publicationVersionAbort'
    | 'publicationAnnouncementPackages'
    | 'publicationAnnouncementUpdate'
    | 'publicationPackageReportUpload'

export interface ModalStateMap {
    moduleEditObject: {
        object: ModelReturnTypeBasic
    }
    moduleDeleteObject: {
        object: ModelReturnTypeBasic
        module: Pick<Module, 'Module_ID' | 'Title'>
    }
    objectArea: {
        moduleId: string
        id: string
        locatie: string
        gebiedsaanwijzingtype: string
        gebiedengroep: string
        label: string
    }
    objectAreaAnnotate: {
        editor: Editor
    }
    publicationAdd: {
        documentType: DocumentType
        procedureType: ProcedureType
        environmentUUID: string
    }
    publicationEdit: { publication: Publication }
    publicationVersionAdd: { publication: Publication }
    publicationVersionEdit: {
        publication: Publication
        UUID: string
        isRequired?: boolean
        error?: Error
    }
    publicationPackages: {
        publication: Publication
        version: PublicationVersionShort
        announcementUuid: string
    }
    publicationAnnouncementPackages: {
        environment?: PublicationEnvironment
        version: PublicationVersionShort
        announcementUuid: string
    }
    publicationVersionAbort: {
        publication: Publication
        version: PublicationVersionShort
    }
    publicationAnnouncementUpdate: {
        announcementUuid: string
        isLocked?: boolean
    }
    publicationPackageReportUpload: {
        publicationType: PublicationType
        publicationUUID: string
        packageUUID: string
        announcementUUID: string
        packageType?: PackageType
    }
}
