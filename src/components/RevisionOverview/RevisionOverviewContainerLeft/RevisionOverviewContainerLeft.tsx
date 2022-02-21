import { FC } from 'react'

export interface RevisionOverviewContainerLeftProps {}

const RevisionOverviewContainerLeft: FC = ({ children }) => (
    <div className={`lg:block hidden w-1/2 pr-5 revision-innerhtml`}>
        {children}
    </div>
)

export default RevisionOverviewContainerLeft
