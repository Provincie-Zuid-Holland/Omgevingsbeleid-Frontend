import {
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
} from '@pzh-ui/components'

import { DynamicField as DynamicFieldProps } from '@/config/objects/types'

const inputFieldMap = {
    text: FormikInput,
    textarea: FormikTextArea,
    wysiwyg: FormikRte,
    select: FormikSelect,
}

const DynamicField = ({
    type,
    isFirst,
    ...field
}: DynamicFieldProps & { isFirst?: boolean }) => {
    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    const marginTop = isFirst ? '' : 'mt-8'

    return (
        <div className={marginTop}>
            <InputField {...field} />
        </div>
    )
}

export default DynamicField
