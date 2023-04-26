import { Validation } from '@/validation/zodSchema'

export type DynamicSection<FieldType = any> = {
    /** Title of section */
    title: string
    /** Description of section */
    description?: string
    /** Fields in section */
    fields: DynamicField<FieldType>[]
}

export type DynamicField<FieldType = any> = {
    /** Name of field, this is also the API field */
    name: FieldType
    /** Label of field */
    label: string
    /** Description of field (optional) */
    description?: string | JSX.Element
    /** Placeholder of field (optional) */
    placeholder?: string
    /** Type of field */
    type: 'text' | 'textarea' | 'wysiwyg' | 'select' | 'area' | 'url'
    /** Is field required (optional) */
    required?: boolean
    /** Field validation (optional) */
    validation?: Validation
} & (
    | { type: 'select'; options: { label: string; value: string }[] }
    | {
          type: Exclude<
              'text' | 'textarea' | 'wysiwyg' | 'area' | 'url',
              'select'
          >
      }
)
