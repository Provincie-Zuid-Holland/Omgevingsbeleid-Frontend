import {
    DocumentType,
    Module,
    ModuleObjectShort,
    ProcedureType,
    Publication,
    PublicationEnvironment,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'
import { Error } from '@/utils/handleError'

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
    | 'areaAdd'
    | 'objectDetails'
    | 'objectAddConnection'
    | 'objectDelete'
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

export interface ModalStateMap {
    moduleEditObject: {
        object: ModuleObjectShort
    }
    moduleDeleteObject: {
        object: ModuleObjectShort
        module: Module
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
}
