import {
    FormikCheckboxGroup,
    FormikFileUpload,
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
    RteMenuButton,
    Tooltip,
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

import DynamicObjectSearch from '../../DynamicObjectSearch'
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

const DynamicField = ({
    type,
    isFirst,
    isLocked,
    conditionalField,
    ...field
}: DynamicFieldProps & {
    isFirst?: boolean
    isLocked?: boolean
    model?: Model
}) => {
    const { setFieldValue, values } = useFormikContext<FormikValues>()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    if (type === 'image') {
        // @ts-ignore
        field.defaultValue = null

        // @ts-ignore
        field.onChange = async files => {
            if (!!!files.length) {
                return setFieldValue(field.name, null)
            }

            return setFieldValue(field.name, await fileToBase64(files[0]))
        }

        // @ts-ignore
        field.onDropAccepted = async files => {
            return setFieldValue(
                field.name,
                !!files.length ? await fileToBase64(files[0]) : null
            )
        }

        // @ts-ignore
        if (!!values[field.name]) field.defaultValue = [values[field.name]]
    } else if (type === 'wysiwyg') {
        // @ts-ignore
        field.menuClassName = 'sticky top-24'
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
                {...(type === 'url' && {
                    type: 'url',
                })}
                {...(type === 'select' && {
                    blurInputOnSelect: true,
                    isClearable: !field.required,
                })}
                {...(type === 'wysiwyg' &&
                    'hasAreaSelect' in field &&
                    field.hasAreaSelect && {
                        customExtensions: [Area],
                        customMenuButtons: editor => (
                            <Tooltip label="Binnenkort is het mogelijk om gebiedsaanwijzingen aan te maken, meer informatie bij regieteam Omgevingsbeleid">
                                <span className="cursor-help">
                                    <RteMenuButton
                                        disabled
                                        className="text-pzh-gray-400"
                                        isActive={editor.isActive('area')}
                                        onClick={() =>
                                            setActiveModal(
                                                'objectAreaAnnotate',
                                                {
                                                    editor,
                                                }
                                            )
                                        }
                                        aria-label="Gebiedsaanwijzing"
                                        title="Gebiedsaanwijzing">
                                        <DrawPolygon />
                                    </RteMenuButton>
                                </span>
                            </Tooltip>
                        ),
                        className: `[&_[data-hint-gebiedengroep]]:text-pzh-blue-900 [&_[data-hint-gebiedengroep]]:bg-pzh-blue-10`,
                    })}
                {...field}
            />
        </div>
    )
}

export default DynamicField
