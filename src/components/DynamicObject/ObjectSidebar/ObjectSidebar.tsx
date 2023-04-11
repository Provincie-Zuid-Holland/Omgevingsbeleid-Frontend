import { Text } from '@pzh-ui/components'

import BackButton from '@/components/BackButton'
import formatDate from '@/utils/formatDate'

interface ObjectSidebarProps {
    /** Type of object */
    type: string
    /** Start date of validity */
    date?: Date
}

const ObjectSidebar = ({ type, date }: ObjectSidebarProps) => (
    <aside>
        <BackButton />

        <div>
            <Text type="body-bold">Type</Text>
            <Text type="span" className="block">
                {type}
            </Text>
        </div>

        {date && (
            <div className="mt-4">
                <Text type="body-bold">Status</Text>
                <Text type="span" className="block">
                    Vigerend
                    <br />
                    sinds {formatDate(date, 'd MMMM yyyy')}
                </Text>
            </div>
        )}
    </aside>
)

export default ObjectSidebar
