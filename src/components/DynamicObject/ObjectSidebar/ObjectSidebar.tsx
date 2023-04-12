import { Text } from '@pzh-ui/components'

import BackButton from '@/components/BackButton'

import ObjectDetails from '../ObjectDetails/ObjectDetails'

interface ObjectSidebarProps {
    /** Type of object */
    type: string
    /** Start date of validity */
    date?: Date
    /** Amount of revisions */
    revisions?: number
}

const ObjectSidebar = ({ type, date, revisions }: ObjectSidebarProps) => (
    <aside>
        <BackButton />

        <div className="hidden xl:block">
            <div>
                <Text type="body-bold">Type</Text>
                <Text type="span" className="block">
                    {type}
                </Text>
            </div>

            <ObjectDetails date={date} revisions={revisions} />
        </div>
    </aside>
)

export default ObjectSidebar
