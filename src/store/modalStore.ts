import { create } from 'zustand'

import { ModalType } from '@/components/Modals/types'

interface ModalState {
    /** Active modal id */
    activeModal: ModalType | null
    /** Set active modal id */
    setActiveModal: (id: ModalType | null) => void
}

const useModalStore = create<ModalState>(set => ({
    activeModal: null,
    setActiveModal: activeModal => set(state => ({ ...state, activeModal })),
}))

export default useModalStore
