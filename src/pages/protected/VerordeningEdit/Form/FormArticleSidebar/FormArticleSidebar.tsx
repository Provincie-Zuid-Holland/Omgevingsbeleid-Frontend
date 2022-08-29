import { Text } from '@pzh-ui/components'
import { AngleDown, AngleUp } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import React, { FC, useState } from 'react'

import { ActiveSectionData } from '../../verordeningEditContext'

export interface FormArticleSidebarProps {}

function FormArticleSidebar({}: FormArticleSidebarProps) {
    const { values } = useFormikContext<ActiveSectionData>()

    if (!values) return null

    return (
        <div>
            <SidebarContainer
                title={`Eigenschappen Artikel ${values.Volgnummer}`}>
                Test
            </SidebarContainer>
        </div>
    )
}

interface SidebarContainerProps {
    title: string
}

const SidebarContainer: FC<SidebarContainerProps> = ({ children, title }) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className="rounded-b shadow-md">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-4 rounded-t bg-pzh-blue hover:bg-pzh-blue-dark">
                <Text className="font-bold text-white">{title}</Text>
                {isOpen ? (
                    <AngleDown className="text-white" size={18} />
                ) : (
                    <AngleUp className="text-white" size={18} />
                )}
            </button>
            {isOpen && <div className="p-4 bg-white">{children}</div>}
        </div>
    )
}

export default FormArticleSidebar
