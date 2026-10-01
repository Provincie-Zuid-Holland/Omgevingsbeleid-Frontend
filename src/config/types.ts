import {
    FieldCheckboxGroupProps,
    FieldFileUploadProps,
    FieldInputProps,
    FieldRteProps,
    FieldSelectProps,
} from '@pzh-ui/components'
import { NotificationProps } from '@pzh-ui/react'

import { DynamicObjectSearchProps } from '@/components/DynamicObject/DynamicObjectSearch'
import { FieldAreaAnnotateProps } from '@/components/Form/FieldAreaAnnotate/FieldAreaAnnotate'
import { Validation } from '@/validation/zodSchema'

import { ModelReturnType, ModelType } from './objects/types'

export type DynamicSection<FieldType = string> = {
    /** Description of section */
    description?: string
    /** Notification of section */
    notification?: NotificationProps
    /** Fields in section */
    fields: DynamicField<FieldType>[]
}

type DynamicFieldBase<FieldType> = {
    /** Name of field, this is also the API field */
    name: FieldType | 'Ambtsgebied'
    /** Label of field */
    label: string
    /** Description of field (optional) */
    description?: string | React.JSX.Element
    /** Placeholder of field (optional) */
    placeholder?: string
    /** Is field required (optional) */
    required?: boolean
    /** Field validation (optional) */
    validation?: Validation
    /** Field is optimized */
    optimized?: boolean
    /** Conditional field */
    conditionalField?: FieldType | 'Ambtsgebied'
}

export type DynamicField<FieldType = string> =
    | (DynamicFieldBase<FieldType> & { type: 'text' } & FieldInputProps)
    | (DynamicFieldBase<FieldType> & { type: 'textarea' })
    | (DynamicFieldBase<FieldType> & {
          type: 'wysiwyg'
          hasAreaSelect?: boolean
      } & FieldRteProps)
    | (DynamicFieldBase<FieldType> & { type: 'select' } & FieldSelectProps)
    | (DynamicFieldBase<FieldType> & { type: 'area' } & FieldSelectProps)
    | (DynamicFieldBase<FieldType> & { type: 'url' })
    | (DynamicFieldBase<FieldType> & { type: 'image' } & Omit<
              FieldFileUploadProps,
              'onChange'
          >)
    | (DynamicFieldBase<FieldType> & {
          type: 'connections'
          allowedConnections: {
              /** Type of connection */
              type: ModelType
              /** Key of connection, this corresponds with the API field */
              key: keyof ModelReturnType
          }[]
      })
    | (DynamicFieldBase<FieldType> & {
          type: 'search'
      } & DynamicObjectSearchProps)
    | (DynamicFieldBase<FieldType> & {
          type: 'array'
          fields: DynamicField<FieldType>[]
          arrayLabel?: string
      })
    | (DynamicFieldBase<FieldType> & { type: 'checkbox' } & Omit<
              FieldCheckboxGroupProps,
              'value'
          >)
    | (DynamicFieldBase<FieldType> & {
          type: 'file'
          prefillFieldName?: string
      })
    | (DynamicFieldBase<FieldType> & {
          type: 'areaAnnotate'
      } & FieldAreaAnnotateProps)
    | (DynamicFieldBase<FieldType> & { type: 'theme' } & FieldSelectProps)
    | (DynamicFieldBase<FieldType> & { type: 'annotation' } & FieldSelectProps)
