import {
    FieldCheckboxGroupProps,
    FieldFileUploadProps,
    FieldRteProps,
} from '@pzh-ui/components'

import { DynamicObjectSearchProps } from '@/components/DynamicObject/DynamicObjectSearch'
import { Validation } from '@/validation/zodSchema'

import { ModelReturnType, ModelType } from './objects/types'

type DynamicFieldType =
    | 'text'
    | 'textarea'
    | 'wysiwyg'
    | 'select'
    | 'area'
    | 'url'
    | 'image'
    | 'connections'
    | 'search'
    | 'array'
    | 'checkbox'

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
    name: FieldType | 'Ambtsgebied'
    /** Label of field */
    label: string
    /** Description of field (optional) */
    description?: string | JSX.Element
    /** Placeholder of field (optional) */
    placeholder?: string
    /** Type of field */
    type: DynamicFieldType
    /** Is field required (optional) */
    required?: boolean
    /** Field validation (optional) */
    validation?: Validation
    /** Field is optimized */
    optimized?: boolean
    /** Conditional field */
    conditionalField?: FieldType | 'Ambtsgebied'
} & SelectProps &
    ImageProps &
    WysiwygProps &
    ConnectionsProps &
    SearchProps &
    ArrayProps &
    CheckboxProps

type SelectProps =
    | { type: 'select'; options: { label: string; value: string }[] }
    | {
          type: Exclude<DynamicFieldType, 'select'>
      }

type ImageProps =
    | ({
          type: 'image'
      } & Omit<FieldFileUploadProps, 'onChange'>)
    | {
          type: Exclude<DynamicFieldType, 'image'>
      }

type WysiwygProps =
    | ({
          type: 'wysiwyg'
          hasAreaSelect?: boolean
      } & FieldRteProps)
    | {
          type: Exclude<DynamicFieldType, 'wysiwyg'>
      }

type ConnectionsProps =
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
          type: Exclude<DynamicFieldType, 'connections'>
      }

type SearchProps =
    | ({
          type: 'search'
      } & DynamicObjectSearchProps)
    | {
          type: Exclude<DynamicFieldType, 'search'>
      }

type ArrayProps =
    | { type: 'array'; fields: DynamicField[]; arrayLabel?: string }
    | {
          type: Exclude<DynamicFieldType, 'array'>
      }

type CheckboxProps =
    | ({ type: 'checkbox' } & Omit<FieldCheckboxGroupProps, 'value'>)
    | {
          type: Exclude<DynamicFieldType, 'checkbox'>
      }
