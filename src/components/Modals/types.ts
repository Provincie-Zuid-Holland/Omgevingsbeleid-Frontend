import {
    DocumentType,
    ProcedureType,
    Publication,
    PublicationEnvironment,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'

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
    | 'objectPerson'
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
    publicationAdd: {
        documentType: DocumentType
        procedureType: ProcedureType
        environmentUUID: string
    }
    publicationEdit: { publication: Publication }
    publicationVersionAdd: { publication: Publication }
    publicationVersionEdit: { publication: Publication; UUID: string }
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
