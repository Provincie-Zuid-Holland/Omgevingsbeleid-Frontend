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
import toBase64 from '@/utils/toBase64'

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
    const { setFieldValue } = useFormikContext()

    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    if (type === 'image' && 'accept' in field) {
        // @ts-ignore
        field.onChange = files => {
            if (!!!files.length) return setFieldValue(field.name, null)
        }

        field.onDropAccepted = async files => {
            return setFieldValue(
                field.name,
                !!files.length ? await toBase64(files[0]) : null
            )
        }
    }

    const marginTop = isFirst ? '' : 'mt-8'

    return (
        <div className={marginTop}>
            {/* @ts-ignore */}
            <InputField
                type={type === 'url' ? 'url' : undefined}
                disabled={isLocked}
                {...field}
            />
        </div>
    )
}

export default DynamicField
