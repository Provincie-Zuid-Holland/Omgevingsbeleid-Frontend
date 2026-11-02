import { Badge, cn, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { ArrowUpRightFromSquare } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import type { ModuleShort } from '@/api/fetchers.schemas'
import type { Model } from '@/config/objects/types'

type Status = 'Vigerend' | 'Gearchiveerd' | string

export interface ObjectLineageCardProps {
    model: Model
    id?: string
    title?: string
    status?: Status
    module?: ModuleShort
    validDate?: string
}

const statusToBadgeVariant = (status?: Status) =>
    status === 'Vigerend'
        ? 'green'
        : status === 'Gearchiveerd'
          ? 'gray'
          : 'blue'

const statusToBorderClass = (status?: Status) =>
    status === 'Vigerend'
        ? 'border-pzh-green-100 border border-l-8'
        : status === 'Gearchiveerd'
          ? 'border-pzh-gray-500'
          : 'border-pzh-blue-100'

const toDetailHref = (
    slugOverview: string,
    plural: string,
    uuid?: string,
    module?: ModuleShort
) =>
    module
        ? `/${slugOverview}/${plural}/ontwerpversie/${module.module_id}/${uuid}`
        : `/${slugOverview}/${plural}/${uuid}`

const ObjectLineageCard = ({
    model,
    id,
    title,
    status,
    module,
    validDate,
}: ObjectLineageCardProps) => {
    const { slugOverview, plural, slugOverviewPublic } = model.defaults

    return (
        <div
            className={cn(
                'flex flex-col gap-4 rounded-lg border-l-8 border-pzh-blue-100 bg-pzh-white p-6 shadow-card',
                statusToBorderClass(status)
            )}>
            <Badge
                text={status || ''}
                variant={statusToBadgeVariant(status)}
                upperCase={false}
                className="self-start"
            />

            <Heading level="2" size="m">
                {title}
            </Heading>

            <div className="flex justify-between">
                {module ? (
                    <Text>
                        Module:{' '}
                        <Hyperlink asChild>
                            <Link to={`/muteer/modules/${module.module_id}`}>
                                {module.title}
                            </Link>
                        </Hyperlink>
                    </Text>
                ) : (
                    <Text>{validDate}</Text>
                )}

                {!!slugOverviewPublic && (
                    <Hyperlink asChild icon={ArrowUpRightFromSquare}>
                        <Link
                            to={toDetailHref(
                                slugOverview || '',
                                plural,
                                id,
                                module
                            )}
                            target="_blank"
                            rel="noopener noreferrer">
                            Bekijk deze versie
                        </Link>
                    </Hyperlink>
                )}
            </div>
        </div>
    )
}

export default ObjectLineageCard
