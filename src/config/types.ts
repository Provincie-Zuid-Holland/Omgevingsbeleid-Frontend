import { FieldFileUploadProps, FieldRteProps } from '@pzh-ui/components'

import { Validation } from '@/validation/zodSchema'

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
    type: 'text' | 'textarea' | 'wysiwyg' | 'select' | 'area' | 'url' | 'image'
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
              'text' | 'textarea' | 'wysiwyg' | 'area' | 'url' | 'image',
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
                  'text' | 'textarea' | 'wysiwyg' | 'area' | 'url' | 'select',
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
                  'text' | 'textarea' | 'image' | 'area' | 'url' | 'select',
                  'wysiwyg'
              >
          }
    )
