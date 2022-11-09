import { Plus } from '@pzh-ui/icons'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'

import FormArticleContent from '../Form/FormArticleContent'
import FormArticleSubSections from '../Form/FormArticleSubSections'
import FormNumberAndTitle from '../Form/FormNumberAndTitle'
import FormSubmitOrCancel from '../Form/FormSubmitOrCancel'
import { useVerordening } from '../verordeningEditContext'

export interface AddSectionProps {}

const AddSection = ({
    show,
    indexPath,
    typeToAdd,
    marginLeft,
}: {
    show: boolean
    indexPath: number[]
    typeToAdd: 'Hoofdstuk' | 'Paragraaf' | 'Afdeling' | 'Artikel'
    marginLeft?: boolean
}) => {
    const [isAddingASection, setIsAddingASection] = useState(false)
    const { state, dispatch } = useVerordening()
    const { newSection } = state

    useEffect(() => {
        if (newSection === null) {
            setIsAddingASection(false)
        }
    }, [newSection])

    if (!show) {
        return null
    } else if (!isAddingASection) {
        return (
            <div
                className={classNames(
                    `flex items-center justify-center p-4 my-2 transition duration-150 ease-in border border-opacity-50 border-dashed rounded text-pzh-green bg-opacity-20 hover:bg-opacity-25 hover:text-pzh-green-dark bg-pzh-green-light border-pzh-green-light`,
                    {
                        'ml-4': marginLeft,
                        'cursor-pointer': newSection === null,
                        'cursor-not-allowed': newSection !== null,
                    }
                )}
                onClick={() => {
                    if (newSection !== null) return

                    setIsAddingASection(!isAddingASection)
                    dispatch({
                        type: 'setEditingSectionIndexPath',
                        payload: indexPath,
                    })
                    dispatch({
                        type: 'setNewSection',
                        payload: typeToAdd,
                    })
                }}>
                <Plus />
            </div>
        )
    } else if (isAddingASection) {
        return (
            <Fragment>
                <FormNumberAndTitle marginLeft={marginLeft} type={typeToAdd}>
                    <FormSubmitOrCancel
                        reset={() => setIsAddingASection(false)}
                    />
                </FormNumberAndTitle>
                {typeToAdd === 'Artikel' ? (
                    <Fragment>
                        <FormArticleContent />
                        <FormArticleSubSections />
                    </Fragment>
                ) : null}
            </Fragment>
        )
    } else {
        return null
    }
}

export default AddSection
