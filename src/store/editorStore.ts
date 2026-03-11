import { Editor } from '@tiptap/react'
import { create } from 'zustand'

import { cleanEmptyRteNodes } from '@/utils/removeEmptyInlineTags'

type EditorEntry = {
    editor: Editor
    setValue: (value: string) => void
}

type RteEditorStore = {
    editors: Record<string, EditorEntry>
    registerEditor: (
        key: string,
        editor: Editor,
        setValue: (value: string) => void
    ) => void
    unregisterEditor: (key: string) => void
    clearEmptyTags: (key: string) => void
}

export const useRteEditorStore = create<RteEditorStore>((set, get) => ({
    editors: {},

    registerEditor: (key, editor, setValue) =>
        set(state => ({
            editors: {
                ...state.editors,
                [key]: { editor, setValue },
            },
        })),

    unregisterEditor: key =>
        set(state => {
            const editors = { ...state.editors }
            delete editors[key]
            return { editors }
        }),

    clearEmptyTags: key => {
        const entry = get().editors[key]
        if (!entry) return

        const cleanedHtml = cleanEmptyRteNodes(entry.editor.getHTML())

        entry.editor.commands.setContent(cleanedHtml, false)
        entry.setValue(cleanedHtml === '<p></p>' ? '' : cleanedHtml)
    },
}))
