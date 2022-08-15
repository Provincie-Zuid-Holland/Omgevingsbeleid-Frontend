import { FormikTextArea } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'

import { VerordeningChildRead } from '@/types/verordening'

import { useVerordening } from '../../verordeningEditContext'

export interface FormArticleSubSectionsProps {}

const FormArticleSubSections = ({
    section,
}: {
    section: VerordeningChildRead
}) => {
    const { state } = useVerordening()
    const { activeSectionData } = state

    const emptyChild: Partial<VerordeningChildRead> = {
        Children: [],
    }

    const values = activeSectionData ? activeSectionData : emptyChild

    if (values?.Children?.length === 0) {
        return null
    } else if (values?.Children && values.Children?.length > 0) {
        return (
            <div>
                {values.Children.map((subArticle, index) => {
                    return (
                        <FormikTextArea
                            name={`Children[${index}].Inhoud`}
                            value={values.Inhoud}
                        />
                    )
                })}
            </div>
        )
    } else {
        return null
    }
}

export default FormArticleSubSections
