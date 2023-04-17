import { AngleRight } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useState } from 'react'
import { useId } from 'react-aria'

interface TableAccordionProps {
    children: React.ReactNode
    ariaLabel: string
    titleHeader: string
    cellHeaders: string[]
}

interface TableAccordionRowProps {
    title: string
    cells: string[]
    children: React.ReactNode
}

const TableAccordion = ({
    children,
    ariaLabel,
    titleHeader,
    cellHeaders,
}: TableAccordionProps) => {
    const id = useId()

    return (
        <div role="grid" aria-label={ariaLabel}>
            <div role="rowgroup" className="border-t">
                <div
                    role="row"
                    className="p-2 flex w-full text-left text-pzh-red font-semibold">
                    <div role="columnheader" className="w-full grow-2">
                        {titleHeader}
                    </div>

                    {cellHeaders.map((header, index) => (
                        <div
                            role="columnheader"
                            key={`${id}-${index}`}
                            className="grow-0 shrink-0 basis-[150px]">
                            {header}
                        </div>
                    ))}
                </div>
            </div>

            <div role="rowgroup">{children}</div>
        </div>
    )
}

TableAccordion.Row = function Row({
    title,
    cells,
    children,
}: TableAccordionRowProps) {
    const id = useId()
    const [isOpen, setIsOpen] = useState(false)

    const panelId = `${id}-panel`
    const buttonId = `${id}-button`
    const titleId = `${id}-title`

    return (
        <div className="border-t">
            <div role="row">
                <button
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full py-2 px-2 text-left relative hover:bg-gray-200 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}>
                    <span
                        role="rowheader"
                        id={titleId}
                        className="w-full grow-2 font-semibold">
                        {title}
                    </span>

                    {cells.map((cell, index) => (
                        <span
                            role="gridcell"
                            key={`${id}-${index}`}
                            className="grow-0 shrink-0 basis-[150px]">
                            {cell}
                        </span>
                    ))}

                    <AngleRight
                        className={classNames(
                            'absolute right-2 top-1/2 -translate-y-1/2',
                            isOpen ? '-rotate-90' : 'rotate-90'
                        )}
                    />
                </button>
            </div>

            <section
                className="p-2"
                id={panelId}
                aria-labelledby={titleId}
                hidden={!isOpen}>
                {isOpen && children}
            </section>
        </div>
    )
}

export default TableAccordion
