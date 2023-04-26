import {
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
} from '@pzh-ui/components'

import SelectArea from '@/components/SelectArea'
import { DynamicField as DynamicFieldProps } from '@/config/types'

const inputFieldMap = {
    text: FormikInput,
    textarea: FormikTextArea,
    wysiwyg: FormikRte,
    select: FormikSelect,
    area: SelectArea,
    url: FormikInput,
}

const DynamicField = ({
    type,
    isFirst,
    isLocked,
    ...field
}: DynamicFieldProps & { isFirst?: boolean; isLocked?: boolean }) => {
    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    const marginTop = isFirst ? '' : 'mt-8'

    return (
        <div className={marginTop}>
            <InputField
                type={type === 'url' ? 'url' : undefined}
                disabled={isLocked}
                {...field}
            />
        </div>
    )
}

export default DynamicField
