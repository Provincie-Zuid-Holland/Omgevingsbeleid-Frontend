import { FC } from 'react'
interface ContainerProps {
    hide?: boolean
    titel?: string
    beschrijving?: string
}

const ContainerFormSection: FC<ContainerProps> = ({
    hide,
    titel,
    beschrijving,
    children,
}) => {
    if (hide) return null

    return (
        <div className="flex pb-8 mb-8 border-b-2 border-gray-300 container-form-section">
            <div className="w-1/3 pr-20">
                <h2 className="mb-2 text-lg font-bold text-pzh-blue">
                    {titel}
                </h2>
                <p className="text-sm text-gray-700">{beschrijving}</p>
            </div>
            <div className="w-2/3">{children}</div>
        </div>
    )
}

export default ContainerFormSection
