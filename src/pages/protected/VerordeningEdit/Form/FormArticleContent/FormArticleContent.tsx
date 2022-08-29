import { FormikTextArea, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { createVerordeningLid } from '@/utils/verordening'

import { ActiveSectionData } from '../../verordeningEditContext'

export interface FormArticleContentProps {}

const FormArticleContent = () => {
    const { values, setFieldValue } = useFormikContext<ActiveSectionData>()

    const sectionHasNoChildren =
        values?.Children?.length === undefined || values?.Children?.length === 0

    const transformArticleContentToSubItem = async () => {
        try {
            const newCreatedLid = await createVerordeningLid(
                values?.Inhoud || ''
            )
            if (!newCreatedLid) return
            setFieldValue('Inhoud', '')
            setFieldValue('Children', [newCreatedLid])
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            {sectionHasNoChildren ? (
                <div>
                    <FormikTextArea name="Inhoud" className="pr-6" />
                    <Text type="body-small">Dit artikel heeft geen leden.</Text>
                    <Text type="body-small">
                        <button
                            type="button"
                            className="ml-1 underline"
                            onClick={transformArticleContentToSubItem}>
                            Zet bovenstaand veld om naar lid 1.
                        </button>
                    </Text>
                </div>
            ) : null}
        </div>
    )
}

export default FormArticleContent
