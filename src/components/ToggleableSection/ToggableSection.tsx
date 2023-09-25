import { ReactNode, useState } from 'react'

import { AngleDown, AngleUp } from '@pzh-ui/icons'

/**
 * Component that renders the ToggleableSection component which displays a button which either contains the options of the legenda or Achtergrondlaag of the map when clicked on.
 *
 * @param {object} children - Parameter containing the collection within the component.
 * @param {string} title - Parameter containing the title of the component.
 * @param {number} positionTop - Parameter containing the top position of the component.
 */

interface ToggleableSectionProps {
    children: ReactNode
    title: string
    positionTop?: boolean
}

const ToggleableSection = ({
    children,
    title,
    positionTop,
}: ToggleableSectionProps) => {
    const [open, setOpen] = useState(true)

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className={`flex w-full items-center justify-between border-b border-pzh-gray-300 bg-pzh-gray-100 p-5 text-left ${
                    positionTop ? '' : 'border-t'
                }`}>
                <span className="font-semibold">{title}</span>
                {open ? <AngleUp /> : <AngleDown />}
            </button>
            {open ? <div className="py-2">{children}</div> : null}
        </div>
    )
}

export default ToggleableSection
