import { create } from 'zustand'

interface PublicationState {
    /** Is Wizard active */
    wizardActive?: boolean
    /** Set Wizard active */
    setWizardActive: (wizardActive: boolean) => void
    /** Active Folders */
    activeFolders: {
        documentTypes?: string[]
        procedureTypes?: string[]
        publications?: string[]
    }
    /** Set Active Folders */
    setActiveFolders: (activeFolders: PublicationState['activeFolders']) => void
}

const usePublicationStore = create<PublicationState>(set => ({
    wizardActive: true,
    setWizardActive: wizardActive => set(state => ({ ...state, wizardActive })),
    activeFolders: {
        procedureTypes: ['draft', 'final'],
    },
    setActiveFolders: activeFolders =>
        set(state => ({
            ...state,
            activeFolders: {
                ...state.activeFolders,
                ...activeFolders,
            },
        })),
}))

export default usePublicationStore
