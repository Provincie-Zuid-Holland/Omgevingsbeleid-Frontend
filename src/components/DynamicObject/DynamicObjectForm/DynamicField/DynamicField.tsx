import {
    FormikCheckboxGroup,
    FormikFileUpload,
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
    RteMenuButton,
} from '@pzh-ui/components'
import { DrawPolygon } from '@pzh-ui/icons'
import clsx from 'clsx'
import { FormikValues, useFormikContext } from 'formik'

import FieldArray from '@/components/Form/FieldArray'
import FieldConnections from '@/components/Form/FieldConnections'
import FieldFile from '@/components/Form/FieldFile'
import FieldSelectArea from '@/components/Form/FieldSelectArea'
import { Model } from '@/config/objects/types'
import { DynamicField as DynamicFieldProps } from '@/config/types'
import useModalStore from '@/store/modalStore'
import { fileToBase64 } from '@/utils/file'

import DynamicObjectSearch, { Option } from '../../DynamicObjectSearch'
import { Area } from './extensions/area'

const inputFieldMap = {
    text: FormikInput,
    textarea: FormikTextArea,
    wysiwyg: FormikRte,
    select: FormikSelect,
    area: FieldSelectArea,
    url: FormikInput,
    image: FormikFileUpload,
    connections: FieldConnections,
    search: DynamicObjectSearch,
    array: FieldArray,
    checkbox: FormikCheckboxGroup,
    file: FieldFile,
}

type Props = DynamicFieldProps & {
    isFirst?: boolean
    isLocked?: boolean
    model?: Model
}

const DynamicField = ({
    type,
    isFirst,
    isLocked,
    conditionalField,
    ...field
}: Props) => {
    const { setFieldValue, values } = useFormikContext<FormikValues>()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    // IMAGE
    if (type === 'image') {
        const imageField = field as Extract<
            DynamicFieldProps,
            { type: 'image' }
        >

        imageField.defaultValue = values[imageField.name]
            ? [values[imageField.name]]
            : undefined

        // @ts-ignore
        imageField.onChange = async (files: File[]) => {
            if (!files.length) return setFieldValue(imageField.name, null)
            return setFieldValue(imageField.name, await fileToBase64(files[0]))
        }

        imageField.onDropAccepted = async (files: File[]) => {
            return setFieldValue(
                imageField.name,
                files.length ? await fileToBase64(files[0]) : null
            )
        }
    }

    // WYSIWYG
    if (type === 'wysiwyg') {
        const wysiwygField = field as Extract<
            DynamicFieldProps,
            { type: 'wysiwyg' }
        >

        if (!wysiwygField.menuClassName) {
            wysiwygField.menuClassName = 'sticky top-24'
        }
    }

    // SEARCH
    if (type === 'search') {
        const searchField = field as Extract<
            DynamicFieldProps,
            { type: 'search' }
        >
        if (searchField.defaultValue) {
            searchField.initialOptions = Array.isArray(searchField.defaultValue)
                ? (searchField.defaultValue as Option[])
                : [searchField.defaultValue as Option]
        }
    }

    return (
        <div
            className={clsx({
                'mt-8': !isFirst,
                hidden:
                    conditionalField &&
                    Array.isArray(values[conditionalField]) &&
                    !!values[conditionalField].length,
            })}>
            {/* @ts-ignore */}
            <InputField
                disabled={isLocked}
                {...(type === 'url' && { type: 'url' })}
                {...(type === 'select' && {
                    blurInputOnSelect: true,
                    isClearable: !field.required,
                })}
                {...(type === 'wysiwyg' &&
                    'hasAreaSelect' in field &&
                    field.hasAreaSelect && {
                        customExtensions: [Area],
                        customMenuButtons: editor => [
                            <RteMenuButton
                                isActive={editor.isActive('area')}
                                onClick={() =>
                                    setActiveModal('objectAreaAnnotate', {
                                        editor,
                                    })
                                }
                                aria-label="Gebiedsaanwijzing"
                                title="Gebiedsaanwijzing">
                                <DrawPolygon />
                            </RteMenuButton>,
                        ],
                        className: `[&_[data-hint-type="gebiedsaanwijzing"]]:text-pzh-blue-900 [&_[data-hint-type="gebiedsaanwijzing"]]:bg-pzh-yellow-10 [&_[data-hint-type="gebiedsaanwijzing"]]:no-underline [&_[data-hint-type="gebiedsaanwijzing"]]:border [&_[data-hint-type="gebiedsaanwijzing"]]:border-pzh-gray-300 [&_[data-hint-type="gebiedsaanwijzing"]]:rounded-sm [&_[data-hint-type="gebiedsaanwijzing"]]:px-0.5`,
                    })}
                {...field}
            />
        </div>
    )
}

export default DynamicField
