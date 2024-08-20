import { create } from 'zustand'

import { ModalStateMap, ModalType } from '@/components/Modals/types'

interface ModalState {
    /** Active modal id */
    activeModal: ModalType | null
    /** State of modals */
    modalStates: Partial<Record<ModalType, ModalStateMap[keyof ModalStateMap]>>
    /** Set active modal id */
    setActiveModal: (
        id: ModalType | null,
        state?: Partial<ModalStateMap[keyof ModalStateMap]>
    ) => void
}

const useModalStore = create<ModalState>(set => ({
    activeModal: null,
    modalStates: {},
    setActiveModal: (activeModal, modalState) =>
        set(state => ({
            ...state,
            activeModal,
            modalStates: {
                ...state.modalStates,
                ...(activeModal !== null
                    ? {
                          [activeModal]: state.modalStates[activeModal]
                              ? {
                                    ...state.modalStates[activeModal],
                                    ...modalState,
                                }
                              : modalState,
                      }
                    : {}),
            },
        })),
}))

export default useModalStore
