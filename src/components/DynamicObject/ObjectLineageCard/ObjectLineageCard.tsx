import type { ModuleShort } from '@/api/fetchers.schemas'
import type { Model } from '@/config/objects/types'
import { Badge, cn, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { ArrowUpRightFromSquare } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

type Status = 'Vigerend' | 'Gearchiveerd' | string

export interface ObjectLineageCardProps {
    model: Model
    UUID?: string
    Title?: string
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
        ? `/${slugOverview}/${plural}/ontwerpversie/${module.Module_ID}/${uuid}`
        : `/${slugOverview}/${plural}/${uuid}`

const ObjectLineageCard = ({
    model,
    UUID,
    Title,
    status,
    module,
    validDate,
}: ObjectLineageCardProps) => {
    const { slugOverview, plural } = model.defaults

    return (
        <div
            className={cn(
                'bg-pzh-white shadow-card border-pzh-blue-100 flex flex-col gap-4 rounded-lg border-l-8 p-6',
                statusToBorderClass(status)
            )}>
            <Badge
                text={status || ''}
                variant={statusToBadgeVariant(status)}
                upperCase={false}
                className="self-start"
            />

            <Heading level="2" size="m">
                {Title}
            </Heading>

            <div className="flex justify-between">
                {module ? (
                    <Text>
                        Module:{' '}
                        <Hyperlink asChild>
                            <Link to={`/muteer/modules/${module.Module_ID}`}>
                                {module.Title}
                            </Link>
                        </Hyperlink>
                    </Text>
                ) : (
                    <Text>{validDate}</Text>
                )}

                <Hyperlink asChild icon={ArrowUpRightFromSquare}>
                    <Link
                        to={toDetailHref(
                            slugOverview || '',
                            plural,
                            UUID,
                            module
                        )}
                        target="_blank"
                        rel="noopener noreferrer">
                        Bekijk deze versie
                    </Link>
                </Hyperlink>
            </div>
        </div>
    )
}

export default ObjectLineageCard
