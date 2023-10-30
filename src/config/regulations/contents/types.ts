import * as contents from '.'

export type ContentType = keyof typeof contents

export type Content = {
    /** uuid of content */
    uuid?: string
    /** Type of content */
    type: ContentType
    /** Name of content */
    name: string
    /** Children of content */
    children?: Content[]
} & ListProps

type ListProps =
    | {
          type: 'list' | 'listItem'
          numbering?: 'numeral' | 'alphabetical' | 'roman'
      }
    | {
          type: Exclude<ContentType, 'list' | 'listItem'>
      }
