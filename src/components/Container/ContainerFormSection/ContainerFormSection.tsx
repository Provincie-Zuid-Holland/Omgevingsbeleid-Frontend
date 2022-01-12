import { FC } from 'react'

/**
 * Displays the props.titel, props.beschrijving and props.children values within it.
 */

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
        <div className="flex pb-8 mb-8 border-b-2 border-gray-300">
            <div className="w-1/3 pr-20">
                <h2 className="mb-2 text-lg font-bold text-pzh-blue">
                    {/* Algemene informatie */}
                    {titel}
                </h2>
                <p className="text-sm text-gray-700">
                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  */}
                    {beschrijving}
                </p>
            </div>
            <div className="w-2/3">{children}</div>
        </div>
    )
}

export default ContainerFormSection
