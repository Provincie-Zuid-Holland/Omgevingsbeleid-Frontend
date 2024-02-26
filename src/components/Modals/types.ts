import {
    AppExtensionsPublicationsEnumsDocumentType,
    Publication,
    PublicationBillShort,
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

export interface ModalStateMap {
    publicationAdd: { type: AppExtensionsPublicationsEnumsDocumentType }
    publicationEdit: { publication: Publication }
    publicationVersionAdd: { publication: Publication; prevUUID?: string }
    publicationVersionEdit: { publication: Publication; UUID: string }
    publicationPackages: {
        publication: Publication
        bill: PublicationBillShort
    }
}
