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
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { useRevisionsModuleIdGet } from '@/api/fetchers'
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
    Module_ID,
    Title,
    Description,
    Status,
}: PublicModuleShort) => {
    const { data, isLoading } = useRevisionsModuleIdGet(Module_ID)

    /**
     * Disable tabs which have no objects
     */
    const disabledKeys = useMemo(() => {
        if (!data?.Objects) return availableTypes

        const availableKeys = new Set<AvailableType>()

        data.Objects.forEach(({ Object_Type }) => {
            const model = models[Object_Type as ModelType]
            if (model?.defaults.singular) {
                availableKeys.add(model.defaults.singular)
            }
        })

        return availableTypes.filter(type => !availableKeys.has(type))
    }, [data?.Objects])

    /**
     * Group objects by availableType
     */
    const groupedObjects = useMemo(() => {
        if (!data?.Objects)
            return Object.fromEntries(availableTypes.map(type => [type, []]))

        const groups = Object.fromEntries(
            availableTypes.map(
                type => [type, []] as [AvailableType, PublicModuleObjectShort[]]
            )
        )

        data.Objects.forEach(object => {
            const model = models[object.Object_Type as ModelType]
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
                    (a.ModuleObjectContext?.Action || '').localeCompare(
                        b.ModuleObjectContext?.Action || ''
                    ) || a.Title.localeCompare(b.Title)
                )
            })
        })

        return groups
    }, [data?.Objects])

    return (
        <Container>
            <div className="col-span-6 grid gap-4">
                <div>
                    <span className="text-pzh-gray-600">Module</span>
                    <div className="flex items-center">
                        <Heading level="2">{Title}</Heading>
                        <Badge
                            text={Status?.Status.replace('-', ' ') || ''}
                            variant={getModuleStatusColor(Status?.Status)}
                            upperCase={false}
                            className="-mt-2 ml-3 whitespace-nowrap"
                        />
                    </div>
                </div>
                {Description && <Text>{Description}</Text>}
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
                                                    object.Object_Type +
                                                    object.Object_ID
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
    Title,
    Object_Type,
    Module_ID,
    UUID,
    ModuleObjectContext,
}: PublicModuleObjectShort) => {
    const model = models[Object_Type as ModelType]

    if (!model) return

    const { slugOverview, plural } = model.defaults

    const action = getPublicObjectActionText(ModuleObjectContext?.Action)
    const Icon = getPublicObjectActionIcon(ModuleObjectContext?.Action)

    return (
        <div className="flex items-center gap-2">
            {Icon && (
                <Tooltip label={action || ''}>
                    <div
                        className={clsx(
                            '-mt-1 flex h-4 w-4 cursor-help items-center justify-center rounded',
                            {
                                'bg-pzh-green-500':
                                    ModuleObjectContext?.Action === 'Create',
                                'bg-pzh-red-500':
                                    ModuleObjectContext?.Action === 'Terminate',
                                'bg-pzh-blue-500':
                                    ModuleObjectContext?.Action === 'Edit',
                            }
                        )}>
                        <Icon
                            size={
                                ModuleObjectContext?.Action === 'Edit' ? 10 : 14
                            }
                            className="text-pzh-white"
                        />
                    </div>
                </Tooltip>
            )}

            <Hyperlink asChild>
                <Link
                    to={`/${slugOverview}/${plural}/ontwerpversie/${Module_ID}/${UUID}`}>
                    {Title}
                </Link>
            </Hyperlink>
        </div>
    )
}

export default Module
