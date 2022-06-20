import { FC } from 'react'

export interface RevisionOverviewContainerRightProps {
    innerHtml?: boolean
}

const RevisionOverviewContainerRight: FC<
    RevisionOverviewContainerRightProps
> = ({ children, innerHtml = true }) => (
    <div
        className={`w-full lg:w-1/2 pl-5 ${
            innerHtml ? 'revision-innerhtml' : ''
        }`}>
        {children}
    </div>
)

export default RevisionOverviewContainerRight
