import {
    DocumentType,
    ProcedureType,
    Publication,
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
    }
    publicationVersionAbort: {
        publication: Publication
        version: PublicationVersionShort
    }
}
