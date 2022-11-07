import { createContext, useContext, useReducer } from 'react'

import { VerordeningenRead, VerordeningenWrite } from '@/api/fetchers.schemas'
import {
    VerordeningLineageRead,
    VerordeningStructureChild,
} from '@/types/verordening'
import { replaceReorderedSections } from '@/utils/verordening'

export type ActiveSectionData =
    | (VerordeningenRead & { Children?: VerordeningenRead[] })
    | null
export type FormikValues =
    | (VerordeningenWrite & { Children?: FormikValues[] })
    | (VerordeningenRead & { Children?: FormikValues[] })
    | null
export type Dispatch = (action: Action) => void
export type VerordeningProviderProps = { children: React.ReactNode }
export type State = {
    lineageClone: VerordeningLineageRead | null
    editingSectionUUID: string | null
    activeSectionData: ActiveSectionData
    newSection: VerordeningenWrite | null
    activeLedenFromArticle: VerordeningenRead[] | null
    activeChapterUUID: string | null
    editingSectionIndexPath: number[] | null
    isEditingOrder: boolean
    isAddingSection: boolean
    addingSectionType: 'Afdeling' | 'Paragraaf' | 'Artikel' // There is no 'Hoofdstuk' type because these can only be added in the Chapter overview, making it redundant.
    isLoadingOrSaving: boolean
}

export type Action =
    | {
          type: 'reorderSections'
          payload: {
              reorderedSections: VerordeningStructureChild[]
              indexPath: number[]
          }
      }
    | {
          type: 'cloneLineageForReordering'
          payload: State['lineageClone']
      }
    | { type: 'setActiveChapterUUID'; payload: State['activeChapterUUID'] }
    | { type: 'setEditingSectionUUID'; payload: State['editingSectionUUID'] }
    | {
          type: 'setEditingSectionIndexPath'
          payload: State['editingSectionIndexPath']
      }
    | {
          type: 'setActiveLedenFromArticle'
          payload: State['activeLedenFromArticle']
      }
    | { type: 'setIsEditingOrder'; payload: State['isEditingOrder'] }
    | { type: 'setActiveSectionData'; payload: State['activeSectionData'] }
    | {
          type: 'setNewSection'
          payload:
              | 'Hoofdstuk'
              | 'Paragraaf'
              | 'Afdeling'
              | 'Artikel'
              | 'Lid'
              | null
      }
    | { type: 'setIsAddingSection'; payload: State['isAddingSection'] }
    | { type: 'setAddingSectionType'; payload: State['addingSectionType'] }
    | { type: 'setIsLoadingOrSaving'; payload: State['isLoadingOrSaving'] }
    | { type: 'resetEditingSection' }

const VerordeningContext = createContext<
    { state: State; dispatch: Dispatch } | undefined
>(undefined)

function verordeningReducer(state: State, action: Action) {
    switch (action.type) {
        case 'reorderSections':
            const { indexPath, reorderedSections } = action.payload
            const newLineageClone = replaceReorderedSections(
                indexPath,
                {
                    ...(state.lineageClone as VerordeningLineageRead),
                },
                reorderedSections
            )

            return {
                ...state,
                lineageClone: newLineageClone,
            }

        case 'cloneLineageForReordering':
            return {
                ...state,
                lineageClone: action.payload,
            }

        case 'setActiveChapterUUID':
            return {
                ...state,
                activeChapterUUID: action.payload,
            }
        case 'setEditingSectionUUID':
            return {
                ...state,
                editingSectionUUID: action.payload,
            }

        case 'resetEditingSection':
            return {
                ...state,
                editingSectionUUID: null,
                activeSectionData: null,
                editingSectionIndexPath: null,
                newSection: null,
            }

        case 'setEditingSectionIndexPath':
            return {
                ...state,
                editingSectionIndexPath: action.payload,
            }

        case 'setIsEditingOrder':
            return {
                ...state,
                isEditingOrder: action.payload,
            }

        case 'setIsAddingSection':
            return {
                ...state,
                isAddingSection: action.payload,
            }

        case 'setAddingSectionType':
            return {
                ...state,
                addingSectionType: action.payload,
            }

        case 'setIsLoadingOrSaving':
            return {
                ...state,
                isLoadingOrSaving: action.payload,
            }

        case 'setActiveSectionData':
            return {
                ...state,
                activeSectionData: { ...action.payload },
            }

        case 'setNewSection':
            if (action.payload === null) {
                return {
                    ...state,
                    newSection: null,
                }
            } else {
                return {
                    ...state,
                    newSection: {
                        Status: 'Vigerend',
                        Type: action.payload,
                    },
                }
            }

        default:
            return state
    }
}

function VerordeningProvider({ children }: VerordeningProviderProps) {
    const [state, dispatch] = useReducer(verordeningReducer, {
        // Used to reset the state to when user cancels the reordering
        lineageClone: null,

        // UUID of current chapter the user is viewing
        activeChapterUUID: null,

        // UUID of current section the user is editing
        editingSectionUUID: null,

        // The complete object of the section the user is editing, retrieved from the API when editingSectionUUID is set
        // It is also populated with a `Children` property if the section is an article with one or more Lid Children under it
        activeSectionData: null,

        // IndexPath to navigate to the object the user is editing in the lineage
        editingSectionIndexPath: null,

        // Indicates if user is ordering the sections
        isEditingOrder: false,

        // Indicates if user is ordering the sections
        isAddingSection: false,

        // Indicates the type of section the user is adding
        addingSectionType: 'Afdeling',

        // Combines multiple loading states (from the QueryClient) into a universal loading state
        isLoadingOrSaving: false,

        // To create new sections
        newSection: null,

        // Holds the leden if an article contains them
        activeLedenFromArticle: null,
    })

    const value = { state, dispatch }

    return (
        <VerordeningContext.Provider value={value}>
            {children}
        </VerordeningContext.Provider>
    )
}

function useVerordening() {
    const context = useContext(VerordeningContext)
    if (context === undefined) {
        throw new Error(
            'useVerordening must be used within a VerordeningProvider'
        )
    }
    return context
}

export { VerordeningProvider, useVerordening }