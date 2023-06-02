import { create } from 'zustand'

import { ModelReturnType } from '@/config/objects/types'

interface RevisionState {
    /** Initial object */
    initialObject?: ModelReturnType
    /** Set active filters */
    setInitialObject: (initialObject?: ModelReturnType) => void
    /** Revision from object */
    revisionFrom?: ModelReturnType
    /** Set revision from object */
    setRevisionFrom: (revisionFrom?: ModelReturnType) => void
    /** Revision to object */
    revisionTo?: ModelReturnType
    /** Set revision to object */
    setRevisionTo: (revisionTo?: ModelReturnType) => void
}

const useRevisionStore = create<RevisionState>(set => ({
    initialObject: undefined,
    setInitialObject: initialObject =>
        set(state => ({
            ...state,
            initialObject,
        })),
    revisionFrom: undefined,
    setRevisionFrom: revisionFrom =>
        set(state => ({
            ...state,
            revisionFrom,
        })),
    revisionTo: undefined,
    setRevisionTo: revisionTo =>
        set(state => ({
            ...state,
            revisionTo,
        })),
}))

export default useRevisionStore
