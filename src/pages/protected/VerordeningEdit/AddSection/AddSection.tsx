import React, { useState } from 'react'

import FormChapter from '../Form/FormChapter'

export interface AddSectionProps {}

const AddSection = ({
    show,
    indexPath,
    type,
}: {
    show: boolean
    indexPath: number[]
    type: 'Hoofdstuk' | 'Paragraaf' | 'Artikel' | 'Lid'
}) => {
    const [isAddingASection, setIsAddingASection] = useState(false)

    if (!show) {
        return null
    } else if (!isAddingASection) {
        return (
            <div onClick={() => setIsAddingASection(!isAddingASection)}>
                Add section {indexPath.join('')}
            </div>
        )
    } else if (isAddingASection && type === 'Hoofdstuk') {
        return <FormChapter type={type} />
    } else {
        return null
    }
}

export default AddSection
