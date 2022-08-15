import { FormikTextArea, Text } from '@pzh-ui/components'

import { VerordeningChildRead } from '@/types/verordening'

import { useVerordening } from '../../verordeningEditContext'

export interface FormArticleContentProps {}

const FormArticleContent = ({ section }: { section: VerordeningChildRead }) => {
    const { state, dispatch } = useVerordening()
    const { activeSectionData } = state

    const emptyChild: Partial<VerordeningChildRead> = {
        Children: [],
        Inhoud: '',
    }

    const values = activeSectionData ? activeSectionData : emptyChild

    return (
        <div>
            <FormikTextArea
                name="Inhoud"
                className="pr-6"
                value={values.Inhoud}
            />
            {section.Children.length === 0 ? (
                <div>
                    <Text type="body-small">Dit artikel heeft geen leden.</Text>
                    <Text type="body-small">
                        <button
                            type="button"
                            className="ml-1 underline"
                            onClick={() =>
                                dispatch({
                                    type: 'transformArticleContentToSubItem',
                                    payload: activeSectionData,
                                })
                            }>
                            Zet bovenstaand veld om naar lid 1.
                        </button>
                    </Text>
                </div>
            ) : null}
        </div>
    )
}

export default FormArticleContent
