import { createContext, useReducer, useContext } from 'react'

import { VerordeningenRead } from '@/api/fetchers.schemas'
import {
    VerordeningLineageRead,
    VerordeningChildRead,
} from '@/types/verordening'
import {
    getChildrenOfSectionFromLineage,
    postVerordeningSection,
} from '@/utils/verordening'

type ActiveSectionData =
    | (VerordeningenRead & { Children?: VerordeningenRead[] })
    | null
type Dispatch = (action: Action) => void
type VerordeningProviderProps = { children: React.ReactNode }
type State = {
    lineageClone: VerordeningLineageRead | null
    editingSectionUUID: string | null
    activeSectionData: ActiveSectionData
    newPostObject: VerordeningChildRead | null
    activeChapterUUID: string | null
    editingSectionIndexPath: number[] | null
    isEditingOrder: boolean
    isAddingSection: boolean
    isLoadingOrSaving: boolean
}
type Action =
    | {
          type: 'reorderSections'
          payload: {
              reorderedSections: VerordeningChildRead[]
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
    | { type: 'setIsEditingOrder'; payload: State['isEditingOrder'] }
    | { type: 'setActiveSectionData'; payload: State['activeSectionData'] }
    | {
          type: 'transformArticleContentToSubItem'
          payload: State['activeSectionData']
      }
    | { type: 'setIsAddingSection'; payload: State['isAddingSection'] }
    | { type: 'setIsLoadingOrSaving'; payload: State['isLoadingOrSaving'] }
    | { type: 'setNewPostObject'; payload: State['newPostObject'] }
    | { type: 'resetEditingSection' }

const VerordeningContext = createContext<
    { state: State; dispatch: Dispatch } | undefined
>(undefined)

const replaceReorderedSections = (
    indexPath: number[],
    newLineageClone: VerordeningLineageRead,
    reorderedSections: VerordeningChildRead[]
) => {
    if (
        indexPath.length === 0 &&
        newLineageClone?.Structuur?.Children !== undefined
    ) {
        newLineageClone.Structuur.Children = reorderedSections
    } else if (
        indexPath.length === 1 &&
        newLineageClone?.Structuur?.Children[indexPath[0]]?.Children !==
            undefined
    ) {
        newLineageClone.Structuur.Children[indexPath[0]].Children =
            reorderedSections
    } else if (
        indexPath.length === 2 &&
        newLineageClone?.Structuur?.Children[indexPath[0]]?.Children[
            indexPath[1]
        ]?.Children !== undefined
    ) {
        newLineageClone.Structuur.Children[indexPath[0]].Children[
            indexPath[1]
        ].Children = reorderedSections
    } else if (
        indexPath.length === 3 &&
        newLineageClone?.Structuur?.Children[indexPath[0]]?.Children[
            indexPath[1]
        ]?.Children[indexPath[2]]?.Children !== undefined
    ) {
        newLineageClone.Structuur.Children[indexPath[0]].Children[
            indexPath[1]
        ].Children[indexPath[2]].Children = reorderedSections
    }

    return newLineageClone
}

const transformArticleContentToSubItem = async (
    activeSectionData: VerordeningenRead & { Children?: VerordeningenRead[] }
) => {
    const currentContent = activeSectionData?.Inhoud
    activeSectionData.Inhoud = ''
    const newLidPost = {
        Inhoud: currentContent,
        Type: 'Lid' as const,
        Status: 'Vigerend' as const,
        Volgnummer: '',
    }
    const newLid = await postVerordeningSection(newLidPost)
    activeSectionData.Children = [{ Inhoud: newLid }]
    return activeSectionData
}

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

        case 'setIsLoadingOrSaving':
            return {
                ...state,
                isLoadingOrSaving: action.payload,
            }

        case 'setActiveSectionData':
            return {
                ...state,
                activeSectionData: action.payload,
            }

        case 'transformArticleContentToSubItem':
            const currentActiveSectionData = action.payload
            if (!currentActiveSectionData) return { ...state }
            const createdLid = transformArticleContentToSubItem(
                currentActiveSectionData
            )
            const newArticle = {
                ...currentActiveSectionData,
                Children: [createdLid],
            } as ActiveSectionData
            return {
                ...state,
                activeSectionData: newArticle,
            }

        case 'setNewPostObject':
            return {
                ...state,
                newPostObject: action.payload,
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
        activeSectionData: null,

        // IndexPath to navigate to the object the user is editing in the lineage
        editingSectionIndexPath: null,

        // Indicates if user is ordering the sections
        isEditingOrder: false,

        // Indicates if user is ordering the sections
        isAddingSection: false,

        // Combines multiple loading states (from the QueryClient) into a universal loading state
        isLoadingOrSaving: false,

        // TODO: implement/remove this
        newPostObject: null,
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
        throw new Error('useCount must be used within a VerordeningProvider')
    }
    return context
}

export { VerordeningProvider, useVerordening }
