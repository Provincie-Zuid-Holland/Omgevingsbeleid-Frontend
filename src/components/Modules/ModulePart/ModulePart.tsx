import { Text, Tooltip } from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'
import classNames from 'classnames'

import { PolicyTitlesSingular } from '@/constants/policyObjects'

interface ModulePartProps {
    type: PolicyTitlesSingular
    title: string
    status: string
    isLast?: boolean
}

const ModulePart = ({ type, title, status, isLast }: ModulePartProps) => (
    <div
        className={classNames(
            'grid grid-cols-12 px-4 py-1 border-t border-pzh-gray-300',
            {
                'border-b': isLast,
            }
        )}>
        <span className="col-span-2 capitalize truncate">{type}</span>
        <Text type="body" className="font-bold col-span-8 truncate">
            {title}
        </Text>
        <span className="col-span-1 italic">{status}</span>
        <Tooltip label="Onderdeel niet (meer) meenemen in de module">
            <button type="button" className="col-span-1 ml-auto">
                <span className="sr-only">verwijderen</span>
                <TrashCan size={20} className="text-pzh-red" />
            </button>
        </Tooltip>
    </div>
)

export default ModulePart
