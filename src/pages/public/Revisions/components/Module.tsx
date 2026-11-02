import { useMemo } from 'react'

import {
    Badge,
    Heading,
    Hyperlink,
    TabItem,
    Tabs,
    Text,
    Tooltip,
} from '@pzh-ui/components'

import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { usePublicModulesGetPublicModuleOverview } from '@/api/fetchers'
import {
    PublicModuleObjectShort,
    PublicModuleShort,
} from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import {
    getPublicObjectActionIcon,
    getPublicObjectActionText,
} from '@/utils/dynamicObject'
import { getModuleStatusColor } from '@/utils/module'

const availableTypes: ModelType[] = [
    'visie_algemeen',
    'ambitie',
    'beleidsdoel',
    'beleidskeuze',
    'programma_algemeen',
    'maatregel',
]
type AvailableType = (typeof availableTypes)[number]

const Module = ({
    module_id,
    title,
    description,
    status,
}: PublicModuleShort) => {
    const { data, isLoading } =
        usePublicModulesGetPublicModuleOverview(module_id)

    /**
     * Disable tabs which have no objects
     */
    const disabledKeys = useMemo(() => {
        if (!data?.objects) return availableTypes

        const availableKeys = new Set<AvailableType>()

        data.objects.forEach(({ object_type }) => {
            const model = models[object_type as ModelType]
            if (model?.defaults.singular) {
                availableKeys.add(model.defaults.singular)
            }
        })

        return availableTypes.filter(type => !availableKeys.has(type))
    }, [data?.objects])

    /**
     * Group objects by availableType
     */
    const groupedObjects = useMemo(() => {
        if (!data?.objects)
            return Object.fromEntries(availableTypes.map(type => [type, []]))

        const groups = Object.fromEntries(
            availableTypes.map(
                type => [type, []] as [AvailableType, PublicModuleObjectShort[]]
            )
        )

        data.objects.forEach(object => {
            const model = models[object.object_type as ModelType]
            if (
                model?.defaults.singular &&
                availableTypes.includes(model.defaults.singular)
            ) {
                groups[model.defaults.singular].push(object)
            }
        })

        // Sort each group
        Object.values(groups).forEach(group => {
            group.sort((a, b) => {
                return (
                    (a.module_object_context?.action || '').localeCompare(
                        b.module_object_context?.action || ''
                    ) || a.title.localeCompare(b.title)
                )
            })
        })

        return groups
    }, [data?.objects])

    return (
        <Container>
            <div className="col-span-6 grid gap-4">
                <div>
                    <span className="text-pzh-gray-600">Module</span>
                    <div className="flex items-center">
                        <Heading level="2">{title}</Heading>
                        <Badge
                            text={status?.status.replace('-', ' ') || ''}
                            variant={getModuleStatusColor(status?.status)}
                            upperCase={false}
                            className="-mt-2 ml-3 whitespace-nowrap"
                        />
                    </div>
                </div>
                {description && <Text>{description}</Text>}
                <div>
                    {!isLoading ? (
                        <Tabs disabledKeys={disabledKeys}>
                            {availableTypes.map(type => (
                                <TabItem
                                    title={
                                        models[type].defaults.pluralCapitalize
                                    }
                                    key={type}>
                                    <div className="mt-3 flex flex-col gap-2">
                                        {groupedObjects[type].map(object => (
                                            <RevisionItem
                                                key={
                                                    object.object_type +
                                                    object.object_id
                                                }
                                                {...object}
                                            />
                                        ))}
                                    </div>
                                </TabItem>
                            ))}
                        </Tabs>
                    ) : (
                        <div className="flex justify-center">
                            <LoaderSpinner />
                        </div>
                    )}
                </div>
            </div>
        </Container>
    )
}

const RevisionItem = ({
    title,
    object_type,
    module_id,
    id,
    module_object_context: ModuleObjectContext,
}: PublicModuleObjectShort) => {
    const model = models[object_type as ModelType]

    if (!model) return

    const { slugOverview, plural } = model.defaults

    const action = getPublicObjectActionText(ModuleObjectContext?.action)
    const Icon = getPublicObjectActionIcon(ModuleObjectContext?.action)

    return (
        <div className="flex items-center gap-2">
            {Icon && (
                <Tooltip label={action || ''}>
                    <div
                        className={clsx(
                            '-mt-1 flex h-4 w-4 cursor-help items-center justify-center rounded',
                            {
                                'bg-pzh-green-500':
                                    ModuleObjectContext?.action === 'Create',
                                'bg-pzh-red-500':
                                    ModuleObjectContext?.action === 'Terminate',
                                'bg-pzh-blue-500':
                                    ModuleObjectContext?.action === 'Edit',
                            }
                        )}>
                        <Icon
                            size={
                                ModuleObjectContext?.action === 'Edit' ? 10 : 14
                            }
                            className="text-pzh-white"
                        />
                    </div>
                </Tooltip>
            )}

            <Hyperlink asChild>
                <Link
                    to={`/${slugOverview}/${plural}/ontwerpversie/${module_id}/${id}`}>
                    {title}
                </Link>
            </Hyperlink>
        </div>
    )
}

export default Module
