import { FieldFileUploadProps, FieldRteProps } from '@pzh-ui/components'

import { Validation } from '@/validation/zodSchema'

import { ModelReturnType, ModelType } from './objects/types'

export type DynamicSection<FieldType = string> = {
    /** Title of section */
    title: string
    /** Description of section */
    description?: string
    /** Fields in section */
    fields: DynamicField<FieldType>[]
}

export type DynamicField<FieldType = string> = {
    /** Name of field, this is also the API field */
    name: FieldType
    /** Label of field */
    label: string
    /** Description of field (optional) */
    description?: string | JSX.Element
    /** Placeholder of field (optional) */
    placeholder?: string
    /** Type of field */
    type:
        | 'text'
        | 'textarea'
        | 'wysiwyg'
        | 'select'
        | 'area'
        | 'url'
        | 'image'
        | 'connections'
    /** Is field required (optional) */
    required?: boolean
    /** Field validation (optional) */
    validation?: Validation
    /** Field is optimized */
    optimized?: boolean
} & (
    | { type: 'select'; options: { label: string; value: string }[] }
    | {
          type: Exclude<
              | 'text'
              | 'textarea'
              | 'wysiwyg'
              | 'area'
              | 'url'
              | 'image'
              | 'connections',
              'select'
          >
      }
) &
    (
        | ({
              type: 'image'
          } & Omit<FieldFileUploadProps, 'onChange'>)
        | {
              type: Exclude<
                  | 'text'
                  | 'textarea'
                  | 'wysiwyg'
                  | 'area'
                  | 'url'
                  | 'select'
                  | 'connections',
                  'image'
              >
          }
    ) &
    (
        | ({
              type: 'wysiwyg'
          } & FieldRteProps)
        | {
              type: Exclude<
                  | 'text'
                  | 'textarea'
                  | 'image'
                  | 'area'
                  | 'url'
                  | 'select'
                  | 'connections',
                  'wysiwyg'
              >
          }
    ) &
    (
        | {
              type: 'connections'
              allowedConnections: {
                  /** Type of connection */
                  type: ModelType
                  /** Key of connection, this corresponds with the API field */
                  key: keyof ModelReturnType
              }[]
          }
        | {
              type: Exclude<
                  | 'text'
                  | 'textarea'
                  | 'wysiwyg'
                  | 'area'
                  | 'url'
                  | 'image'
                  | 'select',
                  'connections'
              >
          }
    )
