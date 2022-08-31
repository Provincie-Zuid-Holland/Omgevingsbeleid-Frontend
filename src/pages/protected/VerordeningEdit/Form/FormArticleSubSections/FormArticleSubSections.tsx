import { FormikTextArea, Text } from '@pzh-ui/components'
import { Plus, TrashCan } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'

import { createVerordeningLid } from '@/utils/verordening'

import { ActiveSectionData } from '../../verordeningEditContext'

export interface FormArticleSubSectionsProps {}

const FormArticleSubSections = () => {
    const { values, setFieldValue } = useFormikContext<ActiveSectionData>()

    const subItemToArticleContent = () => {
        if (
            values &&
            Array.isArray(values.Children) &&
            values.Children.length === 1
        ) {
            const contentFirstSubItem = values.Children[0]?.Inhoud
            setFieldValue('Children', undefined)
            setFieldValue('Inhoud', contentFirstSubItem)
        }
    }

    const removeSubItem = (index: number) => {
        if (
            values &&
            Array.isArray(values.Children) &&
            values.Children.length >= index - 1
        ) {
            const newChildren = [...values.Children]
            newChildren.splice(index, 1)
            setFieldValue('Children', newChildren)
        }
    }

    if (values?.Children && values.Children?.length > 0) {
        return (
            <div>
                {values.Children.map((subArticle, index) => {
                    if (typeof values.Children === 'undefined') return null

                    return (
                        <div className="relative" key={subArticle!.UUID}>
                            <FormikTextArea
                                key={subArticle.UUID}
                                name={`Children[${index}].Inhoud`}
                            />
                            {index > 0 && (
                                <div className="absolute inset-y-0 right-0 flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeSubItem(index)}
                                        className="p-2 my-auto -mr-[16px] bg-white rounded shadow">
                                        <TrashCan />
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}

                {values?.Children?.length === 1 ? (
                    <div className="flex items-center justify-between mt-2">
                        <AddSubItem />
                        <Text type="body-small">
                            Dit artikel bestaat uit leden.
                            <button
                                type="button"
                                className="ml-1 underline"
                                onClick={subItemToArticleContent}>
                                Zet lid 1 om naar artikelinhoud
                            </button>
                        </Text>
                    </div>
                ) : values?.Children?.length > 1 ? (
                    <AddSubItem />
                ) : null}
            </div>
        )
    } else {
        return null
    }
}

const AddSubItem = () => {
    const { values, setFieldValue } = useFormikContext<ActiveSectionData>()

    const addSubItem = async () => {
        try {
            const newCreatedLid = await createVerordeningLid({
                Inhoud: '',
            })
            if (!newCreatedLid) return
            setFieldValue('Children', [
                ...(values?.Children || []),
                newCreatedLid,
            ])
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Text type="body-small">
            <button
                type="button"
                className="flex ml-1 underline"
                onClick={addSubItem}>
                <Plus className="mr-1" /> Lid toevoegen
            </button>
        </Text>
    )
}

export default FormArticleSubSections
