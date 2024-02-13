import {
    AppExtensionsPublicationsEnumsDocumentType,
    Publication,
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
    | 'publicationVersionAdd'
    | 'publicationVersionEdit'

export interface ModalStateMap {
    publicationAdd: { type: AppExtensionsPublicationsEnumsDocumentType }
    publicationVersionAdd: { publication: Publication; prevUUID?: string }
    publicationVersionEdit: { publication: Publication; UUID: string }
}
