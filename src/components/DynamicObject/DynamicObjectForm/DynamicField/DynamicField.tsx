import {
    FormikFileUpload,
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
    RteMenuButton,
} from '@pzh-ui/components'
import { DrawPolygon } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'

import FieldArray from '@/components/Form/FieldArray'
import FieldConnections from '@/components/Form/FieldConnections'
import FieldSelectArea from '@/components/Form/FieldSelectArea'
import { Model } from '@/config/objects/types'
import { DynamicField as DynamicFieldProps } from '@/config/types'
import useModalStore from '@/store/modalStore'
import { fileToBase64 } from '@/utils/file'

import DynamicObjectSearch from '../../DynamicObjectSearch'
import { Area, AREA_DATA_ATTRS } from './extensions/area'

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
}

const DynamicField = ({
    type,
    isFirst,
    isLocked,
    ...field
}: DynamicFieldProps & {
    isFirst?: boolean
    isLocked?: boolean
    model?: Model
}) => {
    const { setFieldValue, values } = useFormikContext()
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

    const marginTop = isFirst ? '' : 'mt-8'

    return (
        <div className={marginTop}>
            {/* @ts-ignore */}
            <InputField
                type={type === 'url' ? 'url' : undefined}
                disabled={isLocked}
                {...(type === 'select' && {
                    blurInputOnSelect: true,
                })}
                {...(type === 'wysiwyg' && {
                    customExtensions: [Area],
                    customMenuButtons: editor => (
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
                        </RteMenuButton>
                    ),
                    className: `[&_[${[
                        AREA_DATA_ATTRS.group,
                    ]}]]:text-pzh-blue-900 [&_[${[
                        AREA_DATA_ATTRS.group,
                    ]}]]:bg-pzh-blue-10`,
                })}
                {...field}
            />
        </div>
    )
}

export default DynamicField
