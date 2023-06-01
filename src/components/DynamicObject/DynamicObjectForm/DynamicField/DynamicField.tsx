import {
    FormikFileUpload,
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import SelectArea from '@/components/SelectArea'
import { DynamicField as DynamicFieldProps } from '@/config/types'
import { fileToBase64 } from '@/utils/file'

const inputFieldMap = {
    text: FormikInput,
    textarea: FormikTextArea,
    wysiwyg: FormikRte,
    select: FormikSelect,
    area: SelectArea,
    url: FormikInput,
    image: FormikFileUpload,
}

const DynamicField = ({
    type,
    isFirst,
    isLocked,
    ...field
}: DynamicFieldProps & { isFirst?: boolean; isLocked?: boolean }) => {
    const { setFieldValue, values } = useFormikContext()

    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    if (type === 'image' && 'accept' in field) {
        // @ts-ignore
        field.defaultValue = null

        // @ts-ignore
        field.onChange = files => {
            if (!!!files.length) return setFieldValue(field.name, null)
        }

        field.onDropAccepted = async files => {
            return setFieldValue(
                field.name,
                !!files.length ? await fileToBase64(files[0]) : null
            )
        }

        // @ts-ignore
        if (!!values[field.name]) field.defaultValue = [values[field.name]]
    }

    const marginTop = isFirst ? '' : 'mt-8'

    return (
        <div className={marginTop}>
            {/* @ts-ignore */}
            <InputField
                type={type === 'url' ? 'url' : undefined}
                disabled={isLocked}
                blurInputOnSelect
                {...field}
            />
        </div>
    )
}

export default DynamicField
