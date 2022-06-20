import { FC } from 'react'

export interface RevisionOverviewContainerLeftProps {
    innerHtml?: boolean
}

const RevisionOverviewContainerLeft: FC<RevisionOverviewContainerLeftProps> = ({
    children,
    innerHtml = true,
}) => (
    <div
        className={`lg:block hidden w-1/2 pr-5 ${
            innerHtml ? 'revision-innerhtml' : ''
        }`}>
        {children}
    </div>
)

export default RevisionOverviewContainerLeft
