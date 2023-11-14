import * as contents from '.'

export type ContentType = keyof typeof contents

export interface Content {
    /** uuid of content */
    uuid?: string
    /** Type of content */
    type: ContentType
    /** Name of content */
    name: string
    /** Children of content */
    children?: Content[]
}
